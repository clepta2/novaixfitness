// src/components/ui/SearchBar.tsx
// Barra de busca com autocomplete - NOVAIX FITNESS

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows';

interface SearchSuggestion {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
}

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  suggestions?: SearchSuggestion[];
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
  showSuggestions?: boolean;
  autoFocus?: boolean;
  loading?: boolean;
}

export default function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  onSearch,
  onClear,
  suggestions = [],
  onSelectSuggestion,
  showSuggestions = true,
  autoFocus = false,
  loading = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const borderColor = useRef(Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderColor, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColors = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const handleFocus = () => {
    setIsFocused(true);
    if (suggestions.length > 0 && showSuggestions) setShowDropdown(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleClear = () => {
    onChangeText('');
    onClear?.();
    setShowDropdown(false);
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    onChangeText(suggestion.label);
    onSelectSuggestion?.(suggestion);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    onSearch?.(value);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputWrapper, { borderColor: borderColors }]}>
        <Ionicons name="search" size={18} color={isFocused ? COLORS.primary : COLORS.textMuted} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (text.length > 0 && suggestions.length > 0 && showSuggestions) {
              setShowDropdown(true);
            } else {
              setShowDropdown(false);
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
        {loading && (
          <View style={styles.loadingIndicator}>
            <Ionicons name="sync" size={16} color={COLORS.primary} />
          </View>
        )}
      </Animated.View>

      {/* Dropdown de sugestoes */}
      {showDropdown && suggestions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                {item.icon && (
                  <Ionicons name={item.icon as any} size={18} color={COLORS.textMuted} style={styles.suggestionIcon} />
                )}
                <View style={styles.suggestionText}>
                  <Text style={styles.suggestionLabel}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'relative', zIndex: 100 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: COLORS.textTitle,
    paddingVertical: 0,
  },
  clearBtn: { padding: 4 },
  loadingIndicator: { padding: 4 },
  dropdown: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
  },
  suggestionIcon: { marginRight: SPACING.sm },
  suggestionText: { flex: 1 },
  suggestionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textTitle,
  },
  suggestionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
});
