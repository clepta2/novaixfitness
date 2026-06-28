// src/components/ui/BottomTabBar.js
// Menu Tab Bar Reutilizável para Telas Internas - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/colors';

export default function BottomTabBar({ activeTab }) {
  const router = useRouter();

  const tabs = [
    { key: 'home', label: 'Início', icon: 'home', iconOutline: 'home-outline', route: '/(tabs)/home' },
    { key: 'library', label: 'Treinos', icon: 'barbell', iconOutline: 'barbell-outline', route: '/(tabs)/library' },
    { key: 'feed', label: 'Comunidade', icon: 'people', iconOutline: 'people-outline', route: '/(tabs)/feed' },
    { key: 'perfil', label: 'Perfil', icon: 'person', iconOutline: 'person-outline', route: '/(tabs)/perfil' },
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
