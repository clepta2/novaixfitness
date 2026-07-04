// src/components/ui/PageHeader.tsx// Header de página reutilizável
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface PageHeaderProps {
 title: string; subtitle?: string;
 leftIcon?: string;
 rightIcon?: string;
 onLeftPress?: () => void;
 onRightPress?: () => void;
 variant?: 'default' | 'centered' | 'minimal';
 style?: ViewStyle;
}
export function PageHeader({title,  subtitle,  leftIcon = 'chevron-back',  rightIcon,  onLeftPress,  onRightPress,  variant = 'default',  style,
}: PageHeaderProps) {
const colors = useColors();
 
if (variant === 'minimal') { return (      <View style={[styles.minimal, style]
}>        <Text style={styles.title
}>{title
}</Text>      </View>    );
}  
if (variant === 'centered') {
   
return ( <View style={[styles.centered, style]
}>        {onLeftPress && ( <TouchableOpacity style={styles.iconBtn
} onPress={onLeftPress
}>            <Ionicons name={leftIcon as any
} size={24
} color={colors.textTitle
} />          </TouchableOpacity>        )
}        <View style={styles.centerContent
}>          <Text style={styles.title
}>{title
}</Text>          {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}        </View>        {onRightPress && rightIcon && ( <TouchableOpacity style={styles.iconBtn
} onPress={onRightPress
}>            <Ionicons name={rightIcon as any
} size={24
} color={colors.textTitle
} />          </TouchableOpacity>        )
}      </View>    );
}  
return (    <View style={[styles.default, style]
}>      {onLeftPress && ( <TouchableOpacity style={styles.iconBtn
} onPress={onLeftPress
}>          <Ionicons name={leftIcon as any
} size={24
} color={colors.textTitle
} />        </TouchableOpacity>      )
}      <View style={styles.content
}>        <Text style={styles.title
}>{title
}</Text>        {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      </View>      {onRightPress && rightIcon && ( <TouchableOpacity style={styles.iconBtn
} onPress={onRightPress
}>          <Ionicons name={rightIcon as any
} size={24
} color={colors.textTitle
} />        </TouchableOpacity>      )
}    </View>  );
}
const styles = StyleSheet.create({
 default: { flexDirection: 'row',    alignItems: 'center',    paddingHorizontal: SPACING.lg,    paddingVertical: SPACING.md,    gap: SPACING.md,  
},  centered: {
   flexDirection: 'row', alignItems: 'center',    paddingHorizontal: SPACING.lg,    paddingVertical: SPACING.md,    justifyContent: 'space-between',  
},  minimal: {
   paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,  
},  content: {
   flex: 1, },  centerContent: {
   alignItems: 'center', },  title: {
   fontFamily: 'Montserrat_700Bold', fontSize: 18,    color: COLORS.textTitle,  
},  subtitle: {
   fontFamily: 'Inter_400Regular', fontSize: 12,    color: COLORS.textDescription,    marginTop: 2,  
},  iconBtn: {
   width: 40, height: 40,    borderRadius: 20,    backgroundColor: COLORS.surface,    justifyContent: 'center',    alignItems: 'center',    borderWidth: 1,    borderColor: COLORS.border,  
},
});