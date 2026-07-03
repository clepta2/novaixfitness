// src/components/analytics/SleepCorrelation.tsx// Correlacao sono x treino - NOVAIX FITNESS
import React, {
useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SectionCard } from '../ui/SectionCard'
import SpaceBetween  from '../ui/SpaceBetween';
import { MOCK_SLEEP_DATA, SleepEntry } from '../../data/analyticsMock'
import { useColors } from '../../context/ThemeContext';
const {
width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - SPACING.lg * 2 - SPACING.lg * 2;
interface Insight {
 icon: string; text: string;
 color: string;
}
export default function SleepCorrelation({
data }: {
data?: SleepEntry[] }) {
const colors = useColors();
const styles = makeStyles(colors);
const sleepData = data || MOCK_SLEEP_DATA; const [fadeAnim] = useState(() => 
new Animated.Value(0));
 
const [selectedPoint, setSelectedPoint] = useState<number | 
null>(
null);
 useEffect(() => {
   Animated.timing(fadeAnim, {
toValue: 1, duration: 500, useNativeDriver: true }).start();
 
}, [fadeAnim]);
 
const stats = useMemo(() => {const avgSleep = sleepData.reduce((s, e) => s + e.sleepHours, 0) / sleepData.length;
   
const avgPerformance = sleepData.reduce((s, e) => s + e.workoutPerformance, 0) / sleepData.length;
   
const goodSleep = sleepData.filter(e => e.sleepHours >= 7);
   
const badSleep = sleepData.filter(e => e.sleepHours < 6);
   
const goodPerf = goodSleep.length > 0 ? goodSleep.reduce((s, e) => s + e.workoutPerformance, 0) / goodSleep.length : 0;
   
const badPerf = badSleep.length > 0 ? badSleep.reduce((s, e) => s + e.workoutPerformance, 0) / badSleep.length : 0;
   
const correlation = badPerf > 0 ? Math.round(((goodPerf - badPerf) / badPerf) * 100) : 0;
   
return {
avgSleep, avgPerformance, correlation };
 
}, [sleepData]);
 
const insights: Insight[] = useMemo(() => [    {
icon: 'moon', text: `Dias com 7+ horas: ${Math.round(stats.avgSleep * 10)
}% melhor performance`, color: colors.info },    {
icon: 'flash', text: `Sono ideal (7-9h): maximize seus treinos`, color: colors.primary },    {
icon: 'trending-up', text: `Cada hora extra = +${Math.round(stats.correlation / 3)
}% performance`, color: colors.success },  ], [stats]);
 
const maxPerformance = 100;
 
const maxSleep = 10;
 
const barWidth = (CHART_WIDTH - SPACING.sm * (sleepData.length - 1)) / sleepData.length;
 
return (    <Animated.View style={{ opacity: fadeAnim }}>
      <SectionCard marginBottom={SPACING.md
}>        <SpaceBetween style={styles.header
}>          <View style={styles.headerLeft
}>            <Ionicons name="moon" size={18
} color={colors.info
} />            <Text style={styles.title
}>CORRELACAO SONO X TREINO</Text>          </View>          <View style={styles.correlationBadge
}>            <Text style={styles.correlationText
}>+{stats.correlation
}%</Text>          </View>        </SpaceBetween>        {/* Bar chart */
}        <View style={styles.chartContainer
}>          <View style={styles.chartHeader
}>            <Text style={styles.chartLabel
}>Horas de sono</Text>            <Text style={styles.chartLabel
}>Performance (%)</Text>          </View>          <View style={styles.chart
}>            {sleepData.map((entry, index) => { const barHeight = (entry.workoutPerformance / maxPerformance) * 120;
             
const sleepColor = entry.sleepHours >= 7 ? colors.info : entry.sleepHours >= 6 ? colors.attention : colors.error;
             
const isSelected = selectedPoint === index;
             
return (                <TouchableOpacity                  key={index
}                  style={styles.barWrapper
}                  onPress={() => setSelectedPoint(isSelected ? null : index)
}                  activeOpacity={0.7
}                >                  <Text style={styles.barValue
}>{entry.workoutPerformance
}</Text>                  <View style={styles.barColumn
}>                    <View style={[ styles.bar,                      {
height: barHeight, backgroundColor: isSelected ? colors.primary : sleepColor },                    ]
} />                    <View style={[styles.barHeightIndicator, {
height: (entry.sleepHours / maxSleep) * 120, backgroundColor: sleepColor + '30' }]
} />                  </View>                  <Text style={[styles.barLabel, isSelected && styles.barLabelActive]
}>{entry.date
}</Text>                  {isSelected && ( <View style={styles.tooltip
}>                      <Text style={styles.tooltipText
}>{entry.sleepHours
}h sono</Text>                      <Text style={styles.tooltipText
}>{entry.workoutPerformance
}% perf.</Text>                      <Text style={styles.tooltipText
}>{entry.workoutDuration
}min treino</Text>                    </View>                  )
}                </TouchableOpacity>              );
})
}          </View>          <View style={styles.chartLegend
}>            <View style={styles.legendItem
}>              <View style={[styles.legendDot, {
backgroundColor: colors.info }]
} />              <Text style={styles.legendText
}>7+ horas</Text>            </View>            <View style={styles.legendItem
}>              <View style={[styles.legendDot, {
backgroundColor: colors.attention }]
} />              <Text style={styles.legendText
}>6-7 horas</Text>            </View>            <View style={styles.legendItem
}>              <View style={[styles.legendDot, {
backgroundColor: colors.error }]
} />              <Text style={styles.legendText
}>&lt;6 horas</Text>            </View>          </View>        </View>        {/* Stats row */
}        <View style={styles.statsRow
}>          <View style={styles.statItem
}>            <Ionicons name="moon" size={16
} color={colors.info
} />            <Text style={styles.statValue
}>{stats.avgSleep.toFixed(1)
}h</Text>            <Text style={styles.statLabel
}>Media sono</Text>          </View>          <View style={styles.statDivider
} />          <View style={styles.statItem
}>            <Ionicons name="flash" size={16
} color={colors.primary
} />            <Text style={styles.statValue
}>{Math.round(stats.avgPerformance)
}%</Text>            <Text style={styles.statLabel
}>Media perf.</Text>          </View>          <View style={styles.statDivider
} />          <View style={styles.statItem
}>            <Ionicons name="trending-up" size={16
} color={colors.success
} />            <Text style={styles.statValue
}>{stats.correlation
}%</Text>            <Text style={styles.statLabel
}>Ganho sono</Text>          </View>        </View>        {/* Insights */
}        <View style={styles.insightsContainer
}>          {insights.map((insight, index) => ( <View key={index
} style={styles.insightRow
}>              <View style={[styles.insightIcon, {
backgroundColor: insight.color + '20' }]
}>                <Ionicons name={insight.icon as any
} size={12
} color={insight.color
} />              </View>              <Text style={styles.insightText
}>{insight.text
}</Text>            </View>          ))
}        </View>      </SectionCard>    </Animated.View>  );
}
const makeStyles = (colors: any) => StyleSheet.create({
 header: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },  headerLeft: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },  title: {
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.textTitle, letterSpacing: 1 },  correlationBadge: {
backgroundColor: colors.success + '20', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.sm },  correlationText: {
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: colors.success },  chartContainer: {
marginBottom: SPACING.lg },  chartHeader: {
flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },  chartLabel: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted },  chart: {
flexDirection: 'row', alignItems: 'flex-end', height: 160, backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm },  barWrapper: {
alignItems: 'center', flex: 1, position: 'relative' },  barColumn: {
flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: 2 },  bar: {
width: 12, borderRadius: 4, minHeight: 4 },  barHeightIndicator: {
width: 6, borderRadius: 3, minHeight: 4 },  barValue: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 8, color: colors.textMuted, marginBottom: 2 },  barLabel: {
fontFamily: 'Inter_400Regular', fontSize: 8, color: colors.textMuted, marginTop: 4 },  barLabelActive: {
color: colors.primary },  tooltip: {
position: 'absolute', top: -60, backgroundColor: colors.surfaceElevated, borderRadius: BORDER_RADIUS.sm, padding: SPACING.xs, borderWidth: 1, borderColor: colors.border, minWidth: 80 },  tooltipText: {
fontFamily: 'Inter_400Regular', fontSize: 9, color: colors.textTitle },  chartLegend: {
flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg, marginTop: SPACING.sm },  legendItem: {
flexDirection: 'row', alignItems: 'center', gap: 4 },  legendDot: {
width: 8, height: 8, borderRadius: 4 },  legendText: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted },  statsRow: {
flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },  statItem: {
flex: 1, alignItems: 'center', gap: 2 },  statValue: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: colors.textTitle },  statLabel: {
fontFamily: 'Inter_400Regular', fontSize: 10, color: colors.textMuted },  statDivider: {
width: 1, height: 28, backgroundColor: colors.border },  insightsContainer: {
gap: SPACING.xs },  insightRow: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, backgroundColor: colors.background, borderRadius: BORDER_RADIUS.sm },  insightIcon: {
width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },  insightText: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.textDescription, flex: 1 },
});