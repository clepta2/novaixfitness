// backend/test_webhooks.js
// Script de teste para webhooks Asaas com Ngrok - NOVAIX FITNESS

// Usa fetch nativo do Node 18+ ou node-fetch
const fetch = globalThis.fetch || require('node-fetch');

require('dotenv').config({ path: __dirname + '/.env' });
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || 'novaix_webhook_secret_2026';

// ========================================
// DADOS DE TESTE
// ========================================

const TEST_CUSTOMER_ID = 'cus_test123456';
const TEST_PAYMENT_ID = 'pay_test789012';
const TEST_SUBSCRIPTION_ID = 'sub_test345678';
const TEST_USER_ID = 'user_test901234';

// ========================================
// PAYLOADS DE WEBHOOK
// ========================================

const webhookPayloads = {
  PAYMENT_RECEIVED: {
    event: 'PAYMENT_RECEIVED',
    payment: {
      id: TEST_PAYMENT_ID,
      customer: TEST_CUSTOMER_ID,
      value: 79.90,
      status: 'RECEIVED',
      billingType: 'PIX',
      paymentDate: new Date().toISOString(),
    },
  },

  PAYMENT_CREATED: {
    event: 'PAYMENT_CREATED',
    payment: {
      id: TEST_PAYMENT_ID,
      customer: TEST_CUSTOMER_ID,
      value: 79.90,
      status: 'PENDING',
      billingType: 'PIX',
    },
  },

  PAYMENT_UPDATED: {
    event: 'PAYMENT_UPDATED',
    payment: {
      id: TEST_PAYMENT_ID,
      status: 'CONFIRMED',
    },
  },

  PAYMENT_OVERDUE: {
    event: 'PAYMENT_OVERDUE',
    payment: {
      id: TEST_PAYMENT_ID,
      customer: TEST_CUSTOMER_ID,
      status: 'OVERDUE',
    },
  },

  PAYMENT_DELETED: {
    event: 'PAYMENT_DELETED',
    payment: {
      id: TEST_PAYMENT_ID,
      status: 'DELETED',
    },
  },

  PAYMENT_REFUNDED: {
    event: 'PAYMENT_REFUNDED',
    payment: {
      id: TEST_PAYMENT_ID,
      customer: TEST_CUSTOMER_ID,
      status: 'REFUNDED',
    },
  },

  SUBSCRIPTION_CREATED: {
    event: 'SUBSCRIPTION_CREATED',
    subscription: {
      id: TEST_SUBSCRIPTION_ID,
      customer: TEST_CUSTOMER_ID,
      value: 79.90,
      status: 'ACTIVE',
    },
  },

  SUBSCRIPTION_UPDATED: {
    event: 'SUBSCRIPTION_UPDATED',
    subscription: {
      id: TEST_SUBSCRIPTION_ID,
      status: 'ACTIVE',
    },
  },

  SUBSCRIPTION_DELETED: {
    event: 'SUBSCRIPTION_DELETED',
    subscription: {
      id: TEST_SUBSCRIPTION_ID,
    },
  },

  SUBSCRIPTION_INACTIVATED: {
    event: 'SUBSCRIPTION_INACTIVATED',
    subscription: {
      id: TEST_SUBSCRIPTION_ID,
    },
  },

  SUBSCRIPTION_REACTIVATED: {
    event: 'SUBSCRIPTION_REACTIVATED',
    subscription: {
      id: TEST_SUBSCRIPTION_ID,
    },
  },
};

// ========================================
// FUNÇÕES DE TESTE
// ========================================

async function testWebhook(eventName, payload) {
  console.log(`\n🧪 Testando: ${eventName}`);

  try {
    const response = await fetch(`${BACKEND_URL}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asaas-access-token': WEBHOOK_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Sucesso (200): ${JSON.stringify(data)}`);
    } else {
      console.log(`   ❌ Erro (${response.status}): ${JSON.stringify(data)}`);
    }

    return { success: response.ok, status: response.status, data };
  } catch (err) {
    console.log(`   ❌ Erro de conexão: ${err.message}`);
    return { success: false, error: err.message };
  }
}

