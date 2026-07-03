// src/components/ui/CountdownTimer.tsx// Timer de contagem regressiva reutilizavel - NOVAIX FITNESS
import React, {
useState, useEffect, useRef } from 'react';
import { Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors';
import { useColors } from '../../context/ThemeContext';
interface CountdownTimerProps {
 duration: number; onTick?: (remaining: number) => void;
 onDone?: () => void;
 paused?: boolean;
 size?: number;
}
export default function CountdownTimer({
duration, onTick, onDone, paused = false, size = 64 }: CountdownTimerProps) {
const [remaining, setRemaining] = useState(duration); const intervalRef = useRef<ReturnType<
typeof setInterval> | 
null>(
null);
 useEffect(() => {
   
if (paused) { if (intervalRef.current) clearInterval(intervalRef.current);
     return;
   
}    intervalRef.current = setInterval(() => {
     setRemaining(prev => { const next = prev - 1;
       onTick?.(next);
       
if (next <= 0) {
         clearInterval(intervalRef.current!); onDone?.();
         
return 0;
       
}        
return next;
     
});
   
}, 1000);
   
return () => {

if (intervalRef.current) clearInterval(intervalRef.current); };
 
}, [paused, duration]);
 
const mins = Math.floor(remaining / 60);
 
const secs = remaining % 60;
 
return (    <Text style={[styles.time, {
fontSize: size }]
}>      {String(mins).padStart(2, '0')
}:{String(secs).padStart(2, '0')
}    </Text>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
time: {
   fontFamily: 'Montserrat_700Bold', color: colors.textTitle,    fontVariant: ['tabular-nums'],  
},
});