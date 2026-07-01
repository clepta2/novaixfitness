// src/components/social/WorkoutGroups.js
// Lista de grupos de treino

import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

export default function WorkoutGroups({ currentUserId, onSelectGroup }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGroups(); }, []);

  const loadGroups = async () => {
    const { data } = await supabase
      .from('workout_groups')
      .select('*')
      .order('member_count', { ascending: false })
      .limit(20);

    setGroups(data || []);
    setLoading(false);
  };

  const handleJoin = async (groupId) => {
    await supabase.from('group_members').insert({ group_id: groupId, user_id: currentUserId });
    loadGroups();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GRUPOS DE TREINO</Text>
      <FlatList
        data={groups}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelectGroup?.(item)}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.members}>{item.member_count || 0} membros</Text>
            <TouchableOpacity style={styles.joinBtn} onPress={() => handleJoin(item.id)}>
              <Text style={styles.joinText}>Entrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>Nenhum grupo ainda</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, letterSpacing: 1 },
  card: { width: 160, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginRight: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  name: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: COLORS.textTitle, marginBottom: 4 },
  members: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.md },
  joinBtn: { backgroundColor: COLORS.primary, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, alignItems: 'center' },
  joinText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.background },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
});
