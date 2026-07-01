// src/components/ui/AvatarGroup.tsx
// Grupo de avatares sobrepostos - NOVAIX FITNESS

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

interface AvatarItem {
  name?: string;
  avatar?: string;
  id: string;
}

interface AvatarGroupProps {
  avatars: AvatarItem[];
  maxVisible?: number;
  size?: number;
  onMorePress?: () => void;
}

export default function AvatarGroup({
  avatars,
  maxVisible = 4,
  size = 36,
  onMorePress,
}: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remaining = avatars.length - maxVisible;

  return (
    <View style={styles.container}>
      {visibleAvatars.map((avatar, index) => (
        <View
          key={avatar.id}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              zIndex: maxVisible - index,
              marginLeft: index > 0 ? -size * 0.3 : 0,
            },
          ]}
        >
          {avatar.avatar ? (
            <AvatarImage uri={avatar.avatar} size={size} />
          ) : (
            <View style={[styles.initialsContainer, { width: size, height: size, borderRadius: size / 2 }]}>
              <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
                {getInitials(avatar.name)}
              </Text>
            </View>
          )}
        </View>
      ))}

      {remaining > 0 && (
        <View
          style={[
            styles.avatar,
            styles.moreAvatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.3,
            },
          ]}
          onTouchEnd={onMorePress}
        >
          <Text style={[styles.moreText, { fontSize: size * 0.35 }]}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
}

// Componente interno para imagem do avatar
function AvatarImage({ uri, size }: { uri: string; size: number }) {
  return (
    <View style={[styles.imageContainer, { width: size, height: size, borderRadius: size / 2 }]}>
      <Ionicons name="person" size={size * 0.5} color={COLORS.textMuted} />
    </View>
  );
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  initialsContainer: {
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Montserrat_600SemiBold',
    color: COLORS.primary,
  },
  imageContainer: {
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreAvatar: {
    backgroundColor: COLORS.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.textMuted,
  },
});
