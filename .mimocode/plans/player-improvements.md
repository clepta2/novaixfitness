# Player Improvements Plan

## Goal
Create 5 new TypeScript files for player enhancements in novaix-fitness workout player.

## Files to Create

### 1. `src/components/workout/PlayerFullscreen.tsx` (~120 lines)
- Fullscreen landscape player mode using expo-screen-orientation for landscape lock
- expo-av Video with ResizeMode.CONTAIN
- Back button to return to portrait mode
- Overlay controls: play/pause, seek, speed, loop
- Unlock orientation on unmount

### 2. `src/components/workout/PlaybackSpeed.tsx` (~40 lines)
- Speed selector overlay with horizontal pills
- Speed options: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- Active pill highlighted with COLORS.primary
- Props: currentSpeed: number, onSelect: (speed: number) => void

### 3. `src/components/workout/VideoSeekBar.tsx` (~60 lines)
- Custom seek bar synchronized with workout timer
- Shows current position, total duration, exercise name markers
- Draggable thumb with Animated API for smooth updates
- Props: currentTime: number, duration: number, exerciseMarkers?: {time: number, name: string}[], onSeek: (time: number) => void

### 4. `src/hooks/usePlayerGestures.ts` (~70 lines)
- Hook for gesture-based video controls
- Double-tap left/right to skip ±10s
- Swipe up/down for volume
- Returns gesture handlers (panHandlers, tapHandlers)

### 5. `src/components/workout/LoopToggle.tsx` (~20 lines)
- Simple loop toggle button with repeat/repeat-off Ionicons
- Props: isLooping: boolean, onToggle: () => void

## Implementation Notes

- All files must be under 200 lines (TypeScript)
- Use existing design system: COLORS, SPACING, BORDER_RADIUS, ICON_SIZES
- Follow project conventions: imports from constants, styles inline when unique
- Use expo-av for video (already in package.json)
- Use react-native-gesture-handler for gestures (already in package.json)
- Use expo-screen-orientation for fullscreen (may need installation)

## Dependencies Check
- expo-av: ✅ already installed
- react-native-gesture-handler: ✅ already installed
- expo-screen-orientation: ❌ needs installation

## Next Steps
1. Install expo-screen-orientation
2. Create each component with proper TypeScript types
3. Export new components from barrel file
4. Integrate with existing ExerciseVideo component in player.tsx