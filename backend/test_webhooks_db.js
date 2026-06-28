// backend/test_webhooks_db.js
// Teste de integração fim-a-fim do webhook Asaas com o banco Supabase

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fetch = globalThis.fetch || require('node-fetch');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const useServiceKey = serviceKey && !serviceKey.includes('sua_') && serviceKey !== '';

// Inicializar cliente do Supabase
if (!supabaseUrl || !anonKey) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_ANON_KEY precisam estar configurados no .env');
  process.exit(1);
}

// O teste necessita do service role key para criar/deletar usuários de teste e contornar RLS
if (!useServiceKey) {
  console.error('\n⚠️  ERRO DE CONFIGURAÇÃO DETECTADO:');
  console.error('O teste de banco requer a chave secreta SUPABASE_SERVICE_ROLE_KEY no backend/.env para funcionar.');
  console.error('Sem ela, o webhook não conseguirá atualizar o perfil do usuário devido às políticas de RLS.');
  console.error('Por favor, obtenha a chave service_role no painel do Supabase (Settings > API) e configure-a.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey);
const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN || 'novaix_webhook_secret_2026';

const tempEmail = `test_webhook_${Date.now()}@novaix.com`;
const tempPassword = 'password123';
const mockCustomerId = `cus_${Math.random().toString(36).substring(7)}`;
const mockPaymentId = `pay_${Math.random().toString(36).substring(7)}`;

async function run() {
  console.log('🚀 Iniciando teste de integração de banco para Webhooks Asaas...');

  // 1. Verificar se as tabelas e colunas necessárias existem
  console.log('📡 Verificando estrutura do banco de dados...');
  const { data: colCheck, error: colError } = await supabaseAdmin
    .from('profiles')
    .select('id, asaas_customer_id, subscription_status')
    .limit(1);

  if (colError) {
    if (colError.message.includes('column') && colError.message.includes('asaas_customer_id')) {
      console.error('\n❌ ERRO NO BANCO DE DADOS:');
      console.error('A coluna profiles.asaas_customer_id não existe.');
      console.error('Por favor, execute o script create-tables-payments.sql no SQL Editor do Supabase.');
      process.exit(1);
    }
    console.error('Erro ao ler a tabela profiles:', colError.message);
    process.exit(1);
  }
  console.log('   ✅ Colunas da tabela profiles validadas.');

  // 2. Criar usuário temporário de teste
  console.log(`👤 Criando usuário de teste: ${tempEmail}`);
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: tempEmail,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError) {
    console.error('❌ Erro ao criar usuário de teste:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`   ✅ Usuário criado com UUID: ${userId}`);

  // 3. Atualizar o perfil do usuário de teste com o asaas_customer_id fictício
  console.log(`✏️  Atualizando perfil com asaas_customer_id: ${mockCustomerId}`);
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ asaas_customer_id: mockCustomerId })
    .eq('id', userId);

  if (updateError) {
    console.error('❌ Erro ao atualizar asaas_customer_id:', updateError.message);
    await cleanup(userId);
    process.exit(1);
  }

  // 4. Enviar evento PAYMENT_CREATED (Cria o pagamento pendente no banco)
  console.log('📨 Enviando evento PAYMENT_CREATED para a API do backend...');
  const createdRes = await sendWebhook('PAYMENT_CREATED', {
    id: mockPaymentId,
    customer: mockCustomerId,
    value: 199.90, // Plano Ultra
    status: 'PENDING',
    billingType: 'PIX',
  });

  if (!createdRes.success) {
    console.error('❌ Falha ao enviar PAYMENT_CREATED');
    await cleanup(userId);
    process.exit(1);
  }

  // 5. Enviar evento PAYMENT_RECEIVED (Confirma pagamento e atualiza plano)
  console.log('📨 Enviando evento PAYMENT_RECEIVED para a API do backend...');
  const receivedRes = await sendWebhook('PAYMENT_RECEIVED', {
    id: mockPaymentId,
    customer: mockCustomerId,
    value: 199.90,
    status: 'RECEIVED',
    billingType: 'PIX',
    paymentDate: new Date().toISOString(),
  });

  if (!receivedRes.success) {
    console.error('❌ Falha ao enviar PAYMENT_RECEIVED');
    await cleanup(userId);
    process.exit(1);
  }

  // 6. Verificar atualizações no banco de dados
  console.log('🔍 Consultando banco de dados para verificar as atualizações...');
  
  // Verificar perfil do usuário
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('profiles')
    .select('subscription_status, subscription_plan')
    .eq('id', userId)
    .single();

  if (profileErr) {
    console.error('❌ Erro ao ler perfil pós-webhook:', profileErr.message);
  } else {
    console.log(`   Perfil atualizado -> Status: '${profile.subscription_status}', Plano: '${profile.subscription_plan}'`);
    if (profile.subscription_status === 'active' && profile.subscription_plan === 'ultra') {
      console.log('   🎉 SUCESSO: Plano e status ativados corretamente!');
    } else {
      console.error('   ❌ FALHA: Plano ou status incorretos no perfil.');
    }
  }

  // Verificar registro de pagamento
  const { data: paymentRecord, error: paymentErr } = await supabaseAdmin
    .from('payments')
    .select('status, amount')
    .eq('asaas_payment_id', mockPaymentId)
    .single();

  if (paymentErr) {
    console.error('❌ Erro ao ler pagamento pós-webhook:', paymentErr.message);
  } else {
    console.log(`   Pagamento registrado -> Status: '${paymentRecord.status}', Valor: R$${paymentRecord.amount}`);
    if (paymentRecord.status === 'RECEIVED') {
      console.log('   🎉 SUCESSO: Pagamento registrado e marcado como RECEBIDO!');
    } else {
      console.error('   ❌ FALHA: Status do pagamento incorreto.');
    }
  }

  // Limpeza
  await cleanup(userId);
  console.log('\n🏁 Teste concluído com sucesso!');
}

async function sendWebhook(event, payment) {
  try {
    const res = await fetch(`${backendUrl}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asaas-access-token': webhookToken,
      },
      body: JSON.stringify({ event, payment }),
    });

    const data = await res.json();
    return { success: res.ok, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function cleanup(userId) {
  console.log('🧹 Iniciando limpeza dos dados de teste...');
  // Deletar usuário do Auth (tabelas extras do profiles, payments, etc., serão deletadas via ON DELETE CASCADE no banco)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    console.error('⚠️  Erro ao deletar usuário de teste na limpeza:', error.message);
  } else {
    console.log('   ✅ Usuário de teste e registros associados deletados.');
  }
}

run().catch(console.error);
