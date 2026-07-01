import { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated, View, StyleSheet, ColorValue } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../../src/constants/colors';
import { ICON_SIZES } from '../../src/constants/spacing';
import { ComponentProps } from 'react';

type AnimatedTabIconProps = {
  name: ComponentProps<typeof Ionicons>['name'];
  nameOutline: ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  color: ColorValue;
};

function AnimatedTabIcon({ name, nameOutline, focused, color }: AnimatedTabIconProps) {
  const [scale] = useState(() => new Animated.Value(1));

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.2 : 1,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [scale, focused]);

  return (
    <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
      <Ionicons name={focused ? name : nameOutline} size={ICON_SIZES.md} color={color} />
      {focused && <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: COLORS.primary, marginTop: 3 }} />}
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarBackground: () => <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />,
        tabBarStyle: {
          position: 'absolute', backgroundColor: 'transparent',
          borderTopColor: COLORS.borderLight, borderTopWidth: StyleSheet.hairlineWidth,
          height: 85, paddingBottom: 24, paddingTop: 8, elevation: 0,
        },
        tabBarLabelStyle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, letterSpacing: 0.4, marginTop: 2 },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início', tabBarIcon: ({ focused, color }) => <AnimatedTabIcon name="home" nameOutline="home-outline" focused={focused} color={color} /> }} />
      <Tabs.Screen name="library" options={{ title: 'Treinos', tabBarIcon: ({ focused, color }) => <AnimatedTabIcon name="barbell" nameOutline="barbell-outline" focused={focused} color={color} /> }} />
      <Tabs.Screen name="feed" options={{ title: 'Comunidade', tabBarIcon: ({ focused, color }) => <AnimatedTabIcon name="people" nameOutline="people-outline" focused={focused} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: 'Config.', href: null }} />
      <Tabs.Screen name="config" options={{ title: 'Configurações', tabBarIcon: ({ focused, color }) => <AnimatedTabIcon name="settings" nameOutline="settings-outline" focused={focused} color={color} /> }} />
      <Tabs.Screen name="ajuda" options={{ href: null }} />
      <Tabs.Screen name="group" options={{ href: null }} />
      <Tabs.Screen name="perfil/history" options={{ href: null }} />
      <Tabs.Screen name="perfil/links" options={{ href: null }} />
      <Tabs.Screen name="perfil/lgpd" options={{ href: null }} />
      <Tabs.Screen name="perfil/termos" options={{ href: null }} />
      <Tabs.Screen name="perfil/conheca-nos" options={{ href: null }} />
      <Tabs.Screen name="perfil/user-profile" options={{ href: null }} />
      <Tabs.Screen name="perfil/saved" options={{ href: null }} />
    </Tabs>
  );
}
