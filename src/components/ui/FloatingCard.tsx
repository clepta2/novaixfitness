// src/components/ui/FloatingCard.tsx// Card flutuante com glow effect - Rebranding 2026
import React, {
useRef } from 'react';
import {   View, StyleSheet,   Animated,   TouchableOpacity,  ViewStyle } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface FloatingCardProps {
 children: React.ReactNode; elevation?: number;
 glowColor?: string;
 onPress?: () => void;
 style?: ViewStyle;
}
export function FloatingCard({children,  elevation = 16,  glowColor = colors.primary,  onPress,  style,
}: FloatingCardProps) {
const colors = useColors();
 
const scaleAnim = useRef(
new Animated.Value(1)).current; const handlePressIn = () => {
   Animated.spring(scaleAnim, { toValue: 0.98,      friction: 5,      tension: 40,      useNativeDriver: 
true,    
}).start();
 
};
 
const handlePressOut = () => {
   Animated.spring(scaleAnim, { toValue: 1,      friction: 3,      tension: 40,      useNativeDriver: 
true,    
}).start();
 
};
 
const animatedStyle = {
   transform: [{
scale: scaleAnim }],    shadowColor: glowColor,    shadowOffset: {
width: 0, height: elevation / 4 },    shadowOpacity: 0.2,    shadowRadius: elevation / 2,    elevation,  
};
 
if (onPress) {
   
return ( <TouchableOpacity        activeOpacity={0.95
}        onPress={onPress
}        onPressIn={handlePressIn
}        onPressOut={handlePressOut
}      >        <Animated.View style={[styles.card, animatedStyle, style]
}>          {children
}        </Animated.View>      </TouchableOpacity>    );
}  
return (    <Animated.View style={[styles.card, animatedStyle, style]
}>      {children
}    </Animated.View>  );
}
const styles = StyleSheet.create({
 card: { backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.xl,    padding: SPACING.lg,    borderWidth: 1,    borderColor: COLORS.border,  
},
});