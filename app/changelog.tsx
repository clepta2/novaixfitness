
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { BRAND_NAME } from '../src/constants/brand';
import { layout } from '../src/styles';
import { ChangelogItem, ErrorBoundary } from '../src/components';
import { CHANGELOG } from '../src/data/changelog';

export default function ChangelogScreen() {
  return (
    <ErrorBoundary screenName="Changelog">
      <ScrollView style={layout.screen} contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Ionicons name="sparkles" size={32} color={COLORS.primary} />
          <Text style={styles.title}>O QUE HÁ DE NOVO?</Text>
          <Text style={styles.subtitle}>
            Acompanhe as novidades, melhorias e correções do {BRAND_NAME}
          </Text>
        </View>

        <View style={styles.list}>
          {CHANGELOG.map((item) => (
            <ChangelogItem
              key={item.version}
              version={item.version}
              date={item.date}
              changes={item.changes}
            />
          ))}
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = {
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
    gap: SPACING.sm,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    color: COLORS.textTitle,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: SPACING.lg,
  },
  list: {
    gap: 0,
  },
};
