// src/services/groups.js
// Serviço de grupos de treino

import { supabase } from '../config/supabase';
import { TABLES } from '../config/tables';
import { createServiceGuard } from '../utils/serviceGuard';

const guard = createServiceGuard({ serviceName: 'groups' });

export async function getGroups(limit = 20) {
  const { data } = await supabase
    .from(TABLES.WORKOUT_GROUPS)
    .select('*')
    .order('member_count', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function getGroupById(groupId) {
  const { data } = await supabase
    .from(TABLES.WORKOUT_GROUPS)
    .select('*')
    .eq('id', groupId)
    .single();

  return data;
}

export async function createGroup(name, description, category, userId) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.WORKOUT_GROUPS)
      .insert({ name, description, category, created_by: userId, member_count: 1 })
      .select()
      .single();

    if (error) throw error;

    await supabase.from(TABLES.GROUP_MEMBERS).insert({
      group_id: data.id,
      user_id: userId,
      role: 'admin',
    });

    return data;
  });
  return result.ok ? result.data : null;
}

export async function joinGroup(groupId, userId) {
  await guard.guard(async () => {
    const { error } = await supabase.from(TABLES.GROUP_MEMBERS).insert({
      group_id: groupId,
      user_id: userId,
    });

    if (error) throw error;

    await supabase.rpc('increment_column', {
      table_name: 'workout_groups',
      column_name: 'member_count',
      row_id: groupId,
    });
  });
}

export async function leaveGroup(groupId, userId) {
  await supabase.from(TABLES.GROUP_MEMBERS).delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
}

export async function getGroupPosts(groupId, limit = 20) {
  const { data } = await supabase
    .from(TABLES.GROUP_POSTS)
    .select('*, profiles:user_id(name, avatar_url)')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data || [];
}

export async function createGroupPost(groupId, userId, content, imageUrl) {
  const result = await guard.guard(async () => {
    const { data, error } = await supabase
      .from(TABLES.GROUP_POSTS)
      .insert({ group_id: groupId, user_id: userId, content, image_url: imageUrl })
      .select('*, profiles:user_id(name, avatar_url)')
      .single();

    if (error) throw error;
    return data;
  });
  return result.ok ? result.data : null;
}
