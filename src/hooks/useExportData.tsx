// src/hooks/useExportData.ts
// Hook de lógica de exportação de dados

import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  exportWorkoutHistory,
  exportProgressData,
  exportAnalyticsData,
  exportAchievements,
  exportProfileData,
  exportChatHistory,
  exportAllData,
} from '../services/csv-export';

export interface ExportOption {
  id: string;
  icon: string;
  title: string;
  desc: string;
  filename: string;
}

export const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: 'all',
    icon: 'folder-open',
    title: 'Todos os Meus Dados (LGPD)',
    desc: 'Exportação completa em JSON com todos os dados pessoais',
    filename: 'novaix_todos_dados.json',
  },
  {
    id: 'profile',
    icon: 'person',
    title: 'Dados do Perfil',
    desc: 'Informações pessoais, configurações e estatísticas',
    filename: 'novaix_perfil.csv',
  },
  {
    id: 'workouts',
    icon: 'barbell',
    title: 'Histórico de Treinos',
    desc: 'Todos os treinos concluídos com data, duração e avaliação',
    filename: 'novaix_historico_treinos.csv',
  },
  {
    id: 'progress',
    icon: 'trending-up',
    title: 'Dados de Progresso',
    desc: 'Perfil, peso ao longo do tempo e estatísticas gerais',
    filename: 'novaix_progresso.csv',
  },
  {
    id: 'analytics',
    icon: 'stats-chart',
    title: 'Analytics Detalhado',
    desc: 'Treinos por categoria, duração e frequência',
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
    title: 'Histórico do Chat',
    desc: 'Todas as conversas com o Coach IA',
    filename: 'novaix_chat_historico.csv',
  },
];

export function useExportData() {
  const { user } = useAuth();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (option: ExportOption) => {
    setExporting(option.id);
    try {
      switch (option.id) {
        case 'all': await exportAllData(user.id); break;
        case 'profile': await exportProfileData(user.id); break;
        case 'workouts': await exportWorkoutHistory(user.id); break;
        case 'progress': await exportProgressData(user.id); break;
        case 'analytics': await exportAnalyticsData(user.id, 'year'); break;
        case 'achievements': await exportAchievements(user.id); break;
        case 'chat': await exportChatHistory(user.id); break;
      }
      Alert.alert('Sucesso', `${option.title} exportado com sucesso!`);
    } catch (err) {
      if (__DEV__) console.error('Erro ao exportar:', err);
      Alert.alert('Erro', 'Não foi possível exportar os dados.');
    } finally {
      setExporting(null);
    }
  };

  return { exporting, handleExport };
}
