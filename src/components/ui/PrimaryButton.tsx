// src/components/ui/PrimaryButton.tsx// Botao primario reutilizavel - NOVAIX FITNESS
import React  from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { shadow } from '../../helpers/shadows'
import { useColors } from '../../context/ThemeContext';
interface PrimaryButtonProps {
 title: string; onPress: () => void;
 icon?: string;
 loading?: boolean;
 disabled?: boolean;
 variant?: 'primary' | 'secondary' | 'danger';
 size?: 'sm' | 'md' | 'lg';
}
export default function PrimaryButton({
title, onPress, icon, loading = false, disabled = 
false, variant = 'primary', size = 'md' 
}: PrimaryButtonProps) {
const bgColor = variant === 'danger' ? colors.error : variant === 'secondary' ? colors.surface : colors.primary; const textColor = variant === 'secondary' ? colors.textTitle : colors.background;
 
const isLarge = size === 'lg';
 
const isSmall = size === 'sm';
 
return (    <TouchableOpacity      onPress={onPress
}      disabled={disabled || loading
}      style={[ styles.btn,        {
backgroundColor: bgColor },        variant === 'primary' && shadow({
y: 4, blur: 8, color: colors.primary, opacity: 0.3 }),        isLarge && styles.lg,        isSmall && styles.sm,        (disabled || loading) && styles.disabled,      ]
}      activeOpacity={0.8
}    >      {loading ? ( <ActivityIndicator size="small" color={textColor
} />      ) : (        <>          {icon && <Ionicons name={icon as any
} size={isSmall ? 16 : 20
} color={textColor
} />
}          <Text style={[styles.text, {
color: textColor }, isSmall && styles.textSm]
}>{title
}</Text>        </>      )
}    </TouchableOpacity>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
btn: {
   flexDirection: 'row', alignItems: 'center',    justifyContent: 'center',    gap: SPACING.sm,    paddingVertical: SPACING.md,    paddingHorizontal: SPACING.xl,    borderRadius: BORDER_RADIUS.md,  
},  lg: {
   paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl,  
},  sm: {
   paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,  
},  text: {
   fontFamily: 'Montserrat_700Bold', fontSize: 14,    letterSpacing: 0.5,  
},  textSm: {
   fontSize: 12, },  disabled: {
   opacity: 0.5, },
});