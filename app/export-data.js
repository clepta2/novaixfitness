// app/export-data.js
// Tela de Exportacao de Dados - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { useAuth } from '../src/context/AuthContext';
import { exportWorkoutHistory, exportProgressData, exportAnalyticsData, exportAchievements, exportProfileData, exportChatHistory, exportAllData } from '../src/services/csv-export';
import { layout, typography } from '../src/styles';

const EXPORT_OPTIONS = [
  {
    id: 'all',
    icon: 'folder-open',
    title: 'Todos os Meus Dados (LGPD)',
    desc: 'Exportacao completa em JSON com todos os dados pessoais',
    filename: 'novaix_todos_dados.json',
  },
  {
    id: 'profile',
    icon: 'person',
    title: 'Dados do Perfil',
    desc: 'Informacoes pessoais, configuracoes e estatisticas',
    filename: 'novaix_perfil.csv',
  },
  {
    id: 'workouts',
    icon: 'barbell',
    title: 'Historico de Treinos',
    desc: 'Todos os treinos concluidos com data, duracao e avaliacao',
    filename: 'novaix_historico_treinos.csv',
  },
  {
    id: 'progress',
    icon: 'trending-up',
    title: 'Dados de Progresso',
    desc: 'Perfil, peso ao longo do tempo e estatisticas gerais',
    filename: 'novaix_progresso.csv',
  },
  {
    id: 'analytics',
    icon: 'stats-chart',
    title: 'Analytics Detalhado',
    desc: 'Treinos por categoria, duracao e frequencia',
    filename: 'novaix_analytics.csv',
  },
  {
    id: 'achievements',
    icon: 'trophy',
    title: 'Conquistas',
    desc: 'Todas as conquistas desbloqueadas com datas',
    filename: 'novaix_conquistas.csv',
  },
  {
    id: 'chat',
    icon: 'chatbubbles',
    title: 'Historico do Chat',
    desc: 'Todas as conversas com o Coach IA',
    filename: 'novaix_chat_historico.csv',
  },
];

export default function ExportDataScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(null);

  const handleExport = async (option) => {
    setExporting(option.id);
    try {
      switch (option.id) {
        case 'all':
          await exportAllData(user.id);
          break;
        case 'profile':
          await exportProfileData(user.id);
          break;
        case 'workouts':
          await exportWorkoutHistory(user.id);
          break;
        case 'progress':
          await exportProgressData(user.id);
          break;
        case 'analytics':
          await exportAnalyticsData(user.id, 'year');
          break;
        case 'achievements':
          await exportAchievements(user.id);
          break;
        case 'chat':
          await exportChatHistory(user.id);
          break;
      }
      Alert.alert('Sucesso', `${option.title} exportado com sucesso!`);
    } catch (err) {
      if (__DEV__) console.error('Erro ao exportar:', err);
      Alert.alert('Erro', 'Nao foi possivel exportar os dados.');
    } finally {
      setExporting(null);
    }
  };

  return (
    <View style={layout.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={layout.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={typography.h2}>Exportar Dados</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          Exporte seus dados em formato CSV para usar em planilhas ou backups.
        </Text>

        <View style={styles.optionsList}>
          {EXPORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleExport(option)}
              disabled={exporting !== null}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={24} color={COLORS.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={typography.h5}>{option.title}</Text>
                <Text style={typography.caption}>{option.desc}</Text>
                <Text style={styles.filename}>{option.filename}</Text>
              </View>
              {exporting === option.id ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="download-outline" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Os arquivos CSV sao compativeis com Excel, Google Sheets e outros aplicativos de planilha.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: SPACING.xl, paddingTop: layout.scroll.paddingTop },
  subtitle: { ...typography.subtitle, marginBottom: SPACING.xl, lineHeight: 20 },
  optionsList: { gap: SPACING.md },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  optionIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center' },
  optionInfo: { flex: 1 },
  filename: { fontFamily: 'monospace', fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, backgroundColor: COLORS.primary + '10', borderRadius: 8, padding: SPACING.md, marginTop: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary + '30' },
  infoText: { ...typography.cardStatText, flex: 1, lineHeight: 18 },
});
