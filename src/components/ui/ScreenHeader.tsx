// src/components/ui/ScreenHeader.tsx// Header unificado de tela - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface ScreenHeaderProps {
 title: string; subtitle?: string;
 onBack?: () => void;
 showBack?: boolean;
 rightIcon?: string;
 onRightPress?: () => void;
 rightLabel?: string;
 rightIcon2?: string;
 onRightPress2?: () => void;
}
export default function ScreenHeader({
 title, subtitle,  onBack,  showBack = 
true,  rightIcon,  onRightPress,  rightLabel,  rightIcon2,  onRightPress2,
}: ScreenHeaderProps) {
return ( <View style={styles.container
}>      {showBack ? ( <TouchableOpacity onPress={onBack
} style={styles.backBtn
} accessibilityLabel="Voltar" accessibilityRole="button">          <Ionicons name="arrow-back" size={22
} color={colors.textTitle
} />        </TouchableOpacity>      ) : (        <View style={styles.spacer
} />      )
}      <View style={styles.titleContainer
}>        <Text style={styles.title
} numberOfLines={1
}>{title
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      </View>      <View style={styles.rightActions
}>        {rightIcon2 && onRightPress2 && ( <TouchableOpacity onPress={onRightPress2
} style={styles.iconBtn
} accessibilityLabel="Mais opções" accessibilityRole="button">            <Ionicons name={rightIcon2 as any
} size={20
} color={colors.textMuted
} />          </TouchableOpacity>        )
}        {rightIcon && onRightPress ? ( <TouchableOpacity onPress={onRightPress
} style={styles.iconBtn
}>            <Ionicons name={rightIcon as any
} size={20
} color={colors.primary
} />          </TouchableOpacity>        ) : rightLabel && onRightPress ? (          <TouchableOpacity onPress={onRightPress
} style={styles.actionBtn
}>            <Text style={styles.actionText
}>{rightLabel
}</Text>          </TouchableOpacity>        ) : (          <View style={styles.spacer
} />        )
}      </View>    </View>  );
}// Aliases para backward compatibility
export 
const Header = ScreenHeader;
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
   flexDirection: 'row', justifyContent: 'space-between',    alignItems: 'center',    paddingHorizontal: SPACING.lg,    paddingVertical: SPACING.md,  
},  backBtn: {
   width: 40, height: 40,    borderRadius: 20,    backgroundColor: colors.surface,    justifyContent: 'center',    alignItems: 'center',  
},  spacer: {
width: 40 },  titleContainer: {
   flex: 1, alignItems: 'center',  
},  title: {
   fontFamily: 'Montserrat_700Bold', fontSize: 14,    color: colors.textTitle,    letterSpacing: 1,    textAlign: 'center',  
},  subtitle: {
   fontFamily: 'Inter_400Regular', fontSize: 11,    color: colors.textMuted,    marginTop: 2,  
},  rightActions: {
   flexDirection: 'row', gap: SPACING.xs,  
},  iconBtn: {
   width: 36, height: 36,    borderRadius: 18,    backgroundColor: colors.surface,    justifyContent: 'center',    alignItems: 'center',  
},  actionBtn: {
   paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,  
},  actionText: {
   fontFamily: 'Montserrat_600SemiBold', fontSize: 13,    color: colors.primary,  
},
});