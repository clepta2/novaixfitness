// src/components/admin/AnalyticsDashboard.js
// Dashboard de analytics - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';
import { typography } from '../../styles';
import { StatCard } from '../ui';
import { styles } from './analyticsDashboardStyles';
import {
  useWorkoutAnalytics,
  useNutritionAnalytics,
  useEngagementMetrics,
  useUserSegmentation,
} from '../../hooks/useAnalytics';

const PERIODS = [
  { key: 'week', label: '7 dias' },
  { key: 'month', label: '30 dias' },
  { key: 'quarter', label: '90 dias' },
];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState('month');
  const { data: workoutData, loading: workoutLoading } = useWorkoutAnalytics(period);
  const { data: nutritionData, loading: nutritionLoading } = useNutritionAnalytics(period);
  const { data: engagementData, loading: engagementLoading } = useEngagementMetrics();
  const { data: segmentationData, loading: segmentationLoading } = useUserSegmentation();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={typography.h2}>Analytics</Text>

      <View style={styles.periodSelector}>
        {PERIODS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}
            onPress={() => setPeriod(p.key)}
          >
            <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>Treinos</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="barbell"
            label="Total"
            value={workoutData?.totalWorkouts || 0}
            loading={workoutLoading}
          />
          <StatCard
            icon="time"
            label="Minutos"
            value={workoutData?.totalMinutes || 0}
            loading={workoutLoading}
          />
          <StatCard
            icon="trending-up"
            label="Media"
            value={`${workoutData?.avgDuration || 0}min`}
            loading={workoutLoading}
          />
          <StatCard
            icon="flame"
            label="Sequencia"
            value={workoutData?.streak || 0}
            loading={workoutLoading}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>Nutricao</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="restaurant"
            label="Refeicoes"
            value={nutritionData?.totalMeals || 0}
            loading={nutritionLoading}
          />
          <StatCard
            icon="flame"
            label="Calorias"
            value={nutritionData?.totalCalories || 0}
            loading={nutritionLoading}
          />
          <StatCard
            icon="water"
            label="Agua"
            value={`${Math.round((nutritionData?.totalWater || 0) / 1000)}L`}
            loading={nutritionLoading}
          />
          <StatCard
            icon="fitness"
            label="Proteina"
            value={`${nutritionData?.totalProtein || 0}g`}
            loading={nutritionLoading}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>Engajamento</Text>
        <View style={styles.statsGrid}>
          <StatCard
            icon="eye"
            label="Telas"
            value={engagementData?.screenViews || 0}
            loading={engagementLoading}
          />
          <StatCard
            icon="apps"
            label="Features"
            value={engagementData?.featuresUsed || 0}
            loading={engagementLoading}
          />
          <StatCard
            icon="calendar"
            label="Dias"
            value={engagementData?.daysActive || 0}
            loading={engagementLoading}
          />
          <StatCard
            icon="trending-up"
            label="Engajamento"
            value={`${Math.round(engagementData?.engagementRate || 0)}%`}
            loading={engagementLoading}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>Segmentacao</Text>
        <View style={styles.segmentGrid}>
          <SegmentCard
            label="Free"
            value={segmentationData?.stats?.free || 0}
            color={COLORS.textMuted}
            loading={segmentationLoading}
          />
          <SegmentCard
            label="Basico"
            value={segmentationData?.stats?.basic || 0}
            color={COLORS.info}
            loading={segmentationLoading}
          />
          <SegmentCard
            label="Premium"
            value={segmentationData?.stats?.premium || 0}
            color={COLORS.primary}
            loading={segmentationLoading}
          />
          <SegmentCard
            label="Power Users"
            value={segmentationData?.stats?.powerUsers || 0}
            color={COLORS.success}
            loading={segmentationLoading}
          />
          <SegmentCard
            label="Novos"
            value={segmentationData?.stats?.newUsers || 0}
            color={COLORS.attention}
            loading={segmentationLoading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function SegmentCard({ label, value, color, loading }) {
  return (
    <View style={[styles.segmentCard, { borderLeftColor: color }]}>
      <Text style={styles.segmentLabel}>{label}</Text>
      <Text style={[styles.segmentValue, { color }]}>
        {loading ? '...' : value}
      </Text>
    </View>
  );
}


