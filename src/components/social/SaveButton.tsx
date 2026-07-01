// src/components/social/SaveButton.js
// Botão de salvar/bookmark posts

import { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { supabase } from '../../config/supabase';

export default function SaveButton({ postId, userId }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => { checkSaved(); }, [postId, userId]);

  const checkSaved = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('saved_posts')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    setSaved(!!data);
  };

  const handleToggle = async () => {
    if (!userId) return;
    if (saved) {
      await supabase.from('saved_posts').delete()
        .eq('user_id', userId).eq('post_id', postId);
    } else {
      await supabase.from('saved_posts').insert({ user_id: userId, post_id: postId });
    }
    setSaved(!saved);
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleToggle}>
      <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? COLORS.primary : COLORS.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 4 },
});
