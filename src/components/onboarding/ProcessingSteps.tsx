// src/components/onboarding/ProcessingSteps.tsx// Lista de steps do processamento - NOVAIX FITNESS
import React  from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
interface Step {
 icon: string; label: string;
 color: string;
}
interface ProcessingStepsProps {
 steps: Step[]; currentStep: number;
}
export default function ProcessingSteps({
steps, currentStep }: ProcessingStepsProps) {
return ( <View style={styles.container
}>      {steps.map((step, i) => ( <View key={i
} style={[styles.item, i <= currentStep && styles.active]
}>          <View style={[styles.icon, {
backgroundColor: (i <= currentStep ? step.color : colors.surfaceElevated) + '20' }]
}>            <Ionicons name={step.icon as any
} size={18
} color={i <= currentStep ? step.color : colors.textMuted
} />          </View>          <View style={styles.info
}>            <Text style={[styles.label, i <= currentStep && styles.labelActive]
}>{step.label
}</Text>            {i < currentStep && <Text style={styles.done
}>Concluido</Text>
}            {i === currentStep && i < 3 && <Text style={styles.progress
}>Em andamento...</Text>
}          </View>          {i <= currentStep && <Ionicons name="checkmark-circle" size={16
} color={step.color
} />
}        </View>      ))
}    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
width: '100%', gap: SPACING.md },  item: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.md, opacity: 0.5 },  active: {
opacity: 1 },  icon: {
width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },  info: {
flex: 1 },  label: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textMuted },  labelActive: {
color: colors.textTitle },  done: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.success, marginTop: 2 },  progress: {
fontFamily: 'Inter_400Regular', fontSize: 11, color: colors.primary, marginTop: 2 },
});