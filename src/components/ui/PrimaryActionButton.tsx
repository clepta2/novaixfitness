// src/components/ui/PrimaryActionButton.tsx// Botao de acao principal full-width - NOVAIX FITNESS
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface PrimaryActionButtonProps {
 label: string; onPress: () => void;
 icon?: string;
 variant?: 'primary' | 'surface' | 'danger';
 disabled?: boolean;
 loading?: boolean;
}
export function PrimaryActionButton({label,  onPress,  icon,  variant = 'primary',  disabled,  loading,
}: PrimaryActionButtonProps) {
const colors = useColors();
 
const variantStyles = { primary: {
bg: colors.primary, text: colors.background },    surface: {
bg: colors.surface, text: colors.textTitle },    danger: {
bg: colors.error, text: colors.background },  
};
 
const v = variantStyles[variant];
 
return (    <TouchableOpacity      style={[ styles.btn,        {
backgroundColor: v.bg },        disabled && styles.disabled,      ]
}      onPress={onPress
}      disabled={disabled || loading
}      activeOpacity={0.8
}      accessibilityRole="button"    >      {icon && <Ionicons name={icon as any
} size={18
} color={v.text
} />
}      <Text style={[styles.label, {
color: v.text }]
}>        {loading ? 'CARREGANDO...' : label
}      </Text>    </TouchableOpacity>  );
}
const styles = StyleSheet.create({
 btn: { flexDirection: 'row',    alignItems: 'center',    justifyContent: 'center',    gap: SPACING.sm,    paddingVertical: SPACING.md,    paddingHorizontal: SPACING.xl,    borderRadius: BORDER_RADIUS.md,  
},  disabled: {
opacity: 0.5 },  label: {
   fontFamily: 'Montserrat_700Bold', fontSize: 14,    letterSpacing: 0.5,  
},
});