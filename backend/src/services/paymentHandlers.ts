// src/services/paymentHandlers.ts
// Handlers para eventos de Pagamento do Asaas

import supabase from '../config/supabase';
import { determinePlanType } from './subscriptionHandlers';

async function handlePaymentReceived(payment: any): Promise<void> {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) {
    console.warn('Perfil não encontrado para customer:', customerId);
    return;
  }

  await supabase
    .from('payments')
    .update({
      status: 'RECEIVED',
      paid_at: payment.paymentDate || new Date(),
    })
    .eq('asaas_payment_id', payment.id);

  // Buscar plan_type do banco ou calcular pelo valor pago
  const { data: dbPayment } = await supabase
    .from('payments')
    .select('plan_type')
    .eq('asaas_payment_id', payment.id)
    .single();

  const planType = dbPayment?.plan_type || determinePlanType(payment.value);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_plan: planType,
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.info('✅ Pagamento confirmado para user:', profile.id, 'plano:', planType);
}

async function handlePaymentCreated(payment: any): Promise<void> {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase.from('payments').upsert({
    user_id: profile.id,
    asaas_payment_id: payment.id,
    asaas_customer_id: customerId,
    amount: payment.value,
    status: payment.status,
    billing_type: payment.billingType,
  }, { onConflict: 'asaas_payment_id' });
}

async function handlePaymentUpdated(payment: any): Promise<void> {
  await supabase
    .from('payments')
    .update({ status: payment.status })
    .eq('asaas_payment_id', payment.id);
}

async function handlePaymentOverdue(payment: any): Promise<void> {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase
    .from('payments')
    .update({ status: 'OVERDUE' })
    .eq('asaas_payment_id', payment.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'overdue',
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.warn('⚠️ Pagamento atrasado para user:', profile.id);
}

async function handlePaymentDeleted(payment: any): Promise<void> {
  await supabase
    .from('payments')
    .update({ status: 'DELETED' })
    .eq('asaas_payment_id', payment.id);
}

async function handlePaymentRefunded(payment: any): Promise<void> {
  const customerId = payment.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  await supabase
    .from('payments')
    .update({ status: 'REFUNDED' })
    .eq('asaas_payment_id', payment.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'free',
      subscription_plan: null,
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.info('💸 Reembolso processado para user:', profile.id);
}

export {
  handlePaymentReceived,
  handlePaymentCreated,
  handlePaymentUpdated,
  handlePaymentOverdue,
  handlePaymentDeleted,
  handlePaymentRefunded,
};
