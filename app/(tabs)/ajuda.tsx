// app/(tabs)/ajuda.js
// Tela de Ajuda / FAQ - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Linking, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/colors';
import { APP_CONFIG } from '../../src/config/app';
import { FaqItem, ContactCard, WorkoutCoachChat, ErrorBoundary } from '../../src/components';
import { useAuth } from '../../src/context/AuthContext';
import { layout, typography } from '../../src/styles';
import { FAQ_ITEMS } from '../../src/data/faqItems';

export default function AjudaScreen() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  
  const toggleExpand = useCallback((id: string) => setExpandedId((prev) => (prev === id ? null : id)), []);

  return (
    <ErrorBoundary screenName="Ajuda">
      <ScrollView style={layout.screen} contentContainerStyle={layout.scroll}>
        <View style={layout.header}>
          <Text style={typography.h2}>AJUDA</Text>
          <Text style={typography.bodyMuted}>Como podemos ajudar?</Text>
        </View>

        <View style={layout.section}>
          <Text style={typography.label}>ASSISTENTE DE TREINO IA</Text>
          <ContactCard icon="chatbubble-ellipses-outline" iconColor={COLORS.primary} label="Nix Coach de Treino" description="Tire dúvidas sobre exercícios e postura em tempo real" onPress={() => setChatVisible(true)} />
        </View>

        <View style={layout.section}>
          <Text style={typography.label}>PERGUNTAS FREQUENTES</Text>
          {FAQ_ITEMS.map((item) => <FaqItem key={item.id} item={item} isExpanded={expandedId === item.id} onToggle={toggleExpand} />)}
        </View>

        <View style={layout.section}>
          <Text style={typography.label}>FALE CONOSCO</Text>
          <ContactCard icon="logo-whatsapp" iconColor={COLORS.whatsapp} label="WhatsApp" description="Resposta rápida em até 24h" onPress={() => Linking.openURL(`https://wa.me/${APP_CONFIG.whatsappNumber}`)} />
          <ContactCard icon="mail-outline" iconColor={COLORS.primary} label="E-mail" description={APP_CONFIG.supportEmail} onPress={() => Linking.openURL(`mailto:${APP_CONFIG.supportEmail}`)} />
        </View>

        <Modal visible={chatVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>NIX ASSISTENTE</Text>
                <TouchableOpacity onPress={() => setChatVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <WorkoutCoachChat userId={user?.id} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { height: '80%', backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle }
});
