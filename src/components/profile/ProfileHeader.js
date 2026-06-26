// src/components/profile/ProfileHeader.js
// Header do perfil - NOVAIX FITNESS

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../index';

export default function ProfileHeader({ name, email, memberSince, uri, onPressAvatar }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressAvatar} disabled={!onPressAvatar}>
        <Avatar name={name} uri={uri} size="xl" />
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.memberSince}>Membro desde {memberSince}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: COLORS.textTitle, marginTop: SPACING.lg },
  email: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.xs },
  memberSince: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginTop: SPACING.sm },
});
