// src/components/ui/AccessibleButton.tsx// ============================================================// COMPONENTE: AccessibleButton// TIPO: Botao com acessibilidade completa// USO: Substitui TouchableOpacity em acoes importantes// REGRAS: Usar em todos os botoes interativos// ============================================================
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { useColors  } from '../../context/ThemeContext';
interface AccessibleButtonProps {
 /** Texto do botao */  label: string;
 /** Callback ao press */  onPress: () => void;
 /** Variante visual */  variant?: 'primary' | 'secondary' | 'ghost';
 /** Tamanho */  size?: 'sm' | 'md' | 'lg';
 /** Icone opcional a esquerda */  icon?: string;
 /** Cor do icone */  iconColor?: string;
 /** Estado de loading */  loading?: boolean;
 /** Estado disabled */  disabled?: boolean;
 /** Accessibility label customizado */  accessibilityLabel?: string;
 /** Estilo customizado */  style?: ViewStyle;
}/** * Botao com suporte completo a acessibilidade. * * Features: * - accessibilityLabel automático * - accessibilityRole="button" * - accessibilityState={{
disabled, loading 
}
} * - Haptic feedback (via useHapticFeedback) * - Loading state com ActivityIndicator * * @example * ```tsx * <AccessibleButton label="SALVAR" onPress={handleSave
} variant="primary" /> * ``` * * @example * ```tsx * <AccessibleButton *   label="EXCLUIR" *   onPress={handleDelete
} *   variant="secondary" *   icon="trash-outline" *   iconColor={colors.error
} * /> * ``` */
export 
function AccessibleButton({
 label, onPress, variant = 'primary', size = 'md', icon, iconColor,  loading = 
false, disabled = 
false, accessibilityLabel, style,
}: AccessibleButtonProps) {
 
const colors = useColors();
 
const btnStyle = [    styles.base,    styles[variant],    styles[`size_${size
}`],    disabled && styles.disabled,    style,  ];
 
const textStyle = [    styles.text,    styles[`text_${variant
}`],    styles[`textSize_${size
}`],  ];
 
return (    <TouchableOpacity      style={btnStyle
}      onPress={onPress
}      disabled={disabled || loading
}      activeOpacity={0.8
}      accessibilityLabel={accessibilityLabel || label
}      accessibilityRole="button"      accessibilityState={{
disabled: disabled || loading, busy: loading 
}
}    >      {loading ? (        <ActivityIndicator size="small" color={variant === 'primary' ? colors.background : colors.primary
} />      ) : (        <>          {icon && <Ionicons name={icon as any
} size={size === 'sm' ? 16 : 20
} color={iconColor || (variant === 'primary' ? colors.background : colors.primary)
} />
}          <Text style={textStyle
}>{label
}</Text>        </>      )
}    </TouchableOpacity>  );
}
const styles = StyleSheet.create({
 base: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, borderRadius: BORDER_RADIUS.md 
},  primary: {
backgroundColor: colors.primary 
},  secondary: {
backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary 
},  ghost: {
backgroundColor: 'transparent' 
},  size_sm: {
paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md 
},  size_md: {
paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg 
},  size_lg: {
paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl 
},  disabled: {
opacity: 0.5 
},  text: {
fontFamily: 'Montserrat_700Bold', letterSpacing: 0.5 
},  text_primary: {
color: colors.background 
},  text_secondary: {
color: colors.primary 
},  text_ghost: {
color: colors.primary 
},  textSize_sm: {
fontSize: 12 
},  textSize_md: {
fontSize: 14 
},  textSize_lg: {
fontSize: 16 
},
});