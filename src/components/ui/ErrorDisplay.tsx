// src/components/ui/ErrorDisplay.tsx
// COMPONENTE: ErrorDisplay - Error state padronizado com retry
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface ErrorDisplayProps {
 /** Mensagem de erro para o usuario */ message?: string;
 /** Callback ao clicar em tentar novamente */  onRetry?: () => void;
 /** Texto do botao de retry (default: "TENTAR NOVAMENTE") */  retryText?: string;
 /** Icone do erro (default: alert-circle) */  icon?: string;
}/** * Error state padronizado com icone, mensagem e botao retry. * * @example * ```tsx * 
if (error) 
return <ErrorDisplay message={error
} onRetry={loadData
} />;
* ``` * * @example * ```tsx * // Sem retry (apenas mensagem) * <ErrorDisplay message="Algo deu errado" onRetry={
undefined
} /> * ``` */
export function ErrorDisplay({
message = 'Algo deu errado', onRetry, retryText = 'TENTAR NOVAMENTE', icon = 'alert-circle-outline' }: ErrorDisplayProps) {

return ( <View style={styles.container
}>      <Ionicons name={icon as any
} size={48
} color={colors.error
} />      <Text style={styles.message
}>{message
}</Text>      {onRetry && ( <TouchableOpacity style={styles.retryBtn
} onPress={onRetry
} activeOpacity={0.8
}>          <Ionicons name="refresh" size={16
} color={colors.background
} />          <Text style={styles.retryText
}>{retryText
}</Text>        </TouchableOpacity>      )
}    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 container: {
flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.xl },  message: {
fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },  retryBtn: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.sm },  retryText: {
fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
});