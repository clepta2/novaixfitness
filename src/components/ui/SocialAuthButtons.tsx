// src/components/ui/SocialAuthButtons.tsx// Botoes de autenticacao social (Google/Apple) - NOVAIX FITNESS
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useTheme } from '../../context/ThemeContext'
import { useColors } from '../../context/ThemeContext';
interface SocialAuthButtonsProps {
 onGoogle: () => void; onApple: () => void;
 mode?: 'login' | 'register';
}
export function SocialAuthButtons({
onGoogle, onApple, mode = 'login' }: SocialAuthButtonsProps) {

 
const {
isDark } = useTheme();
 
const actionText = mode === 'login' ? 'Entrar' : 'Cadastrar';
 
return (    <View style={styles.container
}>      <View style={styles.divider
}>        <View style={styles.dividerLine
} />        <Text style={styles.dividerText
}>ou</Text>        <View style={styles.dividerLine
} />      </View>      <TouchableOpacity style={styles.socialBtn
} onPress={onGoogle
}>        <Ionicons name="logo-google" size={20
} color={colors.googleBlue
} />        <Text style={styles.socialBtnText
}>{actionText
} com Google</Text>      </TouchableOpacity>      <TouchableOpacity style={styles.socialBtn
} onPress={onApple
}>        <Ionicons name="logo-apple" size={20
} color={isDark ? '#FFF' : '#000'
} />        <Text style={styles.socialBtnText
}>{actionText
} com Apple</Text>      </TouchableOpacity>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 container: {
gap: SPACING.sm },  divider: {
flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.lg },  dividerLine: {
flex: 1, height: 1, backgroundColor: COLORS.border },  dividerText: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, marginHorizontal: SPACING.md },  socialBtn: {
   flexDirection: 'row', alignItems: 'center',    justifyContent: 'center',    gap: SPACING.sm,    backgroundColor: COLORS.surface + 'CC',    borderRadius: BORDER_RADIUS.md,    paddingVertical: SPACING.md,    borderWidth: 1,    borderColor: COLORS.border,  
},  socialBtnText: {
fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
});