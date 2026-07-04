// src/components/ui/OptionCard.tsx// Card de selecao com icone e radio - NOVAIX FITNESS
import { TouchableOpacity, View, Text, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
interface OptionCardProps {
 icon: string;
 label: string;
 description?: string;
 isSelected?: boolean;
 color?: string;
 onPress: () => void;
 showRadio?: boolean;
}
export 
function OptionCard({
 icon,  label,  description,  isSelected,  color = COLORS.primary,  onPress,  showRadio = 
true,
}: OptionCardProps) {
 
const colors = useColors();
return (    <TouchableOpacity      style={[        styles.card,        isSelected && styles.cardActive,        isSelected && {
borderColor: color, shadowColor: color 
},      ]
}      onPress={onPress
}      activeOpacity={0.85
}    >      <View style={[styles.iconWrap, {
backgroundColor: color + (isSelected ? '25' : '12') 
}]
}>        <Ionicons name={icon as any
} size={28
} color={color
} />      </View>      <View style={styles.info
}>        <Text style={[styles.label, isSelected && {
color 
}]
}>{label
}</Text>        {description && <Text style={styles.desc
}>{description
}</Text>
}      </View>      {showRadio && (        <View style={[styles.radio, isSelected && {
borderColor: color, backgroundColor: color + '15' 
}]
}>          {isSelected && <View style={[styles.radioDot, {
backgroundColor: color 
}]
} />
}        </View>      )
}    </TouchableOpacity>  );
}
const styles = StyleSheet.create({
 card: {
   backgroundColor: COLORS.surface,    borderRadius: BORDER_RADIUS.lg,    borderWidth: 2,    borderColor: COLORS.border,    padding: SPACING.lg,    flexDirection: 'row',    alignItems: 'center',    gap: SPACING.lg,    ...SHADOWS.sm,  
},  cardActive: {
   backgroundColor: COLORS.primary + '06',    ...SHADOWS.md,  
},  iconWrap: {
   width: 54,    height: 54,    borderRadius: 16,    justifyContent: 'center',    alignItems: 'center',    flexShrink: 0,  
},  info: {
flex: 1 
},  label: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: 2 
},  desc: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, lineHeight: 18 
},  radio: {
   width: 22,    height: 22,    borderRadius: 11,    borderWidth: 2,    borderColor: COLORS.border,    justifyContent: 'center',    alignItems: 'center',    flexShrink: 0,  
},  radioDot: {
width: 10, height: 10, borderRadius: 5 
},
});