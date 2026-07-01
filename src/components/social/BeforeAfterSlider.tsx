// src/components/social/BeforeAfterSlider.js
// Slider lado a lado para fotos antes/depois

import { useState, useRef } from 'react';
import { View, Image, PanResponder, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS, SPACING } from '../../constants/spacing';

export default function BeforeAfterSlider({ beforeUri, afterUri }) {
  const [sliderX, setSliderX] = useState(0.5);
  const containerWidth = useRef(300);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newX = Math.max(0, Math.min(1, gestureState.moveX / containerWidth.current));
        setSliderX(newX);
      },
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={(e) => { containerWidth.current = e.nativeEvent.layout.width; }}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: afterUri }} style={styles.image} resizeMode="cover" />
      <View style={[styles.beforeContainer, { width: `${sliderX * 100}%` }]}>
        <Image source={{ uri: beforeUri }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={[styles.slider, { left: `${sliderX * 100}%` }]}>
        <View style={styles.sliderLine} />
        <View style={styles.sliderHandle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 220, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', position: 'relative' },
  image: { width: '100%', height: '100%', backgroundColor: COLORS.surfaceElevated },
  beforeContainer: { position: 'absolute', top: 0, left: 0, height: '100%', overflow: 'hidden' },
  slider: { position: 'absolute', top: 0, height: '100%', width: 3, alignItems: 'center' },
  sliderLine: { flex: 1, width: 2, backgroundColor: COLORS.primary },
  sliderHandle: {
    position: 'absolute', top: '50%', width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.textTitle,
    marginTop: -14, marginLeft: -13,
  },
});
