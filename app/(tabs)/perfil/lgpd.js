// app/(tabs)/perfil/lgpd.js
// Tela de Privacidade (LGPD) - NOVAIX FITNESS

import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../../src/constants/colors';

export default function LGPDScreen() {
  const router = useRouter();
  const [marketing, setMarketing] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [thirdParty, setThirdParty] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <Text style={styles.title}>PRIVACIDADE (LGPD)</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>Seus Dados, Seu Controle</Text>

        {/* Gerenciar Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GERENCIAR MEUS DADOS</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="download-outline" size={24} color={COLORS.primary} />
              <View>
                <Text style={styles.menuItemLabel}>EXPORTAR DADOS</Text>
                <Text style={styles.menuItemDescription}>Solicitar arquivo completo (json)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="options-outline" size={24} color={COLORS.primary} />
              <View>
                <Text style={styles.menuItemLabel}>AJUSTAR CONSENTIMENTOS</Text>
                <Text style={styles.menuItemDescription}>Preferências de marketing e terceiros</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.menuItemDanger]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={24} color={COLORS.error} />
              <View>
                <Text style={[styles.menuItemLabel, { color: COLORS.error }]}>DELETAR MINHA CONTA</Text>
                <Text style={styles.menuItemDescription}>Ação irreversível e imediata</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Consentimentos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONSENTIMENTOS ATIVOS</Text>
          
          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Comunicação de Marketing (E-mail)</Text>
            </View>
            <Switch
              value={marketing}
              onValueChange={setMarketing}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={marketing ? COLORS.background : COLORS.textMuted}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Análise de Uso (Firebase/Sentry)</Text>
            </View>
            <Switch
              value={analytics}
              onValueChange={setAnalytics}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={analytics ? COLORS.background : COLORS.textMuted}
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Compartilhamento com Terceiros</Text>
            </View>
            <Switch
              value={thirdParty}
              onValueChange={setThirdParty}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={thirdParty ? COLORS.background : COLORS.textMuted}
            />
          </View>
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
        <TouchableOpacity style={styles.tabItem}>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    marginBottom: 24,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemDanger: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuItemLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  menuItemDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
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
