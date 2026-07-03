// src/components/ui/Chip.tsx// Chip/Tag reutilizável
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface ChipProps {
 label: string; icon?: string;
 selected?: boolean;
 onPress?: () => void;
 variant?: 'default' | 'outlined' | 'filled';
 size?: 'sm' | 'md';
 style?: ViewStyle;
}
export function Chip({label,  icon,  selected = 
false,  onPress,  variant = 'default',  size = 'md',  style,
}: ChipProps) {
const colors = useColors();
 
const sizeStyles = { sm: {
paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, fontSize: 11 },    md: {
paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: 13 },  
};
 
const s = sizeStyles[size];
 
const getContainerStyle = (): ViewStyle => {
   
if (selected) { return {
       backgroundColor: colors.primary, borderColor: colors.primary,      
};
   
}    
switch (variant) {
     
case 'filled': return {
         backgroundColor: colors.surfaceOverlay, borderColor: colors.surfaceOverlay,        
};
     
case 'outlined':        
return {
         backgroundColor: 'transparent', borderColor: colors.border,        
};
     default:        
return {
         backgroundColor: colors.surface, borderColor: colors.border,        
};
   
}  
};
 
const textColor = selected ? colors.background : colors.textTitle;
 
const content = (    <View style={[styles.chip, getContainerStyle(), {
paddingHorizontal: s.paddingHorizontal, paddingVertical: s.paddingVertical }, style]
}>      {icon && <Ionicons name={icon as any
} size={14
} color={textColor
} style={styles.icon
} />
}      <Text style={[styles.label, {
fontSize: s.fontSize, color: textColor }]
}>{label
}</Text>    </View>  );
 
if (onPress) {
   
return ( <TouchableOpacity activeOpacity={0.7
} onPress={onPress
}>        {content
}      </TouchableOpacity>    );
}  
return content;
}
const styles = StyleSheet.create({
 chip: { flexDirection: 'row',    alignItems: 'center',    borderRadius: BORDER_RADIUS.full,    borderWidth: 1,  
},  icon: {
   marginRight: SPACING.xs, },  label: {
   fontFamily: 'Inter_500Medium', },
});