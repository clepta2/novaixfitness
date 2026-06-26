import { View, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

export default function ChatInput({ value, onChange, onSend, loading }) {
  return (
    <View style={styles.inputArea}>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChange}
        placeholder="Pergunte sobre treino ou dieta..."
        placeholderTextColor={COLORS.textMuted}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendBtn, !value.trim() && styles.sendBtnDisabled]}
        onPress={onSend}
        disabled={loading || !value.trim()}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.background} />
        ) : (
          <Ionicons name="send" size={18} color={COLORS.background} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputArea: { flexDirection: 'row', padding: SPACING.md, backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, gap: SPACING.sm, alignItems: 'flex-end' },
  textInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { opacity: 0.5 },
});
