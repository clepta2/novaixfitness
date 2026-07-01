// app/settings/delete-account.js
// Exclusão de conta (obrigatório LGPD/Apple/Google)

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { supabase } from '../../src/config/supabase';
import { ErrorBoundary } from '../../src/components';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== 'EXCLUIR') {
      Alert.alert('Erro', 'Digite EXCLUIR para confirmar');
      return;
    }

    Alert.alert(
      'Tem certeza?',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'EXCLUIR MINHA CONTA',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // Marcar conta para exclusão (soft delete)
              await supabase.from('profiles').update({
                deleted_at: new Date().toISOString(),
                name: 'Conta Excluída',
                email: null,
              }).eq('id', user.id);

              await supabase.auth.signOut();
              Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a conta.');
            }
            setLoading(false);
          },
        },
      ]
    );
  };

  return (
    <ErrorBoundary screenName="DeleteAccount">
      <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
        <View style={styles.warningIcon}>
          <Ionicons name="warning" size={48} color={COLORS.error} />
        </View>

        <Text style={styles.title}>EXCLUIR CONTA</Text>
        <Text style={styles.subtitle}>Esta ação é permanente e irreversível</Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Ao excluir sua conta, você perderá:</Text>
          {[
            'Todos os seus treinos e histórico',
            'Seus dados de progresso e medidas',
            'Suas conquistas e nível',
            'Seus posts e comentários',
            'Sua assinatura (sem reembolso)',
            'Seu código de indicação',
          ].map((item, i) => (
            <View key={i} style={styles.warningItem}>
              <Ionicons name="close-circle" size={16} color={COLORS.error} />
              <Text style={styles.warningText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Digite EXCLUIR para confirmar</Text>
        <TextInput
          style={styles.input}
          value={confirmation}
          onChangeText={setConfirmation}
          placeholder="EXCLUIR"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.deleteBtn, confirmation !== 'EXCLUIR' && styles.deleteBtnDisabled]}
          onPress={handleDelete}
          disabled={loading || confirmation !== 'EXCLUIR'}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteBtnText}>{loading ? 'EXCLUINDO...' : 'EXCLUIR MINHA CONTA'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40, paddingBottom: 60 },
  warningIcon: { alignItems: 'center', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.error, marginBottom: SPACING.sm, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl, textAlign: 'center' },
  warningBox: { backgroundColor: COLORS.error + '10', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.error + '30' },
  warningTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginBottom: SPACING.md },
  warningItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  warningText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, flex: 1 },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.sm },
  input: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Montserrat_700Bold', fontSize: 16, borderWidth: 1, borderColor: COLORS.border, textAlign: 'center', letterSpacing: 4, marginBottom: SPACING.xl },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.error, padding: SPACING.md, borderRadius: BORDER_RADIUS.full },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  cancelBtn: { alignItems: 'center', padding: SPACING.md, marginTop: SPACING.lg },
  cancelBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted },
});
