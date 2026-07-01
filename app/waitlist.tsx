import { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import { SPACING } from '../src/constants/spacing';
import { Button, ErrorBoundary, WaitlistFeature } from '../src/components';
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';
import { WAITLIST_FEATURES } from '../src/data/waitlistFeatures';

export default function WaitlistScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleJoin = useCallback(async (featureId) => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para entrar na lista de espera.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ user_id: user.id, feature_id: featureId });
      if (error) throw error;
      setJoined((prev) => [...prev, featureId]);
      Alert.alert('Inscrito!', 'Você será notificado quando esta funcionalidade estiver disponível.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível inscrever. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <ErrorBoundary screenName="Waitlist">
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.accentLine} />
            <Text style={styles.title}>EM BREVE!</Text>
            <Text style={styles.subtitle}>
              Funcionalidades que estão sendo desenvolvidas para você.
              {'\n'}Inscreva-se e seja o primeiro a saber.
            </Text>
          </View>

          {WAITLIST_FEATURES.map((feature) => (
            <WaitlistFeature
              key={feature.id}
              feature={feature}
              isJoined={joined.includes(feature.id)}
              onJoin={handleJoin}
              loading={loading}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="VOLTAR"
            variant="ghost"
            onPress={() => router.back()}
            icon="arrow-back"
          />
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingBottom: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: COLORS.textTitle,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textDescription,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
});
