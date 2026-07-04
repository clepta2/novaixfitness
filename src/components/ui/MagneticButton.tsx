// src/components/ui/MagneticButton.tsx// Botao com efeito magnetico - Tendencia 2025-2026
import React, {
useRef } from 'react';
import {   View, StyleSheet,   Animated,   PanResponder,  ViewStyle } from 'react-native'
import * as Haptics  from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface MagneticButtonProps {
 icon: string; size?: number;
 color?: string;
 onPress?: () => void;
 magneticRange?: number;
 style?: ViewStyle;
}
export function MagneticButton({icon,  size = 56,  color = COLORS.primary,  onPress,  magneticRange = 30,  style,
}: MagneticButtonProps) {
const colors = useColors();
 
const scaleAnim = useRef(
new Animated.Value(1)).current; const translateX = useRef(
new Animated.Value(0)).current;
 
const translateY = useRef(
new Animated.Value(0)).current;
 
const panResponder = useRef(    PanResponder.create({
     onStartShouldSetPanResponder: () => true,      onMoveShouldSetPanResponder: () => 
true,      onPanResponderGrant: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
});
       Animated.spring(scaleAnim, {
         toValue: 1.1, friction: 5,          useNativeDriver: 
true,        
}).start();
     
},      onPanResponderMove: (_, gestureState) => {
       
const distance = Math.sqrt( gestureState.dx ** 2 + gestureState.dy ** 2        );
               
if (distance < magneticRange) {
         Animated.spring(translateX, { toValue: gestureState.dx * 0.3,            friction: 5,            useNativeDriver: 
true,          
}).start();
                   Animated.spring(translateY, {
           toValue: gestureState.dy * 0.3, friction: 5,            useNativeDriver: 
true,          
}).start();
       
}      
},      onPanResponderRelease: () => {
       Animated.spring(translateX, { toValue: 0,          friction: 5,          useNativeDriver: 
true,        
}).start();
               Animated.spring(translateY, {
         toValue: 0, friction: 5,          useNativeDriver: 
true,        
}).start();
               Animated.spring(scaleAnim, {
         toValue: 1, friction: 5,          useNativeDriver: 
true,        
}).start();
               onPress?.();
     
},    
})  ).current;
 
return (    <Animated.View      style={[ styles.button,        {
         width: size, height: size,          borderRadius: size / 2,          backgroundColor: color,          transform: [            {
translateX },            {
translateY },            {
scale: scaleAnim },          ],        
},        style,      ]
}      {...panResponder.panHandlers
}    >      <Ionicons        name={icon as any
}        size={size * 0.4
}        color={colors.background
}      />    </Animated.View>  );
}
const styles = StyleSheet.create({
 button: { justifyContent: 'center',    alignItems: 'center',    shadowColor: '#000',    shadowOffset: {
width: 0, height: 4 },    shadowOpacity: 0.3,    shadowRadius: 8,    elevation: 8,  
},
});