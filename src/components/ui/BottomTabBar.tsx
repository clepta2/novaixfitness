import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';

interface TabItem {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconOutline: React.ComponentProps<typeof Ionicons>['name'];
  route: string;
}

interface BottomTabBarProps {
  activeTab: string;
}

function BottomTabBar({ activeTab }: BottomTabBarProps) {
  const router = useRouter();

  const tabs: TabItem[] = [
    { key: 'home', label: 'Início', icon: 'home', iconOutline: 'home-outline', route: '/(tabs)/home' },
    { key: 'library', label: 'Treinos', icon: 'barbell', iconOutline: 'barbell-outline', route: '/(tabs)/library' },
    { key: 'feed', label: 'Comunidade', icon: 'people', iconOutline: 'people-outline', route: '/(tabs)/feed' },
    { key: 'config', label: 'Config.', icon: 'settings', iconOutline: 'settings-outline', route: '/(tabs)/config' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const focused = activeTab === tab.key;
        const color = focused ? COLORS.primary : COLORS.textMuted;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => router.replace(tab.route)}
            activeOpacity={0.8}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
          >
            <Ionicons name={focused ? tab.icon : tab.iconOutline} size={22} color={color} />
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default memo(BottomTabBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 85,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 24,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.4,
  },
});
