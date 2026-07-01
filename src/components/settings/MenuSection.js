// src/components/settings/MenuSection.js
// Seção de menu animada - NOVAIX FITNESS

import React, { useRef, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

function MenuItem({ item, index, onPress }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, delay: index * 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 200, delay: index * 50, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX }] }}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => item.route ? onPress(item.route) : item.version ? null : onPress(item.action)}
        activeOpacity={0.7}
      >
        <View style={[styles.icon, { backgroundColor: item.color + '15' }]}>
          <Ionicons name={item.icon} size={18} color={item.color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>{item.label}</Text>
          {item.desc && <Text style={styles.desc}>{item.desc}</Text>}
        </View>
        {item.version ? (
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v{item.version}</Text>
          </View>
        ) : (
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function MenuSection({ title, items, onPress }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <MenuItem key={i} item={item} index={i} onPress={onPress} />
      ))}
    </View>
  );
}

export default memo(MenuSection);

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  sectionTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.xs, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.md },
  icon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1 },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle },
  desc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  versionBadge: { backgroundColor: COLORS.surfaceOverlay, paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  versionText: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted },
});
