// app/admin.js
// Painel Administrativo - NOVAIX FITNESS (Web)

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';

const mockStudents = [
  { id: '1', name: 'Carlos Silva', email: 'carlos@email.com', status: 'active', plan: 'Premium' },
  { id: '2', name: 'Maria Santos', email: 'maria@email.com', status: 'active', plan: 'Intermediário' },
  { id: '3', name: 'Pedro Lima', email: 'pedro@email.com', status: 'inactive', plan: 'Básico' },
];

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PAINEL ADMIN</Text>
          <Text style={styles.subtitle}>NOVAIX FITNESS</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'students' && styles.tabActive]}
            onPress={() => setActiveTab('students')}
          >
            <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>
              Alunos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'finance' && styles.tabActive]}
            onPress={() => setActiveTab('finance')}
          >
            <Text style={[styles.tabText, activeTab === 'finance' && styles.tabTextActive]}>
              Financeiro
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'content' && styles.tabActive]}
            onPress={() => setActiveTab('content')}
          >
            <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>
              Conteúdo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        {activeTab === 'students' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>CONTROLE DE ALUNOS</Text>
            {mockStudents.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentEmail}>{student.email}</Text>
                </View>
                <View style={styles.studentMeta}>
                  <Text style={[styles.studentStatus, 
                    student.status === 'active' ? styles.statusActive : styles.statusInactive
                  ]}>
                    {student.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Text>
                  <Text style={styles.studentPlan}>{student.plan}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'finance' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>PAINEL FINANCEIRO</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>MRR</Text>
                <Text style={styles.statValue}>R$ 4.500</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Alunos Ativos</Text>
                <Text style={styles.statValue}>45</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Churn</Text>
                <Text style={styles.statValue}>5.2%</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Novos/Mês</Text>
                <Text style={styles.statValue}>12</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'content' && (
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>GERENCIAR CONTEÚDO</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Adicionar Treino</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Adicionar Exercício</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: COLORS.background,
  },
  content: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  studentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  studentEmail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  studentMeta: {
    alignItems: 'flex-end',
  },
  studentStatus: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: COLORS.success + '20',
    color: COLORS.success,
  },
  statusInactive: {
    backgroundColor: COLORS.error + '20',
    color: COLORS.error,
  },
  studentPlan: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
  },
  statValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    color: COLORS.primary,
    marginTop: 8,
  },
  addButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
});
