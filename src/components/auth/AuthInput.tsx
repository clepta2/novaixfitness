import { memo, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardTypeOptions, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS, ICON_SIZES } from '../../constants/spacing';
import { scale } from '../../utils/responsive';

interface AuthInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  translucent?: boolean;
}

function AuthInput({ label, placeholder, value, onChangeText, icon, secureTextEntry, keyboardType, autoCapitalize, error, translucent }: AuthInputProps): React.JSX.Element {
  const [focused, setFocused] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(true);

  const handleFocus = useCallback((): void => setFocused(true), []);
  const handleBlur = useCallback((): void => setFocused(false), []);

  const borderColor = error ? COLORS.error : focused ? COLORS.primary : translucent ? 'rgba(255, 255, 255, 0.12)' : COLORS.border;
  const wrapperBackground = translucent ? 'rgba(30, 35, 42, 0.55)' : COLORS.surface;
  const textColor = COLORS.textTitle;
  const placeholderColor = translucent ? 'rgba(255, 255, 255, 0.4)' : COLORS.textMuted;
  const labelColor = translucent ? 'rgba(255, 255, 255, 0.8)' : COLORS.textTitle;

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: labelColor }]}>{label}</Text> : null}
      <View style={[styles.wrapper, { borderColor, backgroundColor: wrapperBackground }]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={ICON_SIZES.sm}
            color={focused ? COLORS.primary : translucent ? 'rgba(255, 255, 255, 0.6)' : COLORS.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureTextEntry && hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label || placeholder}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eye} accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'} accessibilityRole="button">
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={ICON_SIZES.sm} color={translucent ? 'rgba(255, 255, 255, 0.6)' : COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

export default memo(AuthInput);

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: scale(11),
    color: COLORS.textTitle,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: scale(56),
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
  },
  icon: { marginLeft: SPACING.md, marginRight: SPACING.xs },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: SPACING.md,
    color: COLORS.textTitle,
    fontFamily: 'Inter_400Regular',
    fontSize: scale(15),
  },
  eye: { paddingHorizontal: SPACING.md, height: '100%', justifyContent: 'center' },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: scale(12),
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
