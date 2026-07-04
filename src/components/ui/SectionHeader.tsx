// src/components/ui/SectionHeader.tsx
// Titulo de secao padronizado com opcoes
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface SectionHeaderProps {
 /** Titulo da secao */ title: string;
 /** Subtitulo opcional */  subtitle?: string;
 /** Acao opcional a direita */  action?: string;
 /** Callback da acao */  onAction?: () => void;
 /** Icone da acao */  actionIcon?: string;
 /** Tamanho do titulo */  size?: 'sm' | 'md' | 'lg';
}/** * Titulo de secao padronizado com opcoes de acao. * * @example * ```tsx * <SectionHeader title="MEUS TREINOS" subtitle="12 treinos" /> * ``` * * @example * ```tsx * <SectionHeader *   title="CONQUISTAS" *   action="Ver todas" *   onAction={() => router.push('/achievements')
} * /> * ``` */
export function SectionHeader({
title, subtitle, action, onAction, actionIcon = 'chevron-forward', size = 'md' }: SectionHeaderProps) {

return ( <View style={styles.container
}>      <View style={styles.textGroup
}>        <Text style={[styles.title, styles[`title_${size
}`]]
}>{title
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      </View>      {action && onAction && ( <TouchableOpacity style={styles.action
} onPress={onAction
} accessibilityLabel={action
} accessibilityRole="button">          <Text style={styles.actionText
}>{action
}</Text>          <Ionicons name={actionIcon as any
} size={14
} color={colors.primary
} />        </TouchableOpacity>      )
}    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 container: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },  textGroup: {
flex: 1 },  title: {
fontFamily: 'Montserrat_700Bold', color: COLORS.textTitle, letterSpacing: 0.5 },  title_sm: {
fontSize: 12 },  title_md: {
fontSize: 14 },  title_lg: {
fontSize: 16 },  subtitle: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },  action: {
flexDirection: 'row', alignItems: 'center', gap: 4 },  actionText: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.primary },
});