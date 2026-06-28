import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../../constants/colors';

const SIZE = 220;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function TimerRing({ color, progress, isUrgent }) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} />
            <Stop offset="1" stopColor={color} stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={COLORS.surfaceOverlay} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          stroke="url(#timerGrad)" strokeWidth={STROKE} fill="none"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
        {isUrgent && <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS + STROKE / 2 + 4} stroke={COLORS.error} strokeWidth={2} fill="none" opacity={0.5} />}
      </Svg>
    </View>
  );
}

export default memo(TimerRing);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});
