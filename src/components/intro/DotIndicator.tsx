import { useEffect, useRef, memo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface DotIndicatorProps {
  total: number;
  currentIndex: number;
}

export default memo(function DotIndicator({ total, currentIndex }: DotIndicatorProps): React.JSX.Element {
  const animatedWidths = useRef<Animated.Value[]>(
    Array.from({ length: total }, () => new Animated.Value(0))
  ).current;

  useEffect((): void => {
    animatedWidths.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === currentIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [currentIndex]);

  return (
    <View style={styles.container} accessibilityRole="tablist" accessibilityLabel={`Slide ${currentIndex + 1} de ${total}`}>
      {animatedWidths.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            {
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [8, 24],
              }),
              backgroundColor: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.textMuted, COLORS.primary],
              }),
            },
          ]}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === currentIndex }}
          accessibilityLabel={`Slide ${i + 1}`}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
