import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SimpleStepperProps {
  total: number;
  current: number;
}

export default function SimpleStepper({ total, current }: SimpleStepperProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[
          styles.dot,
          i <= current ? styles.dotActive : styles.dotInactive,
        ]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#CCFF00' },
  dotInactive: { backgroundColor: '#2A2F38' },
});
