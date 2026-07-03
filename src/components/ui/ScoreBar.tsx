// src/components/ui/ScoreBar.tsx// Barra de pontuacao reutilizavel - NOVAIX FITNESS
import React  from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import SpaceBetween  from './SpaceBetween';
import { useColors } from '../../context/ThemeContext';
interface ScoreBarProps {
 current: number; max: number;
 label?: string;
 color?: string;
 showValue?: boolean;
}
export default function ScoreBar({
current, max, label, color = colors.primary, showValue = true }: ScoreBarProps) {
const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0; return (    <View style={styles.container
}>      {(label || showValue) && ( <SpaceBetween style={styles.header
}>          {label && <Text style={styles.label
}>{label
}</Text>
}          {showValue && <Text style={[styles.value, {
color }]
}>{current
}/{max
}</Text>
}        </SpaceBetween>      )
}      <View style={styles.track
}>        <View style={[styles.fill, {
width: `${percentage
}%`, backgroundColor: color }]
} />      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
   gap: SPACING.xs, },  header: {
   flexDirection: 'row', justifyContent: 'space-between',    alignItems: 'center',  
},  label: {
   fontFamily: 'Inter_500Medium', fontSize: 12,    color: colors.textMuted,  
},  value: {
   fontFamily: 'Montserrat_700Bold', fontSize: 12,  
},  track: {
   height: 6, backgroundColor: colors.surfaceOverlay,    borderRadius: 3,    overflow: 'hidden',  
},  fill: {
   height: '100%', borderRadius: 3,  
},
});