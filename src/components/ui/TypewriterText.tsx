// src/components/ui/TypewriterText.tsx// Texto com efeito typewriter - Tendencia 2025-2026
import React, {
useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { COLORS } from '../../constants/colors';
import { useColors } from '../../context/ThemeContext';
interface TypewriterTextProps {
 text: string; speed?: number;
 delay?: number;
 style?: ViewStyle;
 textStyle?: any;
 onComplete?: () => void;
}
export function TypewriterText({text,  speed = 50,  delay = 0,  style,  textStyle,  onComplete,
}: TypewriterTextProps) {
const colors = useColors();
 
const [displayText, setDisplayText] = useState(''); const [currentIndex, setCurrentIndex] = useState(0);
 
const [isStarted, setIsStarted] = useState(
false);
 useEffect(() => {
   
const delayTimer = setTimeout(() => { setIsStarted(
true);
   
}, delay);
   
return () => clearTimeout(delayTimer);
 
}, [delay]);
 useEffect(() => {
   
if (!isStarted) return; if (currentIndex < text.length) {
     
const timer = setTimeout(() => { setDisplayText(text.slice(0, currentIndex + 1));
       setCurrentIndex(currentIndex + 1);
     
}, speed);
     
return () => clearTimeout(timer);
   
} 
else {
     onComplete?.(); }  
}, [currentIndex, text, speed, isStarted, onComplete]);
 
return (    <View style={style
}>      <Text style={[styles.text, textStyle]
}>        {displayText
}        {currentIndex < text.length && ( <Text style={styles.cursor
}>|</Text>        )
}      </Text>    </View>  );
}
const styles = StyleSheet.create({
 text: { color: COLORS.textTitle,  
},  cursor: {
   color: COLORS.primary, fontWeight: 'bold',  
},
});