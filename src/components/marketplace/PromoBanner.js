// src/components/marketplace/PromoBanner.js
// Banner de promocoes - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function PromoBanner({ promo, onPress }) {
  if (!promo) return null;

  return (
    <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconWrap}>
        <Ionicons name="pricetag" size={20} color={COLORS.background} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{promo.title}</Text>
        <Text style={styles.subtitle}>{promo.subtitle}</Text>
      </View>
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{promo.discount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary + '15', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginHorizontal: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.secondary + '30', gap: SPACING.sm },
  iconWrap: { width: 36, height: 36, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textTitle },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textDescription, marginTop: 2 },
  discountBadge: { backgroundColor: COLORS.secondary, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },
  discountText: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.background },
});
