// src/components/profile/CoachCommissionsPanel.tsx
// Componente de comissões e saques para Coach

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { supabase } from '../../config/supabase';
import WithdrawForm from './WithdrawForm';
import { styles } from './coachCommissionsStyles';

export default function CoachCommissionsPanel() {
  const [balance, setBalance] = useState({
    total_earned: 0,
    available_balance: 0,
    pending_amount: 0,
    withdrawn_amount: 0,
  });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState('EMAIL');
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchCommissionsData();
  }, []);

  const fetchCommissionsData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [balanceRes, withdrawalsRes] = await Promise.all([
        supabase.rpc('get_coach_balance', { p_coach_id: user.id }),
        supabase.from('coach_withdrawals').select('*').eq('coach_id', user.id).order('created_at', { ascending: false }).limit(5)
      ]);

      if (balanceRes.data?.[0]) setBalance(balanceRes.data[0]);
      if (withdrawalsRes.data) setWithdrawals(withdrawalsRes.data);
    } catch (err) {
      if (__DEV__) console.warn('Erro ao carregar comissões:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !pixKey) {
      return Alert.alert('Erro', 'Preencha o valor e a chave Pix.');
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val < 50) {
      return Alert.alert('Erro', 'O valor mínimo para saque é R$ 50,00.');
    }
    if (val > balance.available_balance) {
      return Alert.alert('Erro', 'Saldo disponível insuficiente.');
    }

    setWithdrawing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/commissions/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          amount: val,
          pixKey,
          pixKeyType
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Erro ao processar saque');

      Alert.alert('Sucesso', 'Saque via Pix solicitado com sucesso!');
      setAmount('');
      setPixKey('');
      fetchCommissionsData();
    } catch (err) {
      Alert.alert('Erro no Saque', err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>SAQUES & COMISSÕES</Text>
      
      <View style={styles.balanceGrid}>
        <View style={styles.balanceBox}>
          <Text style={styles.boxLabel}>Disponível para Saque</Text>
          <Text style={[styles.boxValue, { color: COLORS.primary }]}>R$ {parseFloat(balance.available_balance).toFixed(2)}</Text>
        </View>
        <View style={styles.balanceBox}>
          <Text style={styles.boxLabel}>Aguardando Liberação</Text>
          <Text style={styles.boxValue}>R$ {parseFloat(balance.pending_amount).toFixed(2)}</Text>
        </View>
      </View>

      <WithdrawForm
        amount={amount}
        onAmountChange={setAmount}
        pixKey={pixKey}
        onPixKeyChange={setPixKey}
        pixKeyType={pixKeyType}
        onPixKeyTypeChange={setPixKeyType}
        onWithdraw={handleWithdraw}
        withdrawing={withdrawing}
      />

      <Text style={styles.historyTitle}>ÚLTIMOS SAQUES SOLICITADOS</Text>
      {withdrawals.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum saque solicitado ainda.</Text>
      ) : (
        withdrawals.map((w) => (
          <View key={w.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyAmount}>R$ {parseFloat(w.amount).toFixed(2)}</Text>
              <Text style={styles.historyDate}>{new Date(w.created_at).toLocaleDateString('pt-BR')}</Text>
            </View>
            <View style={[styles.statusBadge, w.status === 'completed' ? styles.statusSuccess : w.status === 'failed' ? styles.statusFailed : styles.statusPending]}>
              <Text style={styles.statusText}>{w.status.toUpperCase()}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}


