// src/components/workout/PlayerFullscreen.tsx
// Fullscreen landscape video player - NOVAIX FITNESS

import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import PlaybackSpeed from './PlaybackSpeed';
import VideoSeekBar from './VideoSeekBar';
import LoopToggle from './LoopToggle';

const { width, height } = Dimensions.get('window');

interface PlayerFullscreenProps {
  videoUri: string;
  exerciseMarkers?: { time: number; name: string }[];
  onClose: () => void;
}

export default function PlayerFullscreen({ videoUri, exerciseMarkers = [], onClose }: PlayerFullscreenProps) {
  const videoRef = useRef<Video>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [showSpeedSelector, setShowSpeedSelector] = useState(false);


  useEffect(() => {
    lockToLandscape();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const lockToLandscape = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  const handleBack = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    onClose();
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = async (time: number) => {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(time * 1000);
    setCurrentTime(time);
  };

  const handleSpeedSelect = async (speed: number) => {
    if (!videoRef.current) return;
    await videoRef.current.setRateAsync(speed, true);
    setPlaybackSpeed(speed);
    setShowSpeedSelector(false);
  };

  const toggleLoop = async () => {
    if (!videoRef.current) return;
    const newLooping = !isLooping;
    await videoRef.current.setIsLoopingAsync(newLooping);
    setIsLooping(newLooping);
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={isPlaying}
        isLooping={isLooping}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={ICON_SIZES.lg} color={COLORS.textTitle} />
      </TouchableOpacity>

      <View style={styles.controlsOverlay}>
        <View style={styles.topControls}>
          <LoopToggle isLooping={isLooping} onToggle={toggleLoop} />
          <TouchableOpacity 
            style={styles.speedButton}
            onPress={() => setShowSpeedSelector(true)}
          >
            <Ionicons name="speedometer" size={ICON_SIZES.md} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.centerControls}>
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => handleSeek(currentTime - 10)}
          >
            <Ionicons name="play-back" size={ICON_SIZES.xl} color={COLORS.textTitle} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={ICON_SIZES.xxl} 
              color={COLORS.background} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => handleSeek(currentTime + 10)}
          >
            <Ionicons name="play-forward" size={ICON_SIZES.xl} color={COLORS.textTitle} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomControls}>
          <VideoSeekBar
            currentTime={currentTime}
            duration={duration}
            exerciseMarkers={exerciseMarkers}
            onSeek={handleSeek}
          />
        </View>
      </View>

      {showSpeedSelector && (
        <PlaybackSpeed
          currentSpeed={playbackSpeed}
          onSelect={handleSpeedSelect}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  video: { width: height, height: width },
  backButton: { position: 'absolute', top: SPACING.lg, left: SPACING.lg, padding: SPACING.sm, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.full },
  controlsOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'space-between', padding: SPACING.lg },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  speedButton: { padding: SPACING.sm, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.full },
  centerControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.xxxl },
  skipButton: { padding: SPACING.sm, backgroundColor: COLORS.surfaceOverlay, borderRadius: BORDER_RADIUS.full },
  playPauseButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  bottomControls: { paddingBottom: SPACING.lg },
});