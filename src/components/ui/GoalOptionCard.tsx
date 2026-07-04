// src/components/ui/GoalOptionCard.tsx// Card de opcao de objetivo (onboarding) - NOVAIX FITNESS
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
interface GoalOptionCardProps {
 icon: string;
 label: string;
 description: string;
 color: string;
 isSelected: boolean;
 onPress: () => void;
}
export 
function GoalOptionCard({
icon, label, description, color, isSelected, onPress 
}: GoalOptionCardProps) {
 
const colors = useColors();
return (    <TouchableOpacity      style={[styles.card, isSelected && {
borderColor: color, shadowColor: color 
}]
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
color: colors.primary 
}]
}>{label
}</Text>        <Text style={styles.desc
}>{description
}</Text>      </View>      <View style={[styles.radio, isSelected && styles.radioActive]
}>        {isSelected && <View style={styles.radioDot
} />
}      </View>    </TouchableOpacity>  );
}
const styles = StyleSheet.create({
 card: {
backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 2, borderColor: COLORS.border, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.sm 
},  iconWrap: {
width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 
},  info: {
flex: 1 
},  label: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle, marginBottom: 2 
},  desc: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, lineHeight: 18 
},  radio: {
width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', flexShrink: 0 
},  radioActive: {
borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' 
},  radioDot: {
width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary 
},
});