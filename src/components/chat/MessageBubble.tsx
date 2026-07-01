import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface MealData {
  description?: string;
  items?: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MessageData {
  isUser: boolean;
  isTyping?: boolean;
  text?: string;
  isMealCard?: boolean;
  mealData?: MealData;
  timestamp?: string;
}

interface MessageBubbleProps {
  message: MessageData;
  showTimestamp?: boolean;
}

function TypingIndicator(): React.JSX.Element {
  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingDot} />
      <View style={styles.typingDot} />
      <View style={styles.typingDot} />
    </View>
  );
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function MealCard({ meal }: { meal: MealData }): React.JSX.Element {
  const itemsText = meal.items?.length > 0 ? meal.items.join(', ') : '';
  return (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Ionicons name="restaurant" size={14} color={COLORS.primary} />
        <Text style={styles.mealTitle}>{meal.description?.toUpperCase() || 'REFEIÇÃO'}</Text>
      </View>
      {itemsText ? <Text style={styles.mealItems}>{itemsText}</Text> : null}
      <View style={styles.caloriesRow}>
        <Text style={styles.caloriesVal}>{meal.calories}</Text>
        <Text style={styles.caloriesLbl}>kcal</Text>
      </View>
      <View style={styles.macrosGrid}>
        <View style={styles.macroCol}>
          <View style={[styles.macroIndicator, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.macroValue}>{meal.protein}g</Text>
          <Text style={styles.macroLabel}>Prot</Text>
        </View>
        <View style={styles.macroCol}>
          <View style={[styles.macroIndicator, { backgroundColor: COLORS.success }]} />
          <Text style={styles.macroValue}>{meal.carbs}g</Text>
          <Text style={styles.macroLabel}>Carb</Text>
        </View>
        <View style={styles.macroCol}>
          <View style={[styles.macroIndicator, { backgroundColor: COLORS.secondary }]} />
          <Text style={styles.macroValue}>{meal.fat}g</Text>
          <Text style={styles.macroLabel}>Gord</Text>
        </View>
      </View>
    </View>
  );
}

export default function MessageBubble({ message, showTimestamp = true }: MessageBubbleProps): React.JSX.Element {
  const isUser = message.isUser;
  const isTyping = message.isTyping;

  if (isTyping) {
    return (
      <View style={[styles.bubble, styles.bubbleCoach]}>
        <View style={styles.coachAvatar}>
          <Ionicons name="fitness" size={12} color={COLORS.primary} />
        </View>
        <TypingIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, isUser ? styles.containerUser : styles.containerCoach]}>
      {!isUser && (
        <View style={styles.coachAvatar}>
          <Ionicons name="fitness" size={12} color={COLORS.primary} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleCoach]}>
        {message.isMealCard && message.mealData ? (
          <MealCard meal={message.mealData} />
        ) : (
          <Text style={[styles.bubbleText, isUser ? styles.textUser : styles.textCoach]}>
            {message.text}
          </Text>
        )}
        {showTimestamp && message.timestamp && (
          <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xs },
  containerUser: { justifyContent: 'flex-end' },
  containerCoach: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 2 },
  bubbleCoach: { backgroundColor: COLORS.surface, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: COLORS.border },
  coachAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  bubbleText: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  textUser: { color: COLORS.background },
  textCoach: { color: COLORS.textTitle },
  timestamp: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted, marginTop: SPACING.xs, alignSelf: 'flex-end' },
  timestampUser: { color: COLORS.background + '80' },
  typingContainer: { flexDirection: 'row', gap: 4, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.textMuted },
  mealCard: { width: 200, paddingVertical: SPACING.xs },
  mealHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  mealTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary },
  mealItems: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginBottom: SPACING.sm },
  caloriesRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: SPACING.md },
  caloriesVal: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle },
  caloriesLbl: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  macrosGrid: { flexDirection: 'row', justifyContent: 'space-between', gap: SPACING.xs },
  macroCol: { alignItems: 'center' },
  macroIndicator: { width: 16, height: 4, borderRadius: 2, marginBottom: 4 },
  macroValue: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle },
  macroLabel: { fontFamily: 'Inter_400Regular', fontSize: 9, color: COLORS.textMuted },
});
