// src/components/onboarding/DraggableSlider.js
// Slider arrastavel com edicao numerica - NOVAIX FITNESS

import { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, PanResponder, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function DraggableSlider({ label, value, setValue, min, max, unit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(String(value));
  const trackWidth = useRef(260);

  const pct = (value - min) / (max - min);
  const thumbLeft = `${pct * 100}%`;

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gesture) => {
      const width = trackWidth.current;
      const dx = gesture.dx;
      const ratio = Math.max(0, Math.min(1, (pct * width + dx) / width));
      const newVal = Math.round(min + ratio * (max - min));
      setValue(Math.max(min, Math.min(max, newVal)));
    },
    onPanResponderRelease: () => {},
  }), [pct, min, max, setValue]);

  const commitEdit = () => {
    const cleaned = editText.replace(/\D/g, '');
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      setValue(num);
      setEditText(String(num));
    }
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={typography.label}>{label}</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={editText}
            onChangeText={setEditText}
            keyboardType="numeric"
            autoFocus
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
          />
        ) : (
          <TouchableOpacity onPress={() => { setEditText(String(value)); setEditing(true); }}>
            <Text style={[typography.h3, { textDecorationLine: 'underline', textDecorationStyle: 'dotted' }]}>{value} {unit}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.trackRow} onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%` }]} />
        </View>
        <Animated.View style={[styles.thumb, { left: thumbLeft }]} {...panResponder.panHandlers}>
          <View style={styles.thumbDot} />
        </Animated.View>
      </View>

      <View style={styles.labels}>
        <Text style={styles.labelText}>{min}{unit}</Text>
        <Text style={styles.labelText}>{max}{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  input: {
    backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, borderWidth: 1,
    borderColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: 4,
    color: COLORS.primary, fontSize: 18, fontFamily: 'Inter_700Bold', width: 70, textAlign: 'center',
  },
  trackRow: { height: 40, justifyContent: 'center' },
  track: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  thumb: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginLeft: -14, elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 4,
  },
  thumbDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.background },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs },
  labelText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});
