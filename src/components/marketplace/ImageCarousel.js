// src/components/marketplace/ImageCarousel.js
// Carrossel de imagens do produto - NOVAIX FITNESS

import { useState, useRef } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function ImageCarousel({ images, height = 280 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <View style={styles.placeholder} />
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={[styles.image, { height }]} resizeMode="cover" />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { backgroundColor: COLORS.surfaceElevated },
  placeholder: { flex: 1, backgroundColor: COLORS.surfaceElevated },
  image: { width },
  dots: { position: 'absolute', bottom: SPACING.md, flexDirection: 'row', alignSelf: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: COLORS.primary, width: 18 },
});
