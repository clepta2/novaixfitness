// app/landing.tsx
// Landing Page com animacoes de entrada - NOVAIX FITNESS


import { useState, useEffect, useMemo , useRef} from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/config/supabase';
import { COLORS } from '../src/constants/colors';
import { ErrorBoundary, HeroSection, StatsRow, FeaturesSection, PlansPreview, TestimonialsSection, FaqSection, CtaSection, Loading } from '../src/components';

export default function LandingScreen() {
  const router = useRouter();
  const [dbStats, setDbStats] = useState({ users: 0, workouts: 0, rating: 4.9, loading: true });

  // Animacoes
  const fadeAnim = useRef(Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    async function loadRealStats() {
      try {
        const [{ count: usersCount }, { count: workoutsCount }, { data: ratingData }] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('workouts').select('*', { count: 'exact', head: true }),
          supabase.from('user_workouts').select('rating').limit(500),
        ]);

        let avgRating = 4.9;
        if (ratingData && ratingData.length > 0) {
          const rated = ratingData.filter((r: any) => r.rating != null);
          if (rated.length > 0) {
            avgRating = parseFloat((rated.reduce((acc: number, curr: any) => acc + curr.rating, 0) / rated.length).toFixed(1));
          }
        }

        setDbStats({ users: usersCount || 0, workouts: workoutsCount || 0, rating: avgRating, loading: false });
      } catch (err) {
        if (__DEV__) console.error('Erro ao buscar estatisticas:', err);
        setDbStats(prev => ({ ...prev, loading: false }));
      }
    }
    loadRealStats();
  }, []);

  const stats = [
    { value: dbStats.loading ? '...' : `+${dbStats.users}`, label: 'Alunos Ativos' },
    { value: dbStats.loading ? '...' : `+${dbStats.workouts}`, label: 'Video Treinos' },
    { value: dbStats.loading ? '...' : `${dbStats.rating}★`, label: 'Avaliacao' },
  ];

  const goToRegister = () => router.push('/register');

  return (
    <ErrorBoundary screenName="Landing">
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <HeroSection onPressCTA={goToRegister} />
            <StatsRow stats={stats} />
            <FeaturesSection />
            <PlansPreview />
            <TestimonialsSection />
            <FaqSection />
            <CtaSection onPressCTA={goToRegister} />
          </Animated.View>
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
});
