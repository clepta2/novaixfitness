import { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert, Platform, Linking, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { Button, PlanCard, CouponInput, GuaranteeSection } from '../src/components';
import { PLANS, createCheckout, getPaymentStatus } from '../src/services/payment';
import { useAuth } from '../src/context/AuthContext';
import { typography } from '../src/styles';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const { user, loadProfile } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState('intermediate');
  const [coupon, setCoupon] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [paymentId, setPaymentId] = useState(null);
  const pollRef = useRef(null);
  const isWeb = Platform.OS === 'web';

  const handleSubscribe = async () => {
    setProcessing(true);
    setProcessStep('Criando cobrança...');

    try {
      const result = await createCheckout(selected, 'PIX');
      setPaymentId(result.paymentId);
      setProcessStep('Abrindo página de pagamento...');

      if (result.invoiceUrl) {
        await Linking.openURL(result.invoiceUrl);
      }

      setProcessStep('Aguardando confirmação do pagamento...');
      startPolling(result.paymentId);
    } catch (e) {
      setProcessing(false);
      Alert.alert('Erro', e.message || 'Não foi possível criar a cobrança. Tente novamente.');
    }
  };

  const startPolling = (id) => {
    let attempts = 0;
    const maxAttempts = 60;

    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(pollRef.current);
        setProcessing(false);
        Alert.alert('Tempo esgotado', 'O pagamento não foi confirmado. Verifique sua caixa de entrada ou tente novamente.');
        return;
      }

      try {
        const status = await getPaymentStatus(id);
        if (status?.payment?.status === 'CONFIRMED' || status?.payment?.status === 'RECEIVED') {
          clearInterval(pollRef.current);
          await loadProfile(user.id);
          setProcessing(false);
          Alert.alert('Pagamento Confirmado!', 'Seu plano foi ativado com sucesso.', [
            { text: 'Iniciar Tutorial', onPress: () => router.replace('/(tabs)/home') }
          ]);
        }
      } catch (e) {
        // Continuar polling mesmo com erro temporário
      }
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.accentLine} />
          <Text style={typography.h3}>LIBERE TODO O POTENCIAL</Text>
          <Text style={typography.bodyMuted}>Escolha o plano ideal para sua evolução</Text>
          <View style={styles.badge}><Ionicons name="gift" size={14} color={COLORS.background} /><Text style={styles.badgeText}>1 MÊS GRÁTIS DE TASTE TEST</Text></View>
        </View>

        <View style={styles.plans}>
          {Object.values(PLANS).map((plan) => (
            <PlanCard key={plan.id} plan={plan} isSelected={selected === plan.id} onSelect={setSelected} />
          ))}
        </View>

        <CouponInput onApply={setCoupon} />
        <GuaranteeSection />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="ATIVAR 1 MÊS GRÁTIS" onPress={handleSubscribe} disabled={processing} icon="card-outline" />
      </View>

      {processing && (
        <Modal visible transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => { if (!paymentId) { clearInterval(pollRef.current); setProcessing(false); } }}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, isWeb && styles.modalContentWeb]}>
                  <View style={styles.processingWrap}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[typography.h4, { marginTop: 20 }]}>PROCESSANDO</Text>
                    <Text style={[typography.bodyMuted, { textAlign: 'center', marginTop: 10 }]}>{processStep}</Text>
                    {paymentId && (
                      <TouchableOpacity onPress={() => { clearInterval(pollRef.current); setProcessing(false); }} style={{ marginTop: SPACING.lg }}>
                        <Text style={{ color: COLORS.textMuted, fontSize: 13 }}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  footer: { padding: SPACING.xl, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  accentLine: { width: 40, height: 4, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: SPACING.lg },
  badge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.full, marginTop: SPACING.xl },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background, letterSpacing: 1 },
  plans: { gap: SPACING.md, marginBottom: SPACING.xl },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.background, borderRadius: 20, padding: SPACING.xl, width: '85%' },
  modalContentWeb: { width: 400, maxHeight: '50%' },
  processingWrap: { alignItems: 'center', paddingVertical: 20 },
});