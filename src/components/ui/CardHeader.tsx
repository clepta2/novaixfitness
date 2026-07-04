// src/components/ui/CardHeader.tsx// Cabecalho de card reutilizavel - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface CardHeaderProps {
 title: string; subtitle?: string;
 actionLabel?: string;
 onAction?: () => void;
 rightIcon?: string;
 onRightPress?: () => void;
}
export default function CardHeader({
title, subtitle, actionLabel, onAction, rightIcon, onRightPress }: CardHeaderProps) {
return ( <View style={styles.row
}>      <View style={styles.left
}>        <Text style={styles.title
}>{title
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      </View>      <View style={styles.right
}>        {actionLabel && onAction && ( <TouchableOpacity onPress={onAction
} style={styles.action
}>            <Text style={styles.actionText
}>{actionLabel
}</Text>          </TouchableOpacity>        )
}        {rightIcon && onRightPress && ( <TouchableOpacity onPress={onRightPress
}>            <Ionicons name={rightIcon as any
} size={20
} color={colors.primary
} />          </TouchableOpacity>        )
}      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
row: {
   flexDirection: 'row', justifyContent: 'space-between',    alignItems: 'center',    marginBottom: SPACING.md,  
},  left: {
   flex: 1, },  title: {
   fontFamily: 'Montserrat_700Bold', fontSize: 14,    color: COLORS.textTitle,    letterSpacing: 1,  
},  subtitle: {
   fontFamily: 'Inter_400Regular', fontSize: 12,    color: COLORS.textMuted,    marginTop: 2,  
},  right: {
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.sm,  
},  action: {
   flexDirection: 'row', alignItems: 'center',    gap: 2,  
},  actionText: {
   fontFamily: 'Inter_500Medium', fontSize: 12,    color: COLORS.primary,  
},
});