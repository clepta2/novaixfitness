
// app/progress/report.js
// Relatório mensal em PDF

import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ErrorBoundary } from '../../src/components';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { useAuth } from '../../src/context/AuthContext';
import { generateMonthlyReport } from '../../src/services/pdfReport';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function ReportScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateMonthlyReport(user.id, selectedMonth + 1, selectedYear);
      Alert.alert('Sucesso', 'Relatório gerado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ErrorBoundary screenName="MonthlyReport">
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Voltar" accessibilityRole="button" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RELATÓRIO MENSAL</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.title}>Gerar Relatório</Text>
      <Text style={styles.subtitle}>Selecione o mês para gerar o PDF</Text>

      <Text style={styles.label}>MÊS</Text>
      <View style={styles.monthGrid}>
        {MONTHS.map((month, index) => (
          <TouchableOpacity
            key={index}
            accessibilityLabel={month}
            accessibilityRole="button"
            style={[styles.monthCard, selectedMonth === index && styles.monthActive]}
            onPress={() => setSelectedMonth(index)}
          >
            <Text style={[styles.monthText, selectedMonth === index && styles.monthTextActive]}>
              {month.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ANO</Text>
      <View style={styles.yearRow}>
        {[selectedYear - 1, selectedYear, selectedYear + 1].map((year) => (
          <TouchableOpacity
            key={year}
            accessibilityLabel={`Ano ${year}`}
            accessibilityRole="button"
            style={[styles.yearCard, selectedYear === year && styles.yearActive]}
            onPress={() => setSelectedYear(year)}
          >
            <Text style={[styles.yearText, selectedYear === year && styles.yearTextActive]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        accessibilityLabel="Gerar relatório PDF"
        accessibilityRole="button"
        style={[styles.generateBtn, generating && styles.generateBtnDisabled]}
        onPress={handleGenerate}
        disabled={generating}
      >
        <Ionicons name="document-text" size={20} color={COLORS.background} />
        <Text style={styles.generateBtnText}>
          {generating ? 'Gerando...' : 'GERAR RELATÓRIO PDF'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>O relatório inclui: treinos, minutos, água, metas e progresso</Text>
      </View>
    </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm, marginTop: SPACING.lg },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  monthCard: { width: '30%', padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  monthActive: { backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary },
  monthText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  monthTextActive: { color: COLORS.primary },
  yearRow: { flexDirection: 'row', gap: SPACING.sm },
  yearCard: { flex: 1, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  yearActive: { backgroundColor: COLORS.primary + '15', borderWidth: 1, borderColor: COLORS.primary },
  yearText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted },
  yearTextActive: { color: COLORS.primary },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.primary, marginTop: SPACING.xl },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.xl, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },
});
