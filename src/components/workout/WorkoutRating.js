import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const RATING_LABELS = ['', 'Ruim', 'Ok', 'Bom', 'Muito Bom', 'Perfeito!'];

export default function WorkoutRating({ rating, onRate }) {
  const [selected, setSelected] = useState(rating || 0);

  const handleRate = (star) => {
    setSelected(star);
    onRate?.(star);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="star" size={16} color={COLORS.attention} />
        <Text style={styles.title}>AVALIAÇÃO</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => handleRate(star)} style={styles.starBtn}>
              <Ionicons name={star <= selected ? 'star' : 'star-outline'} size={40} color={star <= selected ? COLORS.attention : COLORS.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        {selected > 0 && <Text style={styles.label}>{RATING_LABELS[selected]}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.xl, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: 'row', gap: SPACING.md },
  starBtn: { padding: SPACING.xs },
  label: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary, marginTop: SPACING.md },
});
