// src/components/ui/AnimatedHeader.tsx// Header animado reutilizavel - NOVAIX FITNESS
import { useEffect, useMemo , useRef} from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/spacing';
import { layout, typography } from '../../styles'
import { useColors } from '../../context/ThemeContext';
interface AnimatedHeaderProps {
 title: string; subtitle?: string;
 rightContent?: React.ReactNode;
 showOffline?: boolean;
 offlineText?: string;
 delay?: number;
}
export function AnimatedHeader({title,  subtitle,  rightContent,  showOffline,  offlineText,  delay = 0,
}: AnimatedHeaderProps) {
const colors = useColors();
 
const fadeAnim = useRef(Animated.Value(0)).current;
 
const slideAnim = useMemo(() => 
new Animated.Value(20), []);
 useEffect(() => {
   Animated.parallel([ Animated.timing(fadeAnim, {
toValue: 1, duration: 400, delay, useNativeDriver: true }),      Animated.spring(slideAnim, {
toValue: 0, friction: 8, tension: 55, delay, useNativeDriver: true }),    ]).start();
 
}, []);
 
return (    <Animated.View style={[layout.header, {
opacity: fadeAnim, transform: [{
translateY: slideAnim }] 
}]
}>      <View style={styles.content
}>        <Text style={styles.title
}>{title
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}        {showOffline && ( <View style={styles.offlineBadge
}>            <Text style={styles.offlineText
}>{offlineText
}</Text>          </View>        )
}      </View>      {rightContent && <View>{rightContent
}</View>
}    </Animated.View>  );
}
const styles = StyleSheet.create({
 content: {
flex: 1 },  title: {
...typography.h2, color: colors.textTitle },  subtitle: {
...typography.bodyMuted, marginTop: SPACING.xs },  offlineBadge: {
flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs },  offlineText: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.attention },
});