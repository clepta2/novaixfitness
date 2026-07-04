// src/components/ui/ProgressHeader.tsx// Header de onboarding com step pill + titulo + subtitulo + progress bar - NOVAIX FITNESS
import { View, Text, StyleSheet  } from 'react-native'
import { COLORS  } from '../../constants/colors';
import { SPACING, BORDER_RADIUS  } from '../../constants/spacing'
import { StepPill  } from './StepPill';
import { Spacer  } from './Spacer'
import { useColors  } from '../../context/ThemeContext';
interface ProgressHeaderProps {
 step: number;
 totalSteps: number;
 title: string;
 subtitle?: string;
 progress: number;
// 0-100
}
export 
function ProgressHeader({
 step,  totalSteps,  title,  subtitle,  progress,
}: ProgressHeaderProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      <StepPill currentStep={step
} totalSteps={totalSteps
} />      <Text style={styles.title
}>{title
}</Text>      {subtitle && <Text style={styles.subtitle
}>{subtitle
}</Text>
}      <Spacer size={16
} />      <View style={styles.progressRow
}>        <View style={styles.track
}>          <View style={[styles.fill, {
width: `${progress
}%` 
}]
} />        </View>        <Text style={styles.label
}>{Math.round(progress)
}%</Text>      </View>    </View>  );
}
const styles = StyleSheet.create({
 container: {
   alignItems: 'center',    marginBottom: SPACING.xxl,  
},  title: {
   fontFamily: 'Montserrat_800ExtraBold',    fontSize: 26,    color: COLORS.textTitle,    textAlign: 'center',    lineHeight: 34,    marginBottom: SPACING.sm,  
},  subtitle: {
   fontFamily: 'Inter_400Regular',    fontSize: 13,    color: COLORS.textMuted,    textAlign: 'center',  
},  progressRow: {
   width: '100%',    flexDirection: 'row',    alignItems: 'center',    gap: SPACING.sm,  
},  track: {
   flex: 1,    height: 4,    backgroundColor: COLORS.border,    borderRadius: 2,    overflow: 'hidden',  
},  fill: {
   height: '100%',    backgroundColor: COLORS.primary,    borderRadius: 2,  
},  label: {
   fontFamily: 'Inter_500Medium',    fontSize: 11,    color: COLORS.primary,    width: 36,  
},
});