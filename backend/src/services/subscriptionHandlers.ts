// src/services/subscriptionHandlers.ts
// Handlers para eventos de Assinatura do Asaas

import supabase from '../config/supabase';

function determinePlanType(value: number): string {
  if (value <= 49.90) return 'basic';
  if (value <= 79.90) return 'intermediate';
  if (value <= 119.90) return 'premium';
  return 'ultra';
}

async function handleSubscriptionCreated(subscription: any): Promise<void> {
  const customerId = subscription.customer;
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('asaas_customer_id', customerId)
    .single();

  if (!profile) return;

  const plan = determinePlanType(subscription.value);

  await supabase.from('subscriptions').upsert({
    user_id: profile.id,
    asaas_subscription_id: subscription.id,
    asaas_customer_id: customerId,
    plan_type: plan,
    status: subscription.status,
    value: subscription.value,
  }, { onConflict: 'asaas_subscription_id' });

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_plan: plan,
      asaas_subscription_id: subscription.id,
      updated_at: new Date(),
    })
    .eq('id', profile.id);

  console.info('✅ Assinatura criada para user:', profile.id);
}

async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  await supabase
    .from('subscriptions')
    .update({ status: subscription.status })
    .eq('asaas_subscription_id', subscription.id);
}

async function handleSubscriptionDeleted(subscription: any): Promise<void> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'cancelled',
      asaas_subscription_id: null,
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);

  console.info('❌ Assinatura cancelada para user:', sub.user_id);
}

async function handleSubscriptionInactivated(subscription: any): Promise<void> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'inactive' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'inactive',
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);
}

async function handleSubscriptionReactivated(subscription: any): Promise<void> {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('asaas_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  await supabase
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('asaas_subscription_id', subscription.id);

  await supabase
    .from('profiles')
    .update({
      subscription_status: 'active',
      updated_at: new Date(),
    })
    .eq('id', sub.user_id);
}

export {
  determinePlanType,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleSubscriptionInactivated,
  handleSubscriptionReactivated,
};
