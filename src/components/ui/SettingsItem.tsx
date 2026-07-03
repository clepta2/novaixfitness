// src/components/ui/SettingsItem.tsx// Item de configuracao reutilizavel - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface SettingsItemProps {
 icon: string; iconColor?: string;
 label: string;
 subtitle?: string;
 onPress?: () => void;
 rightElement?: React.ReactNode;
 showChevron?: boolean;
}
export default function SettingsItem({
icon, iconColor = colors.textMuted, label, subtitle, onPress, rightElement, showChevron = true }: SettingsItemProps) {
const content = ( <View style={styles.row
}>      <View style={[styles.iconWrap, {
backgroundColor: iconColor + '15' }]
}>        <Ionicons name={icon as any
} size={20
} color={iconColor
} />      </View>      <View style={styles.info
}>        <Text style={styles.label
}>{label
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      </View>      {rightElement || (showChevron && <Ionicons name="chevron-forward" size={18
} color={colors.textMuted
} />)
}    </View>  );
 
if (onPress) {
   return <TouchableOpacity onPress={onPress
} activeOpacity={0.7
}>{content
}</TouchableOpacity>;
 
}  
return content;
}
const colors = useColors();
const styles = StyleSheet.create({
 
row: {
   flexDirection: 'row', alignItems: 'center',    gap: SPACING.md,    paddingVertical: SPACING.md,    paddingHorizontal: SPACING.md,    backgroundColor: colors.surface,    borderRadius: BORDER_RADIUS.md,    marginBottom: SPACING.xs,  
},  iconWrap: {
   width: 36, height: 36,    borderRadius: 10,    justifyContent: 'center',    alignItems: 'center',  
},  info: {
   flex: 1, },  label: {
   fontFamily: 'Montserrat_600SemiBold', fontSize: 14,    color: colors.textTitle,  
},  subtitle: {
   fontFamily: 'Inter_400Regular', fontSize: 12,    color: colors.textMuted,    marginTop: 2,  
},
});