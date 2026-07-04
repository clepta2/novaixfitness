// src/services/transferHandlers.ts
// Handlers para eventos de transferência do Asaas - NOVAIX FITNESS

import supabase from '../config/supabase';

async function handleTransferConfirmed(transfer: any): Promise<void> {
  if (!transfer?.id) return;
  console.info(`💸 Transferência confirmada: ${transfer.id}`);

  // Atualizar o saque para concluído
  await supabase
    .from('coach_withdrawals')
    .update({
      status: 'completed',
      processed_at: new Date().toISOString()
    })
    .eq('asaas_transfer_id', transfer.id);
}

async function handleTransferFailed(transfer: any): Promise<void> {
  if (!transfer?.id) return;
  console.warn(`❌ Transferência falhou: ${transfer.id} | Motivo: ${transfer.failReason}`);

  // 1. Atualizar status do saque para falho
  const { data: withdrawal } = await supabase
    .from('coach_withdrawals')
    .update({
      status: 'failed',
      failure_reason: transfer.failReason || 'Falha no processamento Pix'
    })
    .eq('asaas_transfer_id', transfer.id)
    .select()
    .single();

  if (withdrawal) {
    // 2. Reverter comissões de 'paid' ou 'requested' de volta para 'available'
    // correspondente ao valor do saque que falhou
    await supabase
      .from('coach_commissions')
      .update({ status: 'available' })
      .eq('coach_id', withdrawal.coach_id)
      .eq('status', 'paid')
      .lte('net_amount', withdrawal.amount);
  }
}

export {
  handleTransferConfirmed,
  handleTransferFailed
};
