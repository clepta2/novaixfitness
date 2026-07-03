// src/components/ui/ChallengeCard.tsx// Card de desafio diario - NOVAIX FITNESS
import { View, Text, TouchableOpacity, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing';
import { SHADOWS  } from '../../constants/shadows'
import { useColors  } from '../../context/ThemeContext';
interface ChallengeCardProps {
 icon: string;
 text: string;
 xp: number;
 isCompleted: boolean;
 onPress: () => void;
}
export 
function ChallengeCard({
icon, text, xp, isCompleted, onPress 
}: ChallengeCardProps) {
 
const colors = useColors();
return (    <TouchableOpacity      style={[styles.card, isCompleted && styles.cardDone]
}      onPress={onPress
}      disabled={isCompleted
}    >      <View style={styles.left
}>        <View style={[styles.iconWrap, {
backgroundColor: (isCompleted ? colors.primary : colors.textMuted) + '15' 
}]
}>          <Ionicons name={icon as any
} size={22
} color={isCompleted ? colors.primary : colors.textMuted
} />        </View>        <View style={styles.info
}>          <Text style={[styles.text, isCompleted && styles.textDone]
}>{text
}</Text>          <Text style={styles.xp
}>+{xp
} XP</Text>        </View>      </View>      <Ionicons name={isCompleted ? 'checkmark-circle' : 'arrow-forward'
} size={isCompleted ? 24 : 20
} color={isCompleted ? colors.primary : colors.textMuted
} />    </TouchableOpacity>  );
}
const styles = StyleSheet.create({
 card: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: colors.border, ...SHADOWS.sm 
},  cardDone: {
opacity: 0.6, borderColor: colors.primary + '30' 
},  left: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 
},  iconWrap: {
width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' 
},  info: {
flex: 1 
},  text: {
fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.textTitle 
},  textDone: {
textDecorationLine: 'line-through', color: colors.textMuted 
},  xp: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary, marginTop: 2 
},
});