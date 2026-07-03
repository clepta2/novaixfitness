// src/components/ui/MorphingIcon.tsx// Icone que morpha entre estados - Tendencia 2025-2026
import React, {
useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics  from 'expo-haptics';
import { COLORS } from '../../constants/colors'
import { useColors } from '../../context/ThemeContext';
interface MorphingIconProps {
 activeIcon: string; inactiveIcon: string;
 isActive: boolean;
 size?: number;
 activeColor?: string;
 inactiveColor?: string;
 animated?: boolean;
 style?: ViewStyle;
}
export function MorphingIcon({activeIcon,  inactiveIcon,  isActive,  size = 24,  activeColor,  inactiveColor = '#5A6677',  animated = 
true,  style,
}: MorphingIconProps) {
const colors = useColors();
 
const scaleAnim = useRef(
new Animated.Value(isActive ? 1 : 0)).current; const rotateAnim = useRef(
new Animated.Value(0)).current;
 useEffect(() => {
   
if (!animated) return; Animated.parallel([      Animated.spring(scaleAnim, {
       toValue: isActive ? 1 : 0, friction: 5,        tension: 40,        useNativeDriver: 
true,      
}),      Animated.sequence([        Animated.timing(rotateAnim, {
         toValue: isActive ? 1 : 0, duration: 200,          useNativeDriver: 
true,        
}),        Animated.spring(rotateAnim, {
         toValue: 0, friction: 3,          useNativeDriver: 
true,        
}),      ]),    ]).start();
   
if (isActive) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
});
   
}  
}, [isActive, animated]);
 
const rotation = rotateAnim.interpolate({
   inputRange: [0, 1], outputRange: ['0deg', '360deg'],  
});
 
const currentIcon = isActive ? activeIcon : inactiveIcon;
 
const currentColor = isActive ? (activeColor || colors.primary) : inactiveColor;
 
return (    <Animated.View      style={[ styles.container,        {
         transform: [ {
scale: scaleAnim.interpolate({
inputRange: [0, 1], outputRange: [0.8, 1] }) 
},            {
rotate: rotation },          ],        
},        style,      ]
}    >      <Ionicons name={currentIcon as any
} size={size
} color={currentColor
} />    </Animated.View>  );
}
const styles = StyleSheet.create({
 container: { justifyContent: 'center',    alignItems: 'center',  
},
});