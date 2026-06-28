import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMG_WIDTH = (SCREEN_WIDTH - 160) / 2;

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function CompareView({ photos, onCancel }) {
  if (!photos || photos.length < 2) return null;

  return (
    <View style={styles.container}>
      <Text style={typography.label}>COMPARAÇÃO</Text>
      <View style={styles.row}>
        <View style={styles.item}>
          <Image source={{ uri: photos[0].image_url }} style={styles.image} />
          <Text style={styles.date}>{formatDate(photos[0].recorded_at)}</Text>
        </View>
        <Ionicons name="arrow-forward" size={24} color={COLORS.primary} />
        <View style={styles.item}>
          <Image source={{ uri: photos[1].image_url }} style={styles.image} />
          <Text style={styles.date}>{formatDate(photos[1].recorded_at)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.cancel} onPress={onCancel}>
        <Text style={[typography.bodySmall, { color: COLORS.primary }]}>Cancelar comparação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.md },
  item: { alignItems: 'center' },
  image: { width: IMG_WIDTH, height: IMG_WIDTH * 1.33, borderRadius: 8 },
  date: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  cancel: { alignItems: 'center', marginTop: SPACING.md },
});
