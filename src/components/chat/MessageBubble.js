import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function MessageBubble({ message }) {
  return (
    <View style={[styles.bubble, message.isUser ? styles.bubbleUser : styles.bubbleCoach]}>
      {!message.isUser && (
        <View style={styles.coachBubbleAvatar}>
          <Ionicons name="fitness" size={12} color={COLORS.primary} />
        </View>
      )}
      <Text style={[styles.bubbleText, message.isUser ? styles.textUser : styles.textCoach]}>
        {message.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '82%', padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  bubbleCoach: { alignSelf: 'flex-start', backgroundColor: COLORS.surface, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', gap: SPACING.sm },
  coachBubbleAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, flex: 1 },
  textUser: { color: COLORS.background },
  textCoach: { color: COLORS.textTitle },
});
