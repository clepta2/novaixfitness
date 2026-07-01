// src/components/workout/VideoSeekBar.tsx
// Custom seek bar with exercise markers - NOVAIX FITNESS

import React, { useMemo } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

interface VideoSeekBarProps {
  currentTime: number;
  duration: number;
  exerciseMarkers?: { time: number; name: string }[];
  onSeek: (time: number) => void;
}

const TRACK_WIDTH = 280;

export default function VideoSeekBar({ 
  currentTime, 
  duration, 
  exerciseMarkers = [], 
  onSeek 
}: VideoSeekBarProps) {
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.max(0, Math.min(gestureState.moveX, TRACK_WIDTH));
      const seekTime = (newPosition / TRACK_WIDTH) * duration;
      onSeek(seekTime);
    },
    onPanResponderRelease: (_, gestureState) => {
      const newPosition = Math.max(0, Math.min(gestureState.moveX, TRACK_WIDTH));
      const seekTime = (newPosition / TRACK_WIDTH) * duration;
      onSeek(seekTime);
    },
  }), [duration, onSeek]);

  const progress = duration > 0 ? currentTime / duration : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      
      <View style={styles.trackContainer} {...panResponder.panHandlers}>
        <View style={styles.track}>
          <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          
          {exerciseMarkers.map((marker, index) => {
            const markerPosition = (marker.time / duration) * 100;
            return (
              <View
                key={index}
                style={[styles.marker, { left: `${markerPosition}%` }]}
              >
                <View style={styles.markerDot} />
                <Text style={styles.markerText} numberOfLines={1}>
                  {marker.name}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View
          style={[
            styles.thumb,
            {
              left: `${progress * 100}%`,
              transform: [{ translateX: -12 }],
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingVertical: SPACING.sm },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  timeText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '500' },
  trackContainer: { position: 'relative', height: 24, justifyContent: 'center' },
  track: { height: 4, backgroundColor: COLORS.surface, borderRadius: 2, position: 'relative' },
  progress: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  thumb: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, top: 0, elevation: 3, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  marker: { position: 'absolute', top: 8, alignItems: 'center' },
  markerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.secondary },
  markerText: { position: 'absolute', top: 10, color: COLORS.textMuted, fontSize: 10, width: 60, textAlign: 'center' },
});