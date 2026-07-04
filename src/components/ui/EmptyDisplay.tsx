// src/components/ui/EmptyDisplay.tsx// ============================================================// COMPONENTE: EmptyDisplay// TIPO: Empty state padronizado com CTA opcional// USO: Substitui Ionicons + Text + Button inline em 15+ telas// REGRAS: Usar quando lista/resultado esta vazio// ============================================================
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { useColors  } from '../../context/ThemeContext';
interface EmptyDisplayProps {
 /** Icone do estado vazio */  icon?: string;
 /** Titulo principal */  title?: string;
 /** Descricao opcional */  message?: string;
 /** Texto do botao CTA opcional */  ctaText?: string;
 /** Callback do botao CTA */  onCta?: () => void;
}/** * Empty state padronizado com icone, titulo e CTA opcional. * * @example * ```tsx * <EmptyDisplay icon="barbell-outline" title="Nenhum treino" message="Crie seu primeiro treino" /> * ``` * * @example * ```tsx * // Com CTA * <EmptyDisplay *   icon="camera-outline" *   title="Nenhuma foto" *   message="Adicione fotos de progresso" *   ctaText="ADICIONAR FOTO" *   onCta={() => openPicker()
} * /> * ``` */
export 
function EmptyDisplay({
icon = 'folder-open-outline', title = 'Nenhum item', message, ctaText, onCta 
}: EmptyDisplayProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      <View style={styles.iconWrap
}>        <Ionicons name={icon as any
} size={48
} color={colors.textMuted
} />      </View>      <Text style={styles.title
}>{title
}</Text>      {message && <Text style={styles.message
}>{message
}</Text>
}      {ctaText && onCta && (        <TouchableOpacity style={styles.ctaBtn
} onPress={onCta
} activeOpacity={0.8
}>          <Text style={styles.ctaText
}>{ctaText
}</Text>        </TouchableOpacity>      )
}    </View>  );
}
const styles = StyleSheet.create({
 container: {
alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md 
},  iconWrap: {
width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm 
},  title: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, textAlign: 'center' 
},  message: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center', maxWidth: 280 
},  ctaBtn: {
backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.sm 
},  ctaText: {
fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 
},
});