// backend/scripts/test-webhook.js
// Script de teste para webhooks Asaas - NOVAIX FITNESS
// Uso: node scripts/test-webhook.js <url>

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || 'test-token';

const testEvents = [
  {
    name: 'PAYMENT_RECEIVED (PIX)',
    payload: {
      event: 'PAYMENT_RECEIVED',
      payment: {
        id: 'pay_test_001',
        customer: 'cus_test_001',
        value: 79.90,
        status: 'RECEIVED',
        billingType: 'PIX',
        paymentDate: new Date().toISOString(),
      },
    },
  },
  {
    name: 'PAYMENT_RECEIVED (Cartão)',
    payload: {
      event: 'PAYMENT_RECEIVED',
      payment: {
        id: 'pay_test_002',
        customer: 'cus_test_001',
        value: 49.90,
        status: 'RECEIVED',
        billingType: 'CREDIT_CARD',
        paymentDate: new Date().toISOString(),
      },
    },
  },
  {
    name: 'PAYMENT_OVERDUE',
    payload: {
      event: 'PAYMENT_OVERDUE',
      payment: {
        id: 'pay_test_003',
        customer: 'cus_test_001',
        value: 119.90,
        status: 'OVERDUE',
        billingType: 'PIX',
      },
    },
  },
  {
    name: 'PAYMENT_REFUNDED',
    payload: {
      event: 'PAYMENT_REFUNDED',
      payment: {
        id: 'pay_test_004',
        customer: 'cus_test_001',
        value: 79.90,
        status: 'REFUNDED',
      },
    },
  },
  {
    name: 'SUBSCRIPTION_CREATED',
    payload: {
      event: 'SUBSCRIPTION_CREATED',
      subscription: {
        id: 'sub_test_001',
        customer: 'cus_test_001',
        value: 79.90,
        status: 'ACTIVE',
      },
    },
  },
  {
    name: 'SUBSCRIPTION_DELETED',
    payload: {
      event: 'SUBSCRIPTION_DELETED',
      subscription: {
        id: 'sub_test_002',
        customer: 'cus_test_001',
      },
    },
  },
];

async function sendWebhook(event) {
  console.log(`\n📤 Enviando: ${event.name}`);
  console.log(`   URL: ${BASE_URL}/webhooks/asaas`);

  try {
    const response = await fetch(`${BASE_URL}/webhooks/asaas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'asaas-access-token': WEBHOOK_TOKEN,
      },
      body: JSON.stringify(event.payload),
    });

    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Resposta:`, data);
    return response.ok;
  } catch (err) {
    console.error(`   Erro:`, err.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Teste de Webhooks Asaas');
  console.log(`   Backend: ${BASE_URL}`);
  console.log(`   Token: ${WEBHOOK_TOKEN ? 'Configurado' : '⚠️ Não configurado'}`);
  console.log('');

  let passed = 0;
  let failed = 0;

  for (const event of testEvents) {
    const ok = await sendWebhook(event);
    if (ok) passed++;
    else failed++;
  }

  console.log('\n📊 Resultado:');
  console.log(`   ✅ Passou: ${passed}`);
  console.log(`   ❌ Falhou: ${failed}`);
  console.log(`   Total: ${testEvents.length}`);
}

runTests().catch(console.error);
