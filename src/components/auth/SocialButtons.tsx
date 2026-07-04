// src/components/auth/SocialButtons.tsx// Botoes de login social (Google/Apple) - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows'
import { useColors } from '../../context/ThemeContext';
interface SocialButtonsProps {
 onGoogle: () => void; onApple: () => void;
 isDark?: boolean;
 label?: string;
}
export default function SocialButtons({
onGoogle, onApple, isDark = false, label = 'ou continue com' 
}: SocialButtonsProps) {
return ( <>      <View style={styles.divider
}>        <View style={styles.dividerLine
} />        <Text style={styles.dividerText
}>{label
}</Text>        <View style={styles.dividerLine
} />      </View>      <TouchableOpacity style={styles.btn
} onPress={onGoogle
}>        <Ionicons name="logo-google" size={20
} color={colors.googleBlue
} />        <Text style={styles.btnText
}>Entrar com Google</Text>      </TouchableOpacity>      <TouchableOpacity style={styles.btn
} onPress={onApple
}>        <Ionicons name="logo-apple" size={20
} color={isDark ? "#FFF" : "#000"
} />        <Text style={styles.btnText
}>Entrar com Apple</Text>      </TouchableOpacity>    </>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
divider: {
flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.xl },  dividerLine: {
flex: 1, height: 1, backgroundColor: COLORS.border },  dividerText: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginHorizontal: SPACING.md },  btn: {
   flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface + 'CC', borderRadius: BORDER_RADIUS.md,    paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,  
},  btnText: {
fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
});