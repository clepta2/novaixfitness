// app/subscription.js
// Tela de Gerenciamento de Assinatura - NOVAIX FITNESS

import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button } from '../src/components';
import { getCurrentSubscription, cancelSubscription, getPaymentHistory, PLANS } from '../src/services/payment';
import { useAuth } from '../src/context/AuthContext';
import { layout, typography } from '../src/styles';
import { styles } from '../src/styles/subscriptionStyles';
import { STATUS_MAP, INFO_ITEMS } from '../src/data/subscriptionData';


export default function SubscriptionScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [sub, history] = await Promise.all([
        getCurrentSubscription(),
        getPaymentHistory(),
      ]);
      setSubscription(sub);
      setPayments(history || []);
    } catch (err) {
      console.error('Erro ao carregar assinatura:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCancel = () => {
    if (Platform.OS === 'web') {
      const confirmCancel = confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso ao conteúdo premium.');
      if (confirmCancel) {
        (async () => {
          try {
            await cancelSubscription();
            alert('Sua assinatura foi cancelada.');
            fetchData();
          } catch (err) {
            alert('Erro: ' + err.message);
          }
        })();
      }
    } else {
      Alert.alert(
        'Cancelar assinatura',
        'Tem certeza que deseja cancelar? Você perderá acesso ao conteúdo premium.',
        [
          { text: 'Não', style: 'cancel' },
          {
            text: 'Sim, cancelar',
            style: 'destructive',
            onPress: async () => {
              try {
                await cancelSubscription();
                Alert.alert('Cancelado', 'Sua assinatura foi cancelada.');
                fetchData();
              } catch (err) {
                Alert.alert('Erro', err.message);
              }
            },
          },
        ]
      );
    }
  };

  const status = STATUS_MAP[subscription?.subscription_status] || STATUS_MAP.free;
  const currentPlan = PLANS[subscription?.subscription_plan] || null;

  if (loading) {
    return (
      <View style={[layout.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="sync" size={32} color={COLORS.primary} />
      </View>
    );
  }

  const isSubscribed = subscription?.subscription_status === 'active';

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll} showsVerticalScrollIndicator={false}>
      <View style={layout.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
        </TouchableOpacity>
        <Text style={typography.h2}>Minha Assinatura</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.statusCard, { borderColor: status.color + '40' }]}>
        <Ionicons name={status.icon} size={32} color={status.color} />
        <View style={styles.statusInfo}>
          <Text style={[typography.h3, { color: status.color }]}>{status.label}</Text>
          {currentPlan && (
            <Text style={typography.bodyMuted}>{currentPlan.name} - {currentPlan.priceText}{currentPlan.period}</Text>
          )}
          {!isSubscribed && !subscription?.subscription_plan && (
            <Text style={typography.bodyMuted}>Ative um plano para acessar todo o conteúdo</Text>
          )}
        </View>
      </View>

      {isSubscribed && currentPlan && (
        <View style={styles.planCard}>
          <Text style={typography.label}>PLANO ATUAL</Text>
          <Text style={typography.h3}>{currentPlan.name}</Text>
          <View style={styles.planFeatures}>
            {currentPlan.features.filter(f => f.included).map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                <Text style={typography.bodySmall}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {!isSubscribed && (
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => router.push('/paywall')}
        >
          <Ionicons name="rocket" size={24} color={COLORS.background} />
          <Text style={typography.h5}>ASSINAR AGORA</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.background} />
        </TouchableOpacity>
      )}

      {isSubscribed && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/paywall')}>
            <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
            <Text style={[typography.h5, { color: COLORS.primary }]}>Trocar Plano</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={handleCancel}>
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
            <Text style={[typography.h5, { color: COLORS.error }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {payments.length > 0 && (
        <View style={layout.section}>
          <Text style={typography.label}>HISTÓRICO DE PAGAMENTOS</Text>
          {payments.map((p) => (
            <View key={p.id} style={styles.paymentItem}>
              <View style={styles.paymentIcon}>
                <Ionicons
                  name={p.status === 'RECEIVED' ? 'checkmark-circle' : 'time'}
                  size={20}
                  color={p.status === 'RECEIVED' ? COLORS.success : COLORS.attention}
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={typography.h5}>Plano {PLANS[p.plan_type]?.name || p.plan_type}</Text>
                <Text style={typography.caption}>
                  {p.billing_type === 'PIX' ? 'PIX' : 'Cartão'} • {p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : ''}
                </Text>
              </View>
              <Text style={typography.h5}>R$ {p.amount?.toFixed(2).replace('.', ',')}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={layout.section}>
        <Text style={typography.label}>INFORMAÇÕES</Text>
        {INFO_ITEMS.map((item, i) => (
          <View key={i} style={styles.infoItem}>
            <Ionicons name={item.icon} size={20} color={COLORS.primary} />
            <View>
              <Text style={typography.h5}>{item.title}</Text>
              <Text style={typography.caption}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
