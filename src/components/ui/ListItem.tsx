// src/components/ui/ListItem.tsx// Item de lista reutilizável
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface ListItemProps {
 title: string; subtitle?: string;
 icon?: string;
 iconColor?: string;
 rightElement?: React.ReactNode;
 onPress?: () => void;
 variant?: 'default' | 'compact' | 'detailed';
 style?: ViewStyle;
}
export function ListItem({title,  subtitle,  icon,  iconColor = colors.primary,  rightElement,  onPress,  variant = 'default',  style,
}: ListItemProps) {
const colors = useColors();
 
const content = ( <View style={[styles.container, variant === 'compact' && styles.compact, style]
}>      {icon && ( <View style={[styles.iconWrap, {
backgroundColor: iconColor + '15' }]
}>          <Ionicons name={icon as any
} size={20
} color={iconColor
} />        </View>      )
}      <View style={styles.content
}>        <Text style={styles.title
} numberOfLines={variant === 'compact' ? 1 : 2
}>          {title
}        </Text>        {subtitle && ( <Text style={styles.subtitle
} numberOfLines={variant === 'detailed' ? 3 : 1
}>            {subtitle
}          </Text>        )
}      </View>      {rightElement || ( <Ionicons name="chevron-forward" size={16
} color={colors.textMuted
} />      )
}    </View>  );
 
if (onPress) {
   
return ( <TouchableOpacity activeOpacity={0.7
} onPress={onPress
}>        {content
}      </TouchableOpacity>    );
}  
return content;
}
const styles = StyleSheet.create({
 container: { flexDirection: 'row',    alignItems: 'center',    padding: SPACING.md,    backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.md,    borderWidth: 1,    borderColor: COLORS.border,    gap: SPACING.md,  
},  compact: {
   padding: SPACING.sm, gap: SPACING.sm,  
},  iconWrap: {
   width: 40, height: 40,    borderRadius: 20,    justifyContent: 'center',    alignItems: 'center',  
},  content: {
   flex: 1, },  title: {
   fontFamily: 'Inter_500Medium', fontSize: 14,    color: COLORS.textTitle,  
},  subtitle: {
   fontFamily: 'Inter_400Regular', fontSize: 12,    color: COLORS.textDescription,    marginTop: 2,  
},
});