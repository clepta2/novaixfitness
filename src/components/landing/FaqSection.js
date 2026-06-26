import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const faqs = [
  { q: 'Preciso pagar para começar?', a: 'Não! Você pode se cadastrar e experimentar o aplicativo completo gratuitamente por 7 dias.' },
  { q: 'Consigo usar na academia e em casa?', a: 'Sim! Nosso catálogo inteligente filtra treinos para academia (musculação/máquinas) e treinos para casa (calistenia/cardio).' },
  { q: 'Como funciona o cancelamento?', a: 'Sem fidelidade. Você pode cancelar sua assinatura com apenas um clique diretamente no painel do aplicativo.' },
];

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTag}>DÚVIDAS FREQUENTES</Text>
      <Text style={styles.sectionTitle}>FAQ</Text>
      <View style={styles.faqList}>
        {faqs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqItem} onPress={() => setActiveFaq(activeFaq === index ? null : index)} activeOpacity={0.8}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Ionicons name={activeFaq === index ? "chevron-up-outline" : "chevron-down-outline"} size={20} color={COLORS.textTitle} />
            </View>
            {activeFaq === index && (
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { padding: SPACING.xl, paddingVertical: 64 },
  sectionTag: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.primary, textAlign: 'center', letterSpacing: 3, marginBottom: 8, textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 26, color: COLORS.textTitle, textAlign: 'center', letterSpacing: 0.5, marginBottom: 44 },
  faqList: { gap: SPACING.md },
  faqItem: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.03)' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontFamily: 'Montserrat_700Bold', fontSize: 15, color: COLORS.textTitle, flex: 1, paddingRight: SPACING.md },
  faqAnswer: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textDescription, lineHeight: 20, marginTop: SPACING.md, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', paddingTop: SPACING.md },
});
