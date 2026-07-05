// src/components/social/ForumPostFormHelpers.js
// Hook de formulário e componente de seleção de categoria - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FORUM_CATEGORIES } from '../../data/forumCategories';

export function useForumPostForm(defaultCategory?: string) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory || FORUM_CATEGORIES[0]?.id || 'treino');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setContent('');
    setCategory(FORUM_CATEGORIES[0]?.id || 'treino');
  };

  const validate = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título e o conteúdo da discussão.');
      return false;
    }
    return true;
  };

  const submit = async (onSubmit: (data: { title: string; content: string; category: string }) => Promise<void>, onClose: () => void) => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit?.({ title: title.trim(), content: content.trim(), category });
      reset();
      onClose();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao criar post');
    } finally {
      setLoading(false);
    }
  };

  return { title, setTitle, content, setContent, category, setCategory, loading, submit };
}

export function CategorySelector({ category, setCategory }: { category: string; setCategory: (c: string) => void }) {
  return (
    <View style={s.container}>
      {FORUM_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[s.chip, category === cat.id && s.chipActive]}
          onPress={() => setCategory(cat.id)}
        >
          <Text style={[s.chipText, category === cat.id && s.chipTextActive]}>{cat.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full, backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textDescription },
  chipTextActive: { color: COLORS.background },
});
