// src/components/ui/HapticButton.tsx// Botao com feedback haptico e micro-interacoes - Rebranding 2026
import React, {
useRef } from 'react';
import {   TouchableOpacity, Text,   StyleSheet,   Animated,   ViewStyle } from 'react-native'
import * as Haptics  from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface HapticButtonProps {
 children?: React.ReactNode; label?: string;
 icon?: string;
 iconPosition?: 'left' | 'right';
 variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
 haptic?: 'light' | 'medium' | 'heavy';
 size?: 'sm' | 'md' | 'lg';
 disabled?: boolean;
 loading?: boolean;
 onPress?: () => void;
 style?: ViewStyle;
}
export function HapticButton({children,  label,  icon,  iconPosition = 'left',  variant = 'primary',  haptic = 'medium',  size = 'md',  disabled = 
false,  loading = 
false,  onPress,  style,
}: HapticButtonProps) {
const colors = useColors();
 
const scaleAnim = useRef(
new Animated.Value(1)).current; const getVariantStyles = () => {
   
switch (variant) { case 'primary':        
return {
         container: { backgroundColor: colors.primary,          
},          text: {
color: colors.background },          icon: {
color: colors.background },        
};
     
case 'secondary':        
return {
         container: { backgroundColor: colors.surface,            borderWidth: 1,            borderColor: colors.border,          
},          text: {
color: colors.textTitle },          icon: {
color: colors.textTitle },        
};
     
case 'ghost':        
return {
         container: { backgroundColor: 'transparent',          
},          text: {
color: colors.primary },          icon: {
color: colors.primary },        
};
     
case 'danger':        
return {
         container: { backgroundColor: colors.error,          
},          text: {
color: colors.background },          icon: {
color: colors.background },        
};
     default:        
return {
        container: {
},          text: {
},          icon: {
},        
};
   
}  
};
 
const getSizeStyles = () => {
   
switch (size) { case 'sm':        
return {
         container: {
paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },          text: {
fontSize: 13 },          iconSize: 16,        
};
     
case 'lg':        
return {
         container: {
paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },          text: {
fontSize: 16 },          iconSize: 22,        
};
     default:        
return {
         container: {
paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },          text: {
fontSize: 14 },          iconSize: 18,        
};
   
}  
};
 
const handlePressIn = () => {
   Animated.spring(scaleAnim, { toValue: 0.96,      friction: 5,      tension: 40,      useNativeDriver: 
true,    
}).start();
 
};
 
const handlePressOut = () => {
   Animated.spring(scaleAnim, { toValue: 1,      friction: 3,      tension: 40,      useNativeDriver: 
true,    
}).start();
 
};
 
const handlePress = () => {
   switch (haptic) {
     
case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
});
       
break;
     
case 'medium':        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {
});
       
break;
     
case 'heavy':        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {
});
       
break;
   
}    onPress?.();
 
};
 
const variantStyles = getVariantStyles();
 
const sizeStyles = getSizeStyles();
 
return (    <Animated.View style={[{
transform: [{
scale: scaleAnim }] 
}, style]
}>      <TouchableOpacity        style={[ styles.button,          variantStyles.container,          sizeStyles.container,          disabled && styles.disabled,        ]
}        onPress={handlePress
}        onPressIn={handlePressIn
}        onPressOut={handlePressOut
}        disabled={disabled || loading
}        activeOpacity={0.9
}        accessibilityRole="button"      >        {icon && iconPosition === 'left' && ( <Ionicons             name={icon as any
}             size={sizeStyles.iconSize
}             color={variantStyles.icon.color
}             style={styles.iconLeft
}          />        )
}                {label && ( <Text style={[styles.label, variantStyles.text, sizeStyles.text]
}>            {loading ? '...' : label
}          </Text>        )
}                {children
}                {icon && iconPosition === 'right' && ( <Ionicons             name={icon as any
}             size={sizeStyles.iconSize
}             color={variantStyles.icon.color
}            style={styles.iconRight
}          />        )
}      </TouchableOpacity>    </Animated.View>  );
}
const styles = StyleSheet.create({
 button: { flexDirection: 'row',    alignItems: 'center',    justifyContent: 'center',    borderRadius: BORDER_RADIUS.md,  
},  disabled: {
   opacity: 0.5, },  label: {
   fontFamily: 'Inter_600SemiBold', letterSpacing: 0.3,  
},  iconLeft: {
   marginRight: SPACING.sm, },  iconRight: {
   marginLeft: SPACING.sm, },
});