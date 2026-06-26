// src/components/social/NotificationModal.js
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const mockNotifications = [
  { id: '1', icon: 'flame', color: '#FF6B35', text: 'Lucas Silva curtiu seu treino ontem.', time: '2h atrás' },
  { id: '2', icon: 'trophy', color: '#FFD600', text: 'Você desbloqueou a conquista "Streak 5 dias"!', time: '5h atrás' },
  { id: '3', icon: 'water', color: '#00D2FF', text: 'Parabéns! Você bateu sua meta de hidratação diária.', time: '1d atrás' },
  { id: '4', icon: 'chatbubble-ellipses', color: '#CCFF00', text: 'O Coach IA enviou novas dicas de treino para você.', time: '2d atrás' },
];

export default function NotificationModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="notifications" size={20} color={COLORS.primary} />
              <Text style={styles.title}>NOTIFICAÇÕES</Text>
            </View>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {mockNotifications.map((n) => (
              <View key={n.id} style={styles.item}>
                <View style={[styles.iconContainer, { backgroundColor: n.color + '20' }]}>
                  <Ionicons name={n.icon} size={20} color={n.color} />
                </View>
                <View style={styles.content}>
                  <Text style={styles.text}>{n.text}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.75)', justifyContent: 'flex-end' },
  container: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.lg, borderTopRightRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, borderBottomWidth: 0, padding: SPACING.xl, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, letterSpacing: 1 },
  scroll: { gap: SPACING.md, paddingBottom: SPACING.xl },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  content: { flex: 1 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 20 },
  time: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
});
