// src/components/workout/VideoPreview.js
// Prévia de vídeo do treino - NOVAIX FITNESS

import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import YoutubeIframe from 'react-native-youtube-iframe';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

const { width } = Dimensions.get('window');

function VideoPreview({ videoId, showVideo, onToggle }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.9}>
      {showVideo ? (
        <YoutubeIframe height={220} width={width - 40} videoId={videoId} play={true} onChangeState={() => {}} controls={1} modestbranding rel={false} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="play-circle" size={64} color={COLORS.primary} />
          <Text style={styles.label}>Assistir prévia</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default memo(VideoPreview);

const styles = StyleSheet.create({
  container: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.xl, backgroundColor: COLORS.background, ...SHADOWS.md },
  placeholder: { height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surface },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.md },
});
