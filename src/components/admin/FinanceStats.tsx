import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

const PLAN_PRICES: Record<string, number> = { basic: 49.9, intermediate: 79.9, premium: 119.9, ultra: 199.9 };

interface FinanceStats {
  mrr: number;
  active: number;
  churn: string | number;
  newMonth: number;
}

export default function FinanceStats(): React.JSX.Element {
  const [stats, setStats] = useState<FinanceStats>({ mrr: 0, active: 0, churn: 0, newMonth: 0 });

  useEffect(() => { loadStats(); }, []);

  async function loadStats(): Promise<void> {
    try {
      const { data: profiles } = await supabase.from('profiles').select('subscription_status, subscription_plan, created_at');
      if (!profiles) return;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

      const active = profiles.filter((p: any) => p.subscription_status === 'premium' || p.subscription_status === 'active');
      const mrr = active.reduce((sum: number, p: any) => sum + (PLAN_PRICES[p.subscription_plan] || 49.9), 0);

      const thisMonth = profiles.filter((p: any) => p.created_at >= monthStart).length;
      const lastMonth = profiles.filter((p: any) => p.created_at >= lastMonthStart && p.created_at < monthStart).length;
      const churn = lastMonth > 0 ? Math.max(0, ((lastMonth - thisMonth) / lastMonth) * 100).toFixed(1) : '0.0';

      setStats({ mrr, active: active.length, churn, newMonth: thisMonth });
    } catch (err) {
      console.error('Erro ao carregar stats financeiros:', err);
    }
  }

  const cards = [
    { label: 'MRR', value: `R$ ${stats.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`, icon: 'cash' as const, color: COLORS.primary },
    { label: 'ATIVOS', value: stats.active, icon: 'checkmark-circle' as const, color: COLORS.success },
    { label: 'CHURN', value: `${stats.churn}%`, icon: 'trending-down' as const, color: COLORS.error },
    { label: 'NOVOS/MÊS', value: stats.newMonth, icon: 'person-add' as const, color: COLORS.info },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((card, i) => (
        <View key={i} style={styles.card}>
          <Ionicons name={card.icon} size={16} color={card.color} />
          <Text style={styles.label}>{card.label}</Text>
          <Text style={[styles.value, { color: card.color }]}>{card.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  card: { width: '47%', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  label: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5, marginTop: SPACING.xs },
  value: { fontFamily: 'Montserrat_700Bold', fontSize: 22, marginTop: SPACING.sm },
});
