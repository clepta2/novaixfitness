// src/hooks/usePlayerGestures.ts
// Gesture-based video controls hook - NOVAIX FITNESS

import { useRef, useMemo } from 'react';
import { Gesture, RaceGesture } from 'react-native-gesture-handler';
import { Video } from 'expo-av';

interface UsePlayerGesturesProps {
  videoRef: React.RefObject<Video>;
  onVolumeChange?: (volume: number) => void;
}

export function usePlayerGestures({ videoRef, onVolumeChange }: UsePlayerGesturesProps) {
  const lastTap = useRef<number>(0);
  const currentVolume = useRef<number>(0.5);

  const composed: RaceGesture = useMemo(() => {
    const tapGesture = Gesture.Tap()
      // eslint-disable-next-line react-hooks/refs
      .onEnd((event) => {
        // eslint-disable-next-line react-hooks/purity
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
          const screenWidth = 300;
          const tapX = event.absoluteX;
          const side = tapX < screenWidth / 2 ? 'left' : 'right';
          const skipAmount = side === 'left' ? -10 : 10;

          if (videoRef.current) {
            videoRef.current.getStatusAsync().then((status) => {
              const currentTime = status.isLoaded ? status.positionMillis / 1000 : 0;
              const newPosition = Math.max(0, currentTime + skipAmount);
              videoRef.current?.setPositionAsync(newPosition * 1000);
            });
          }
        }
        lastTap.current = now;
      });

    const panGesture = Gesture.Pan()
      // eslint-disable-next-line react-hooks/refs
      .onUpdate((event) => {
        if (!videoRef.current) return;
        const { translationY, translationX } = event;
        const SENSITIVITY = 0.01;

        if (Math.abs(translationY) > Math.abs(translationX)) {
          const volumeChange = -translationY * SENSITIVITY;
          const newVolume = Math.max(0, Math.min(1, currentVolume.current + volumeChange));
          currentVolume.current = newVolume;
          videoRef.current.setVolumeAsync(newVolume);
          onVolumeChange?.(newVolume);
        }
      });

    return Gesture.Race(tapGesture, panGesture);
  }, [videoRef, onVolumeChange]);

  return {
    panHandlers: composed,
    tapHandlers: composed,
  };
}
