import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, PanResponder } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export default function DraggableSlider({ label, value, setValue, min, max, unit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(String(value));
  const trackRef = useRef(null);
  const trackWidth = useRef(260);
  const startValue = useRef(value);

  const pct = (value - min) / (max - min);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gesture) => {
        startValue.current = value;
      },
      onPanResponderMove: (_, gesture) => {
        const width = trackWidth.current;
        if (width <= 0) return;
        const ratio = Math.max(0, Math.min(1, gesture.dx / width));
        const range = max - min;
        const newVal = Math.round(startValue.current + ratio * range);
        setValue(Math.max(min, Math.min(max, newVal)));
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleTrackPress = (e) => {
    const { locationX } = e.nativeEvent;
    const width = trackWidth.current;
    if (width <= 0) return;
    const ratio = Math.max(0, Math.min(1, locationX / width));
    const newVal = Math.round(min + ratio * (max - min));
    setValue(Math.max(min, Math.min(max, newVal)));
  };

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
          <TextInput style={styles.input} value={editText} onChangeText={setEditText} keyboardType="numeric" autoFocus onBlur={commitEdit} onSubmitEditing={commitEdit} accessibilityLabel={`${label}: valor`} />
        ) : (
          <TouchableOpacity onPress={() => { setEditText(String(value)); setEditing(true); }} accessibilityLabel={`${label}: ${value} ${unit}. Toque para editar`} accessibilityRole="button">
            <Text style={[typography.h3, { textDecorationLine: 'underline', textDecorationStyle: 'dotted' }]}>{value} {unit}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        ref={trackRef}
        style={styles.trackRow}
        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
      >
        <TouchableOpacity activeOpacity={1} onPress={handleTrackPress} style={styles.trackTouch} accessibilityLabel={`${label}: ${value} ${unit}`} accessibilityRole="adjustable" accessibilityValue={{ min, max, now: value }}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct * 100}%` }]} />
          </View>
        </TouchableOpacity>
        <View style={[styles.thumbWrap, { left: `${pct * 100}%` }]} {...panResponder.panHandlers}>
          <View style={styles.thumb}>
            <View style={styles.thumbDot} />
          </View>
        </View>
      </View>

      <View style={styles.labels}>
        <Text style={styles.labelMin}>{min}{unit}</Text>
        <Text style={styles.labelMax}>{max}{unit}</Text>
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
  trackRow: { height: 40, justifyContent: 'center', position: 'relative' },
  trackTouch: { height: 20, justifyContent: 'center' },
  track: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  thumbWrap: { position: 'absolute', marginLeft: -14, top: 0, bottom: 0, justifyContent: 'center', width: 28, alignItems: 'center' },
  thumb: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 4,
  },
  thumbDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.background },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs },
  labelMin: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
  labelMax: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted },
});