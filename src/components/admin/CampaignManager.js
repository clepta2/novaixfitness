import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { typography } from '../../styles';

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'Todos', icon: 'people' },
  { value: 'premium', label: 'Premium', icon: 'star' },
  { value: 'free', label: 'Free', icon: 'person' },
  { value: 'marketing', label: 'Marketing', icon: 'mail' },
];

const QUICK_MESSAGES = [
  { title: 'Novo treino!', body: 'Confira o novo treino disponível na app!' },
  { title: 'Motivação', body: 'Não desista! Cada treino te aproxima do seu objetivo.' },
  { title: 'Streak em risco', body: 'Você está a um treino de manter sua sequência!' },
  { title: 'Promoção', body: 'Aproveite 30% OFF em qualquer plano premium.' },
];

export default function CampaignManager() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const applyQuickMessage = (msg) => {
    setTitle(msg.title);
    setBody(msg.body);
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Erro', 'Preencha título e mensagem');
      return;
    }
    Alert.alert('Confirmar', `Enviar notificação para "${AUDIENCE_OPTIONS.find(a => a.value === audience)?.label}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Enviar', onPress: sendCampaign },
    ]);
  };

  const sendCampaign = async () => {
    setSending(true);
    setLastResult(null);
    try {
      let query = supabase.from('profiles').select('push_token').not('push_token', 'is', null);
      if (audience === 'marketing') query = query.eq('consent_marketing', true);
      if (audience === 'premium') query = query.eq('subscription_status', 'premium');
      if (audience === 'free') query = query.in('subscription_status', ['inactive', 'free', null]);

      const { data: profiles } = await query;
      const tokens = (profiles || []).map(p => p.push_token).filter(Boolean);

      if (tokens.length === 0) {
        Alert.alert('Aviso', 'Nenhum usuário encontrado para essa audiência');
        setSending(false);
        return;
      }

      const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title,
        body,
        data: { type: 'campaign' },
      }));

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messages),
      });

      await response.json();
      setLastResult({ sent: tokens.length, success: true });
      Alert.alert('Sucesso', `Notificação enviada para ${tokens.length} usuários`);
      setTitle('');
      setBody('');
    } catch (err) {
      setLastResult({ sent: 0, success: false, error: err.message });
      Alert.alert('Erro', err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={typography.h5}>CAMPANHAS</Text>
        {lastResult && (
          <View style={[styles.resultBadge, lastResult.success ? styles.resultSuccess : styles.resultError]}>
            <Text style={styles.resultText}>{lastResult.sent} enviados</Text>
          </View>
        )}
      </View>

      <Text style={styles.label}>MENSAGENS RÁPIDAS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickScroll}>
        {QUICK_MESSAGES.map((msg, i) => (
          <TouchableOpacity key={i} style={styles.quickCard} onPress={() => applyQuickMessage(msg)} accessibilityLabel={`Mensagem rápida: ${msg.title}`} accessibilityRole="button" accessibilityHint="Preenche o formulário com esta mensagem">
            <Text style={styles.quickTitle}>{msg.title}</Text>
            <Text style={styles.quickBody} numberOfLines={2}>{msg.body}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>TÍTULO</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título da notificação" placeholderTextColor={COLORS.textMuted} accessibilityLabel="Título da notificação" />

      <Text style={styles.label}>MENSAGEM</Text>
      <TextInput style={[styles.input, styles.inputMultiline]} value={body} onChangeText={setBody} placeholder="Texto da notificação" placeholderTextColor={COLORS.textMuted} multiline textAlignVertical="top" accessibilityLabel="Texto da notificação" />

      <Text style={styles.label}>PÚBLICO-ALVO</Text>
      <View style={styles.audienceRow}>
        {AUDIENCE_OPTIONS.map((opt) => (
          <TouchableOpacity key={opt.value} style={[styles.audienceBtn, audience === opt.value && styles.audienceActive]} onPress={() => setAudience(opt.value)} accessibilityLabel={`Público: ${opt.label}`} accessibilityRole="button" accessibilityState={{ selected: audience === opt.value }}>
            <Ionicons name={opt.icon} size={16} color={audience === opt.value ? COLORS.background : COLORS.textMuted} />
            <Text style={[styles.audienceLabel, audience === opt.value && styles.audienceLabelActive]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.sendBtn, sending && styles.sendBtnDisabled]} onPress={handleSend} disabled={sending} accessibilityLabel="Enviar campanha" accessibilityRole="button" accessibilityHint="Envia a notificação para os usuários selecionados">
        <Ionicons name="send" size={18} color={COLORS.background} />
        <Text style={styles.sendText}>{sending ? 'Enviando...' : 'ENVIAR CAMPANHA'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  resultBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 8 },
  resultSuccess: { backgroundColor: COLORS.success + '20' },
  resultError: { backgroundColor: COLORS.error + '20' },
  resultText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.success },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: SPACING.sm, marginTop: SPACING.md },
  quickScroll: { marginBottom: SPACING.md },
  quickCard: { width: 160, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  quickTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary, marginBottom: 4 },
  quickBody: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },
  input: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.sm },
  inputMultiline: { height: 100 },
  audienceRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  audienceBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  audienceActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  audienceLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  audienceLabelActive: { color: COLORS.background },
  sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingVertical: SPACING.lg, marginTop: SPACING.xl },
  sendBtnDisabled: { opacity: 0.6 },
  sendText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
});