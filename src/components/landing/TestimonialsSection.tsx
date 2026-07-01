import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const testimonials = [
  { name: 'Ana Silva', text: 'Os treinos mudaram minha rotina. O timer integrado não me deixa dispersar durante a musculação!', rating: 5, role: 'Aluna há 3 meses' },
  { name: 'Carlos Mendes', text: 'Excelente sistema de categorias e níveis de experiência. Consigo treinar pesado tanto na academia quanto no parque.', rating: 5, role: 'Aluno há 6 meses' },
];

export default function TestimonialsSection(): React.JSX.Element {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTag}>DEPOIMENTOS</Text>
      <Text style={styles.sectionTitle}>QUEM TREINA COMPROVA</Text>
      {testimonials.map((test, index) => (
        <View key={index} style={styles.testimonialCard}>
          <View style={styles.testimonialHeader}>
            <View>
              <Text style={styles.testimonialName}>{test.name}</Text>
              <Text style={styles.testimonialRole}>{test.role}</Text>
            </View>
            <View style={styles.stars}>
              {[...Array(test.rating)].map((_, i) => (
                <Ionicons key={i} name="star" size={14} color={COLORS.primary} />
              ))}
            </View>
          </View>
          <Text style={styles.testimonialText}>{"\""}{test.text}{"\""}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: SPACING.xl, paddingVertical: 64, backgroundColor: COLORS.surface },
  sectionTag: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary, textAlign: 'center', letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', letterSpacing: 0.5, marginBottom: 44 },
  testimonialCard: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.md, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.03)' },
  testimonialHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  testimonialName: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle },
  testimonialRole: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  stars: { flexDirection: 'row', gap: 2 },
  testimonialText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 22, fontStyle: 'italic' },
});