async function testInvalidToken() {
  console.log('\n🔒 Testando: Token inválido');

  try {
    const response = await fetch(`${BACKEND_URL}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asaas-access-token': 'token-invalido',
      },
      body: JSON.stringify(webhookPayloads.PAYMENT_RECEIVED),
    });

    const data = await response.json();

    if (response.status === 401) {
      console.log(`   ✅ Token rejeitado corretamente (401): ${JSON.stringify(data)}`);
    } else {
      console.log(`   ⚠️ Esperado 401, recebido ${response.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log(`   ❌ Erro de conexão: ${err.message}`);
  }
}

async function testMissingToken() {
  console.log('\n🔒 Testando: Token ausente');

  try {
    const response = await fetch(`${BACKEND_URL}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayloads.PAYMENT_RECEIVED),
    });

    const data = await response.json();

    if (response.status === 401) {
      console.log(`   ✅ Token ausente rejeitado (401): ${JSON.stringify(data)}`);
    } else {
      console.log(`   ⚠️ Esperado 401, recebido ${response.status}: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log(`   ❌ Erro de conexão: ${err.message}`);
  }
}

async function testUnknownEvent() {
  console.log('\n❓ Testando: Evento desconhecido');

  try {
    const response = await fetch(`${BACKEND_URL}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asaas-access-token': WEBHOOK_TOKEN,
      },
      body: JSON.stringify({ event: 'UNKNOWN_EVENT', data: {} }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Evento ignorado (200): ${JSON.stringify(data)}`);
    } else {
      console.log(`   ❌ Erro (${response.status}): ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.log(`   ❌ Erro de conexão: ${err.message}`);
  }
}

// ========================================
// MAIN
// ========================================

async function runAllTests() {
  console.log('🚀 NOVAIX FITNESS - Teste de Webhooks Asaas');
  console.log('━'.repeat(50));
  console.log(`📡 Backend: ${BACKEND_URL}`);
  console.log(`🔑 Token: ${WEBHOOK_TOKEN.substring(0, 10)}...`);
  console.log('━'.repeat(50));

  // Testar conexão
  try {
    const health = await fetch(`${BACKEND_URL}/health`);
    if (!health.ok) throw new Error('Backend não está respondendo');
    console.log('✅ Backend está rodando');
  } catch (err) {
    console.log(`❌ Backend não está acessível: ${err.message}`);
    console.log('\n💡 Inicie o backend com:');
    console.log('   cd backend && npm run dev');
    return;
  }

  const results = [];

  // Testar segurança
  await testInvalidToken();
  await testMissingToken();
  await testUnknownEvent();

  // Testar cada evento
  for (const [eventName, payload] of Object.entries(webhookPayloads)) {
    const result = await testWebhook(eventName, payload);
    results.push({ event: eventName, ...result });
  }

  // Resumo
  console.log('\n' + '━'.repeat(50));
  console.log('📊 RESUMO DOS TESTES');
  console.log('━'.repeat(50));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Passaram: ${passed}/${results.length}`);
  if (failed > 0) {
    console.log(`❌ Falharam: ${failed}/${results.length}`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.event}: ${r.error || `Status ${r.status}`}`);
    });
  }

  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('1. Instale o Ngrok: https://ngrok.com/download');
  console.log('2. Execute: ngrok http 3000');
  console.log('3. Copie a URL pública (ex: https://abc123.ngrok-free.app)');
  console.log('4. Configure no painel Asaas > Webhooks > URL de notificação');
  console.log('5. Envie um pagamento de teste no sandbox Asaas');
  console.log('6. Verifique os logs no terminal do backend');
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testWebhook, webhookPayloads };
