// src/components/social/challenge/FriendSelector.tsx
// Step 1: Seleção de amigo para desafio - NOVAIX FITNESS

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../constants/spacing';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
}

interface FriendSelectorProps {
  friends: Friend[];
  selectedFriend: Friend | null;
  onSelect: (friend: Friend) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  colors: typeof COLORS;
}

export function FriendSelector({
  friends,
  selectedFriend,
  onSelect,
  searchQuery,
  onSearchChange,
  colors,
}: FriendSelectorProps): React.JSX.Element {
  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textTitle }]}>Escolha um Amigo</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Quem você quer desafiar?</Text>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.textTitle }]}
          placeholder="Buscar amigo..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
        {filteredFriends.map(friend => (
          <TouchableOpacity
            key={friend.id}
            style={[
              styles.friendItem,
              { backgroundColor: colors.background, borderColor: colors.border },
              selectedFriend?.id === friend.id && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
            ]}
            onPress={() => onSelect(friend)}
          >
            <Image source={{ uri: friend.avatar }} style={styles.avatar} />
            <View style={styles.friendInfo}>
              <Text style={[styles.friendName, { color: colors.textTitle }]}>{friend.name}</Text>
              <Text style={[styles.friendXP, { color: colors.textMuted }]}>{friend.xp} XP</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 300 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 20, marginBottom: SPACING.xs },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.xl },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, paddingVertical: SPACING.md, marginLeft: SPACING.sm },
  friendsList: { maxHeight: 250 },
  friendItem: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2a2a2a' },
  friendInfo: { flex: 1, marginLeft: SPACING.md },
  friendName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 },
  friendXP: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});

export default FriendSelector;
