import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/config/supabase';
import { COLORS } from '../src/constants/colors';
import HeroSection from '../src/components/landing/HeroSection';
import StatsRow from '../src/components/landing/StatsRow';
import FeaturesSection from '../src/components/landing/FeaturesSection';
import PlansPreview from '../src/components/landing/PlansPreview';
import TestimonialsSection from '../src/components/landing/TestimonialsSection';
import FaqSection from '../src/components/landing/FaqSection';
import CtaSection from '../src/components/landing/CtaSection';

export default function LandingScreen() {
  const router = useRouter();
  const [dbStats, setDbStats] = useState({ users: 0, workouts: 0, rating: 4.9, loading: true });

  useEffect(() => {
    async function loadRealStats() {
      try {
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: workoutsCount } = await supabase.from('workouts').select('*', { count: 'exact', head: true });
        const { data: ratingData } = await supabase.from('user_workouts').select('rating');

        let avgRating = 4.9;
        if (ratingData && ratingData.length > 0) {
          const rated = ratingData.filter(r => r.rating != null);
          if (rated.length > 0) {
            avgRating = parseFloat((rated.reduce((acc, curr) => acc + curr.rating, 0) / rated.length).toFixed(1));
          }
        }

        setDbStats({ users: usersCount || 0, workouts: workoutsCount || 0, rating: avgRating, loading: false });
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setDbStats(prev => ({ ...prev, loading: false }));
      }
    }
    loadRealStats();
  }, []);

  const stats = [
    { value: dbStats.loading ? '...' : `+${dbStats.users}`, label: 'Alunos Ativos' },
    { value: dbStats.loading ? '...' : `+${dbStats.workouts}`, label: 'Vídeo Treinos' },
    { value: dbStats.loading ? '...' : `${dbStats.rating}★`, label: 'Avaliação' },
  ];

  const goToRegister = () => router.push('/register');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeroSection onPressCTA={goToRegister} />
        <StatsRow stats={stats} />
        <FeaturesSection />
        <PlansPreview />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection onPressCTA={goToRegister} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
});
