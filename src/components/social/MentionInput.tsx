import React, { memo, useState, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Avatar } from '../ui/Avatar';
import { supabase } from '../../config/supabase';
import { MENTION_SEARCH_LIMIT } from '../../config/socialConfig';

interface MentionUser { id: string; name: string; avatar_url: string | null }

interface MentionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onMention: (user: MentionUser) => void;
  userId: string;
  placeholder?: string;
}

function MentionInput({ value, onChangeText, onMention, userId, placeholder }: MentionInputProps) {
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 1) { setSuggestions([]); setShowSuggestions(false); return; }
    const { data } = await supabase.from('profiles').select('id, name, avatar_url')
      .ilike('name', `%${query}%`).neq('id', userId).limit(MENTION_SEARCH_LIMIT);
    setSuggestions(data || []);
    setShowSuggestions((data?.length || 0) > 0);
  }, [userId]);

  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
    const lastAt = text.lastIndexOf('@');
    if (lastAt >= 0 && (lastAt === 0 || text[lastAt - 1] === ' ')) {
      const query = text.slice(lastAt + 1);
      if (!query.includes(' ')) { searchUsers(query); return; }
    }
    setShowSuggestions(false);
  }, [onChangeText, searchUsers]);

  const handleSelect = useCallback((user: MentionUser) => {
    const before = value.slice(0, value.lastIndexOf('@'));
    onChangeText(`${before}@${user.name} `);
    setShowSuggestions(false);
    onMention(user);
    inputRef.current?.focus();
  }, [value, onChangeText, onMention]);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} value={value} onChangeText={handleChangeText}
        placeholder={placeholder || 'Escreva... use @ para mencionar'} placeholderTextColor={COLORS.textMuted} multiline />
      {showSuggestions && suggestions.length > 0 && (
        <FlatList data={suggestions} keyExtractor={(i) => i.id} style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
              <Avatar name={item.name} size="xs" />
              <Text style={styles.suggestionName}>{item.name}</Text>
            </TouchableOpacity>
          )} />
      )}
    </View>
  );
}

export default memo(MentionInput);

const styles = StyleSheet.create({
  container: { position: 'relative', zIndex: 1 },
  input: { height: 40, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  dropdown: { position: 'absolute', top: 44, left: 0, right: 0, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, maxHeight: 180, elevation: 4 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.sm },
  suggestionName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle },
});
