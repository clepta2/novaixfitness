// src/components/auth/LanguageOption.tsx// Opcao de idioma selecionavel - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SHADOWS } from '../../constants/shadows'
import { useColors } from '../../context/ThemeContext';
interface Language {
 code: string; flag: string;
 label: string;
 native: string;
}
interface LanguageOptionProps {
 lang: Language; isActive: boolean;
 onPress: () => void;
}
export default function LanguageOption({
lang, isActive, onPress }: LanguageOptionProps) {
return ( <TouchableOpacity      style={[styles.option, isActive && styles.active]
}      onPress={onPress
}      activeOpacity={0.8
}    >      <Text style={styles.flag
}>{lang.flag
}</Text>      <View style={styles.info
}>        <Text style={[styles.label, isActive && styles.labelActive]
}>{lang.label
}</Text>        <Text style={styles.native
}>{lang.native
}</Text>      </View>      {isActive && ( <View style={styles.check
}>          <Ionicons name="checkmark" size={16
} color={colors.background
} />        </View>      )
}    </TouchableOpacity>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
option: {
   flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md,    backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border,  
},  active: {
borderColor: colors.primary, backgroundColor: colors.primary + '10', ...SHADOWS.sm },  flag: {
fontSize: 32 },  info: {
flex: 1 },  label: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: colors.textTitle },  labelActive: {
color: colors.primary },  native: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },  check: {
width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
});