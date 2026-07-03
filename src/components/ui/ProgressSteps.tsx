// src/components/ui/ProgressSteps.tsx// Indicador de progresso por etapas - NOVAIX FITNESS
import React  from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface ProgressStepsProps {
 current: number; total: number;
 labels?: string[];
}
export default function ProgressSteps({
current, total, labels }: ProgressStepsProps) {
return ( <View style={styles.container
}>      <View style={styles.bar
}>        {Array.from({
length: total }).map((_, i) => (          <View            key={i
}            style={[ styles.segment,              i < current && styles.segmentActive,              i === current && styles.segmentCurrent,            ]
}          />        ))
}      </View>      {labels && ( <View style={styles.labels
}>          {labels.map((label, i) => ( <Text key={i
} style={[styles.label, i <= current && styles.labelActive]
}>{label
}</Text>          ))
}        </View>      )
}      <Text style={styles.counter
}>{current + 1
}/{total
}</Text>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
   gap: SPACING.xs, },  bar: {
   flexDirection: 'row', gap: 4,  
},  segment: {
   flex: 1, height: 4,    borderRadius: 2,    backgroundColor: colors.surfaceOverlay,  
},  segmentActive: {
   backgroundColor: colors.primary, },  segmentCurrent: {
   backgroundColor: colors.primary, opacity: 0.6,  
},  labels: {
   flexDirection: 'row', justifyContent: 'space-between',  
},  label: {
   fontFamily: 'Inter_400Regular', fontSize: 10,    color: colors.textMuted,  
},  labelActive: {
   color: colors.primary, },  counter: {
   fontFamily: 'Inter_500Medium', fontSize: 11,    color: colors.textMuted,    textAlign: 'right',  
},
});