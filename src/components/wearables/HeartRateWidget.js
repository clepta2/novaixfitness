import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const ZONES = [
  { label: 'Repouso', max: 100, color: COLORS.textMuted },
  { label: 'Queima', max: 140, color: COLORS.info },
  { label: 'Cardio', max: 170, color: COLORS.attention },
  { label: 'Pico', max: 999, color: COLORS.error },
];

function getZone(bpm) {
  return ZONES.find(z => bpm < z.max) || ZONES[3];
}

export default function HeartRateWidget({ bpm, restingHR, maxHR }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bpmVal = bpm || 0;
  const zone = getZone(bpmVal);

  useEffect(() => {
    if (bpmVal <= 0) return;
    const dur = Math.max(400, 1200 - bpmVal * 4);
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.3, duration: dur / 2, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: dur / 2, useNativeDriver: true }),
    ]));
    anim.start();
    return () => anim.stop();
  }, [bpmVal]);

  return (
    <View style={st.card} accessibilityLabel={`Frequência cardíaca: ${bpmVal} bpm`}>
      <View style={st.header}>
        <Ionicons name="heart" size={18} color={COLORS.error} />
        <Text style={st.title}>FREQUÊNCIA CARDÍACA</Text>
      </View>
      <View style={st.bpmRow}>
        <Animated.View style={[st.dot, { transform: [{ scale: pulseAnim }], backgroundColor: zone.color }]} />
        <Text style={st.bpmValue}>{bpmVal > 0 ? bpmVal : '--'}</Text>
        <Text style={st.bpmUnit}>BPM</Text>
      </View>
      {bpmVal > 0 && <View style={[st.zone, { backgroundColor: zone.color + '20' }]}><Text style={[st.zoneText, { color: zone.color }]}>{zone.label}</Text></View>}
      <View style={st.stats}>
        <View style={st.stat}><Text style={st.statLabel}>Repouso</Text><Text style={st.statVal}>{restingHR || '--'}</Text></View>
        <View style={st.stat}><Text style={st.statLabel}>Máxima</Text><Text style={st.statVal}>{maxHR || '--'}</Text></View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginBottom: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, gap: SPACING.xs },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textDescription, letterSpacing: 1 },
  bpmRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  bpmValue: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, color: COLORS.textTitle },
  bpmUnit: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textMuted, alignSelf: 'flex-end', marginBottom: 8 },
  zone: { alignSelf: 'flex-start', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, marginBottom: SPACING.md },
  zoneText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: SPACING.md },
  stat: { alignItems: 'center' },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  statVal: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginTop: 2 },
});
