// app/(tabs)/perfil/links.js
// Tela de Links Externos - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { Header, ReferralCard, ErrorBoundary } from '../../../src/components';
import { typography } from '../../../src/styles';
import { socialLinks, otherLinks } from '../../../src/data/links';

export default function LinksScreen() {
  const [showReferral, setShowReferral] = useState(false);

  const openLink = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      }
    } catch (err) {
      if (__DEV__) console.error('Erro ao abrir link:', err);
    }
  };

  return (
    <ErrorBoundary screenName="Links">
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Header showBack title="LINKS" />

        <Text style={styles.subtitle}>Siga-nos nas redes sociais</Text>

        {/* Social Links */}
        <View style={styles.section}>
          {socialLinks.map((link) => (
            <TouchableOpacity
              key={link.label}
              accessibilityLabel={link.label}
              accessibilityRole="button"
              style={styles.socialCard}
              onPress={() => openLink(link.url)}
              activeOpacity={0.8}
            >
              <View style={[styles.socialIcon, { backgroundColor: link.color + '20' }]}>
                <Ionicons name={link.icon as any} size={28} color={link.color} />
              </View>
              <Text style={styles.socialLabel}>{link.label}</Text>
              <Ionicons name="open-outline" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUTROS LINKS</Text>
          {otherLinks.map((link) => (
            <TouchableOpacity
              key={link.label}
              accessibilityLabel={link.label}
              accessibilityRole="button"
              style={styles.linkItem}
              onPress={() => openLink(link.url)}
              activeOpacity={0.8}
            >
              <Ionicons name={link.icon as any} size={22} color={COLORS.textMuted} />
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Share */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMPARTILHE</Text>
          <TouchableOpacity accessibilityLabel="Indique um amigo" accessibilityRole="button" style={styles.shareCard} activeOpacity={0.8} onPress={() => setShowReferral(true)}>
            <Ionicons name="share-social-outline" size={24} color={COLORS.primary} />
            <View style={styles.shareInfo}>
              <Text style={styles.shareLabel}>Indique um amigo</Text>
              <Text style={styles.shareDesc}>Compartilhe o NOVAIX Fitness</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={showReferral}
          animationType="fade"
          transparent
          onRequestClose={() => setShowReferral(false)}
        >
          <Pressable accessibilityLabel="Fechar modal" accessibilityRole="button" style={styles.modalOverlay} onPress={() => setShowReferral(false)}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>INDICAÇÃO</Text>
                <TouchableOpacity accessibilityLabel="Fechar" accessibilityRole="button" onPress={() => setShowReferral(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textTitle} />
                </TouchableOpacity>
              </View>
              <ReferralCard />
            </View>
          </Pressable>
        </Modal>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xxl },
  sectionTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.lg },
  socialCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  socialIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.lg },
  socialLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: COLORS.textTitle },
  linkItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  linkLabel: { flex: 1, fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle, marginLeft: SPACING.md },
  shareCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary + '30' },
  shareInfo: { flex: 1, marginLeft: SPACING.md },
  shareLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  shareDesc: typography.cardDate,
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'center', padding: SPACING.xl },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  modalTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary, letterSpacing: 1 },
});
