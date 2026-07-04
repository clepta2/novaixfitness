// src/components/workout/ShareWorkoutCard.tsx// Card de compartilhamento de treino - NOVAIX FITNESS
import React, {
useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native'
import 
type {
TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { captureRef } from 'react-native-view-shot';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface ShareWorkoutCardProps {
 workoutName: string; duration: number;
 exercises: number;
 calories: number;
 date?: string;
 onClose: () => void;
}
export default function ShareWorkoutCard({
 workoutName, duration, exercises, calories, date, onClose,
}: ShareWorkoutCardProps): React.ReactElement {
 
const cardRef = useRef<View>(
null); const formattedDate = date || 
new Date().toLocaleDateString('pt-BR', {
day: '2-digit', month: '2-digit', year: 'numeric' });
const handleShare = useCallback(
async () => {
   
try { if (cardRef.current) {
       
const uri = await captureRef(cardRef, {
format: 'png', quality: 1, result: 'tmpfile' });
       
await Share.share({
url: uri, message: `Completei o treino ${workoutName
}! ${duration
}min, ${exercises
} exercicios, ${calories
} calorias 🔥` 
});
     
} 
else {
       await Share.share({
message: `Completei o treino ${workoutName
}! ${duration
}min, ${exercises
} exercicios, ${calories
} calorias 🔥` 
});
     
}    
} catch {
/* user cancelled */ }  
}, [workoutName, duration, exercises, calories]);
 
return (    <View style={styles.wrapper
}>      <TouchableOpacity style={styles.closeBtn
} onPress={onClose
} accessibilityLabel="Fechar">        <Ionicons name="close" size={24
} color={colors.textTitle
} />      </TouchableOpacity>      <View ref={cardRef
} style={styles.card
} collapsable={
false
}>        <View style={styles.brandRow
}>          <View style={styles.logoWrap
}>            <Ionicons name="flash" size={20
} color={colors.background
} />          </View>          <Text style={styles.brandName
}>NOVAIX FITNESS</Text>        </View>        <View style={styles.badge
}>          <Ionicons name="checkmark-circle" size={14
} color={colors.success
} />          <Text style={styles.badgeText
}>TREINO COMPLETO</Text>        </View>        <Text style={styles.workoutName
}>{workoutName
}</Text>        <View style={styles.statsGrid
}>          <View style={styles.statItem
}>            <Ionicons name="time" size={18
} color={colors.primary
} />            <Text style={styles.statValue
}>{duration
}</Text>            <Text style={styles.statLabel
}>min</Text>          </View>          <View style={styles.statDivider
} />          <View style={styles.statItem
}>            <Ionicons name="barbell" size={18
} color={colors.success
} />            <Text style={styles.statValue
}>{exercises
}</Text>            <Text style={styles.statLabel
}>exercicios</Text>          </View>          <View style={styles.statDivider
} />          <View style={styles.statItem
}>            <Ionicons name="flame" size={18
} color={colors.secondary
} />            <Text style={styles.statValue
}>{calories
}</Text>            <Text style={styles.statLabel
}>cal</Text>          </View>        </View>        <View style={styles.footer
}>          <Text style={styles.dateText
}>{formattedDate
}</Text>          <Text style={styles.watermark
}>novaix.fitness</Text>        </View>      </View>      <TouchableOpacity style={styles.shareBtn
} onPress={handleShare
} accessibilityLabel="Compartilhar treino">        <Ionicons name="share-social" size={20
} color={colors.background
} />        <Text style={styles.shareText
}>COMPARTILHAR</Text>      </TouchableOpacity>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 wrapper: {
flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)', padding: SPACING.xl } as ViewStyle,  closeBtn: {
position: 'absolute', top: SPACING.xl, right: SPACING.xl, zIndex: 10 } as ViewStyle,  card: {
width: '100%', maxWidth: 340, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border } as ViewStyle,  brandRow: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg } as ViewStyle,  logoWrap: {
width: 32, height: 32, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' } as ViewStyle,  brandName: {
fontFamily: 'Montserrat_700Bold', fontSize: 12, color: COLORS.textMuted, letterSpacing: 2 } as TextStyle,  badge: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, alignSelf: 'flex-start', backgroundColor: COLORS.success + '15', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm, marginBottom: SPACING.md } as ViewStyle,  badgeText: {
fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.success, letterSpacing: 1 } as TextStyle,  workoutName: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.xl, textTransform: 'uppercase' } as TextStyle,  statsGrid: {
flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: SPACING.lg } as ViewStyle,  statItem: {
alignItems: 'center', gap: 4 } as ViewStyle,  statValue: {
fontFamily: 'Montserrat_800ExtraBold', fontSize: 24, color: COLORS.textTitle } as TextStyle,  statLabel: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted } as TextStyle,  statDivider: {
width: 1, height: 40, backgroundColor: COLORS.border } as ViewStyle,  footer: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as ViewStyle,  dateText: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription } as TextStyle,  watermark: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.primary, letterSpacing: 1 } as TextStyle,  shareBtn: {
flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, width: '100%', maxWidth: 340, marginTop: SPACING.lg } as ViewStyle,  shareText: {
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background, letterSpacing: 1 } as TextStyle,
});