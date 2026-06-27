// src/components/home/WorkoutCard.js
// Card do treino do dia - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

export default function DailyWorkoutCard({ workout, onStart, isOfflineCached = false }) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>TREINO DO DIA: {workout.name}{'\n'}({workout.type})</Text>
        {isOfflineCached && (
          <View style={styles.offlineBadge}>
            <Ionicons name="download" size={10} color={COLORS.primary} />
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>
      <View style={styles.video}>
        <YoutubeIframe height={200} width={300} videoId={workout.videoId} play={false} onChangeState={() => {}} controls={0} modestbranding rel={false} />
      </View>
      <Text style={styles.timer}>{workout.timer}</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onStart}>
          <Text style={styles.btnText}>INICIAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]}>
          <Text style={[styles.btnText, styles.btnTextSecondary]}>INTERVALO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnOutline]}>
          <Text style={[styles.btnText, styles.btnTextOutline]}>CONCLUIR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, textTransform: 'uppercase', lineHeight: 22, flex: 1 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.primary + '20', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  offlineText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: COLORS.primary },
  video: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginBottom: SPACING.xl, backgroundColor: '#000' },
  timer: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 48, color: COLORS.primary, textAlign: 'center', marginBottom: SPACING.xl, letterSpacing: 2 },
  controls: { flexDirection: 'row', gap: SPACING.sm },
  btn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnSecondary: { backgroundColor: COLORS.hover },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.border },
  btnText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background, letterSpacing: 1 },
  btnTextSecondary: { color: COLORS.textTitle },
  btnTextOutline: { color: COLORS.textDescription },
});
