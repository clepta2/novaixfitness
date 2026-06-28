import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING , ICON_SIZES } from '../../constants/spacing';
import { layout, typography } from '../../styles';


export default function HomeHeader({ userName, levelData, streak, onChatPress, onNotificationsPress }) {
  return (
    <View style={layout.header}>
      <View>
        <Text style={typography.bodyMuted}>BEM-VINDO,</Text>
        <Text style={typography.h2}>{userName.toUpperCase()}!</Text>
      </View>
      <View style={styles.actions}>
        {levelData && (
          <View style={[styles.levelBadge, { backgroundColor: levelData.color + '20' }]}>
            <Ionicons name={levelData.icon} size={14} color={levelData.color} />
            <Text style={[styles.levelText, { color: levelData.color }]}>Nv.{levelData.level}</Text>
          </View>
        )}
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={16} color={COLORS.primary} />
          <Text style={styles.streakText}>{streak || 0}</Text>
        </View>
        <TouchableOpacity onPress={onChatPress} style={layout.headerBtn}>
          <Ionicons name="chatbubbles-outline" size={ICON_SIZES.md} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNotificationsPress} style={layout.headerBtn}>
          <Ionicons name="notifications-outline" size={ICON_SIZES.md} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12 },
  levelText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.surface, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  streakText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
});
