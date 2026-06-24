// app/(tabs)/perfil/index.js
// Tela de Perfil - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';

const stats = [
  { label: 'Treinos', value: '32', icon: 'barbell' },
  { label: 'Streak', value: '15 dias', icon: 'flame' },
  { label: 'Nível', value: 'Intermediário', icon: 'trophy' },
  { label: 'XP', value: '2.450', icon: 'star' },
];

const menuItems = [
  { label: 'Meus Dados', icon: 'person', screen: 'dados' },
  { label: 'Evolução Corporal', icon: 'trending-up', screen: 'evolucao' },
  { label: 'Configurações', icon: 'settings', screen: 'config' },
  { label: 'Privacidade (LGPD)', icon: 'shield-checkmark', screen: 'lgpd' },
  { label: 'Ajuda', icon: 'help-circle', screen: 'ajuda' },
  { label: 'Sair', icon: 'log-out', screen: 'logout' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MEU PERFIL</Text>
        </View>

        {/* Foto e Nome */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>JEFERSON P.</Text>
          <Text style={styles.userSince}>Aluno desde: 24/06/2026</Text>
        </View>

        {/* Estatísticas */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icon} size={24} color={COLORS.primary} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Evolução Corporal */}
        <View style={styles.evolutionCard}>
          <Text style={styles.sectionTitle}>EVOLUÇÃO CORPORAL</Text>
          <View style={styles.evolutionRow}>
            <View style={styles.evolutionItem}>
              <Text style={styles.evolutionLabel}>PESO</Text>
              <Text style={styles.evolutionValue}>78,5 KG</Text>
            </View>
            <View style={styles.evolutionItem}>
              <Text style={styles.evolutionLabel}>ALTURA</Text>
              <Text style={styles.evolutionValue}>178 cm</Text>
            </View>
            <View style={styles.evolutionItem}>
              <Text style={styles.evolutionLabel}>IMC</Text>
              <Text style={styles.evolutionValue}>24,8</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>EDITAR</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen === 'logout') {
                  // Lógica de logout
                } else {
                  router.push(`/(tabs)/perfil/${item.screen}`);
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={20} color={COLORS.textDescription} />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="barbell" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Treinos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="people" size={24} color={COLORS.textMuted} />
          <Text style={styles.tabLabel}>Comunidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
          <Ionicons name="person" size={24} color={COLORS.primary} />
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Perfil</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
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
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.textTitle,
  },
  userSince: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  evolutionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  evolutionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  evolutionItem: {
    alignItems: 'center',
  },
  evolutionLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  evolutionValue: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.background,
    textTransform: 'uppercase',
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabItemActive: {
    // Estilo ativo
  },
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
});
