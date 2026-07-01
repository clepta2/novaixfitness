// src/components/social/ProgressPhotoGrid.js
// Timeline de fotos de progresso corporal

import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ProgressPhotoGrid({ photos = [] }) {
  if (photos.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PROGRESSO</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {photos.map((photo, index) => (
          <View key={photo.id || index} style={styles.item}>
            <Image source={{ uri: photo.url }} style={styles.image} resizeMode="cover" />
            <View style={styles.label}>
              <Text style={styles.date}>{photo.date}</Text>
              {photo.weight && (
                <View style={styles.weightBadge}>
                  <Ionicons name="fitness" size={10} color={COLORS.primary} />
                  <Text style={styles.weight}>{photo.weight}kg</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm, letterSpacing: 1 },
  item: { marginRight: SPACING.sm, width: 100 },
  image: { width: 100, height: 130, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.surfaceElevated },
  label: { marginTop: SPACING.xs },
  date: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  weightBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 },
  weight: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.primary },
});
