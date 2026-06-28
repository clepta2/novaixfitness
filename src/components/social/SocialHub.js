import React, { useState, useRef, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'challenges', label: 'Desafios' },
  { id: 'ranking', label: 'Ranking' },
  { id: 'forum', label: 'Fórum' },
];

function SocialHub({ children, badgeCounts = {} }) {
  const [activeTab, setActiveTab] = useState('feed');
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = `${100 / TABS.length}%`;

  const handleTabPress = (index) => {
    setActiveTab(TABS[index].id);
    Animated.spring(indicatorAnim, { toValue: index, useNativeDriver: false, tension: 68, friction: 10 }).start();
  };

  const translateX = indicatorAnim.interpolate({
    inputRange: TABS.map((_, i) => i),
    outputRange: TABS.map((_, i) => `${i * 100}%`),
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabBar} accessibilityRole="tablist">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const badge = badgeCounts[tab.id];
          return (
            <TouchableOpacity key={tab.id} style={[styles.tab, { width: tabWidth }]} onPress={() => handleTabPress(index)} accessibilityRole="tab" accessibilityState={{ selected: isActive }}>
              <View style={styles.tabContent}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                {badge > 0 && <View style={styles.tabBadge}><Text style={styles.tabBadgeText}>{badge}</Text></View>}
              </View>
            </TouchableOpacity>
          );
        })}
        <Animated.View style={[styles.indicator, { width: tabWidth, transform: [{ translateX }] }]} />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
  );
}

export default memo(SocialHub);

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border, position: 'relative' },
  tab: { paddingVertical: SPACING.md, alignItems: 'center' },
  tabContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textMuted },
  tabTextActive: { fontFamily: 'Montserrat_700Bold', color: COLORS.primary },
  tabBadge: { backgroundColor: COLORS.error, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  tabBadgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 9, color: '#FFF' },
  indicator: { position: 'absolute', bottom: 0, height: 3, backgroundColor: COLORS.primary, borderRadius: 2 },
  content: { flex: 1 },
  contentContainer: { padding: SPACING.lg },
});
