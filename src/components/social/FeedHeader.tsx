import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { layout, typography } from '../../styles';

export default memo(function FeedHeader({ hasNotif, onNotificationsPress }) {
  return (
    <View style={layout.header}>
      <View>
        <Text style={typography.h2}>Comunidade</Text>
        <Text style={typography.bodyMuted}>Veja o que seus amigos estão treinando</Text>
      </View>
      <TouchableOpacity style={layout.headerBtn} onPress={onNotificationsPress}>
        <Ionicons name="notifications-outline" size={22} color={COLORS.textMuted} />
        {hasNotif && <View style={styles.badge} />}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
});
