import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';
import { EXERCISE_VIDEOS } from '../../data/exerciseVideos';

const { width } = Dimensions.get('window');
const VIDEO_WIDTH = width - 40;
const VIDEO_HEIGHT = 200;

function ExerciseVideo({ exerciseName, videoId, thumbnailUrl, compact = false, onPress }: any) {
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const resolvedVideoId = videoId || EXERCISE_VIDEOS[exerciseName?.toLowerCase()] || null;
  const hasVideo = !!resolvedVideoId;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={() => onPress?.() || setShowVideo(!showVideo)} activeOpacity={0.8}>
        {showVideo && hasVideo ? (
          <View style={styles.videoWrapper}>
            {loading && <View style={styles.loadingOverlay}><ActivityIndicator color={COLORS.primary} size="small" /></View>}
            <YoutubeIframe height={160} width={VIDEO_WIDTH - SPACING.lg * 2} videoId={resolvedVideoId} play={true} onChangeState={(state) => setLoading(state === 'loading')} controls={1} modestbranding rel={false} />
          </View>
        ) : (
          <View style={styles.compactPlaceholder}>
            <Ionicons name="play-circle" size={32} color={COLORS.primary} />
            <Text style={styles.compactLabel}>Ver execução</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {showVideo && hasVideo ? (
        <View style={styles.videoWrapper}>
          {loading && <View style={styles.loadingOverlay}><ActivityIndicator color={COLORS.primary} size="large" /></View>}
          <YoutubeIframe height={VIDEO_HEIGHT} width={VIDEO_WIDTH} videoId={resolvedVideoId} play={true} onChangeState={(state) => setLoading(state === 'loading')} controls={1} modestbranding rel={false} />
        </View>
      ) : thumbnailUrl ? (
        <TouchableOpacity style={styles.thumbnailContainer} onPress={() => setShowVideo(true)} activeOpacity={0.9}>
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} contentFit="cover" transition={300} />
          <View style={styles.thumbnailOverlay}>
            <View style={styles.playButton}><Ionicons name="play" size={24} color={COLORS.background} /></View>
          </View>
        </TouchableOpacity>
      ) : hasVideo ? (
        <TouchableOpacity style={styles.placeholder} onPress={() => setShowVideo(true)} activeOpacity={0.8}>
          <View style={styles.playCircle}><Ionicons name="play" size={32} color={COLORS.background} /></View>
          <Text style={styles.label}>Assistir demonstração</Text>
          <Text style={styles.sublabel}>{exerciseName}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.noVideo}>
          <Ionicons name="videocam-off-outline" size={32} color={COLORS.textMuted} />
          <Text style={styles.noVideoText}>Vídeo indisponível</Text>
        </View>
      )}
    </View>
  );
}

export default memo(ExerciseVideo);

const styles = StyleSheet.create({
  container: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md, backgroundColor: COLORS.surface, ...SHADOWS.sm },
  videoWrapper: { position: 'relative' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface, zIndex: 10 },
  thumbnailContainer: { position: 'relative' },
  thumbnail: { width: '100%', height: VIDEO_HEIGHT },
  thumbnailOverlay: { ...StyleSheet.absoluteFill, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  playButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.md },
  placeholder: { height: VIDEO_HEIGHT, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceOverlay },
  playCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: COLORS.textTitle },
  sublabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  noVideo: { height: 120, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceOverlay },
  noVideoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.xs },
  compactContainer: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginBottom: SPACING.sm },
  compactPlaceholder: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md },
  compactLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
});
