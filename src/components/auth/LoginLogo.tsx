// src/components/auth/LoginLogo.tsx// Logo animado do login - NOVAIX FITNESS
import React, {
useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { useColors } from '../../context/ThemeContext';
interface LoginLogoProps {
 delay?: number;
}
export default function LoginLogo({
delay = 0 }: LoginLogoProps) {
const fadeAnim = useRef(new Animated.Value(0)).current;
 
const logoScale = useMemo(() => 
new Animated.Value(0.8), []);
 useEffect(() => {
   Animated.parallel([ Animated.timing(fadeAnim, {
toValue: 1, duration: 800, delay, useNativeDriver: true }),      Animated.spring(logoScale, {
toValue: 1, friction: 5, tension: 40, delay, useNativeDriver: true }),    ]).start();
 
}, []);
 
return (    <Animated.View style={[styles.container, {
opacity: fadeAnim, transform: [{
scale: logoScale }] 
}]
}>      <View style={styles.mark
}>        <View style={styles.circle
}>          <Text style={styles.letter
}>N</Text>          <View style={styles.arrows
}>            <Ionicons name="arrow-up" size={14
} color={colors.primary
} />            <Ionicons name="arrow-down" size={14
} color={colors.primary
} />          </View>        </View>        <Text style={styles.suffix
}>ix</Text>      </View>    </Animated.View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
alignItems: 'center', marginBottom: 40 },  mark: {
flexDirection: 'row', alignItems: 'center' },  circle: {
   width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center',    borderWidth: 2, borderColor: COLORS.primary,  
},  letter: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.primary },  arrows: {
marginLeft: -2 },  suffix: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 28, color: COLORS.textTitle, marginLeft: 4 },
});