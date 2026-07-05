// src/components/admin/MonitoringDashboard.js
// Dashboard de monitoramento - NOVAIX FITNESS

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { typography } from '../../styles';
import { StatCard } from '../ui';
import { useI18n } from '../../i18n';
import { styles } from './monitoringDashboardStyles';
const errorTracker = require('../../services/errorTracker').errorTracker;
const performanceMonitor = require('../../services/performanceMonitor').performanceMonitor;
import MetricRow from './MetricRow';
import ErrorRow from './ErrorRow';

export default function MonitoringDashboard() {
  const { t } = useI18n();
  const [stats, setStats] = useState({
    errors: 0,
    performance: null,
    recentErrors: [],
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  function loadStats() {
    const recentErrors = errorTracker.getRecentErrors(5);
    const performance = performanceMonitor.getPerformanceSummary();

    setStats({
      errors: recentErrors.length,
      performance,
      recentErrors,
    });
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={typography.h2}>{t('admin.monitoring.title')}</Text>

      <View style={styles.statsGrid}>
        <StatCard
          icon="alert-circle"
          label={t('admin.monitoring.errors')}
          value={stats.errors}
          color={COLORS.error}
        />
        <StatCard
          icon="speedometer"
          label={t('admin.monitoring.renders')}
          value={stats.performance?.renders?.count || 0}
          color={COLORS.primary}
        />
        <StatCard
          icon="time"
          label={t('admin.monitoring.apis')}
          value={stats.performance?.asyncOps?.count || 0}
          color={COLORS.info}
        />
        <StatCard
          icon="flash"
          label={t('admin.monitoring.slow')}
          value={stats.performance?.renders?.slow || 0}
          color={COLORS.attention}
        />
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>{t('admin.monitoring.performance')}</Text>
        {stats.performance && (
          <View style={styles.metricsList}>
            <MetricRow
              label={t('admin.monitoring.avgRender')}
              value={`${(stats.performance.renders.avgDuration || 0).toFixed(1)}ms`}
            />
            <MetricRow
              label={t('admin.monitoring.avgApi')}
              value={`${(stats.performance.asyncOps.avgDuration || 0).toFixed(1)}ms`}
            />
            <MetricRow
              label={t('admin.monitoring.interactions')}
              value={stats.performance.interactions.count}
            />
            <MetricRow
              label={t('admin.monitoring.apiFailures')}
              value={stats.performance.asyncOps.failures}
              isWarning={stats.performance.asyncOps.failures > 0}
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={typography.h3}>{t('admin.monitoring.recentErrors')}</Text>
        {stats.recentErrors.length === 0 ? (
          <Text style={styles.emptyText}>{t('admin.monitoring.noErrors')}</Text>
        ) : (
          stats.recentErrors.map((error) => (
            <ErrorRow key={error.id} error={error} />
          ))
        )}
      </View>
    </ScrollView>
  );
}


