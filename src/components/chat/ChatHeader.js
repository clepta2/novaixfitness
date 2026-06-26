import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { typography } from '../../styles';

export default function ChatHeader({ onBack, onClear }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <View style={styles.coachAvatar}>
          <Ionicons name="fitness" size={18} color={COLORS.background} />
        </View>
        <View>
          <Text style={typography.h5}>Coach Nix IA</Text>
          <Text style={[typography.caption, { color: COLORS.primary }]}>Treino & Nutricao</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: SPACING.sm },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  coachAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  clearBtn: { padding: SPACING.sm },
});
