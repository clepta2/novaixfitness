import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface MuteUserButtonProps {
  userId: string;
  isMuted: boolean;
  onToggle: (userId: string) => void;
}

function MuteUserButton({ userId, isMuted, onToggle }: MuteUserButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isMuted && styles.buttonActive]}
      onPress={() => onToggle(userId)}
      activeOpacity={0.7}
      accessibilityLabel={isMuted ? 'Desmutar usuário' : 'Mutar usuário'}
      accessibilityRole="button"
    >
      <Ionicons
        name={isMuted ? 'volume-mute' : 'volume-high'}
        size={18}
        color={isMuted ? COLORS.primary : COLORS.textMuted}
      />
    </TouchableOpacity>
  );
}

export default memo(MuteUserButton);

const styles = StyleSheet.create({
  button: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  buttonActive: { backgroundColor: COLORS.primary + '20' },
});
