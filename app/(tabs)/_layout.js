// app/(tabs)/_layout.js
// Layout das Tabs - NOVAIX FITNESS

import { Suspense } from 'react';
import { Tabs } from 'expo-router';
import { Dumbbell, Users, User, HelpCircle, BookOpen } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../../src/constants/colors';

function TabLoading() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 10,
          letterSpacing: 0.5,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Treinos',
          tabBarIcon: ({ focused }) => <Dumbbell size={22} color={focused ? COLORS.primary : COLORS.textMuted} strokeWidth={focused ? 2.5 : 1.5} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ focused }) => <Users size={22} color={focused ? COLORS.primary : COLORS.textMuted} strokeWidth={focused ? 2.5 : 1.5} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <User size={22} color={focused ? COLORS.primary : COLORS.textMuted} strokeWidth={focused ? 2.5 : 1.5} />,
        }}
      />
      <Tabs.Screen
        name="ajuda"
        options={{
          title: 'Ajuda',
          tabBarIcon: ({ focused }) => <HelpCircle size={22} color={focused ? COLORS.primary : COLORS.textMuted} strokeWidth={focused ? 2.5 : 1.5} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ focused }) => <BookOpen size={22} color={focused ? COLORS.primary : COLORS.textMuted} strokeWidth={focused ? 2.5 : 1.5} />,
        }}
      />
    </Tabs>
  );
}
