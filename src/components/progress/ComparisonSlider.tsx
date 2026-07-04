// src/components/progress/ComparisonSlider.tsx// Slider de comparacao antes/depois com medições - NOVAIX FITNESS
import React, {
useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, Image, StyleSheet, PanResponder, Animated } from 'react-native'
import 
type {
TextStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/colors';
import { shadow } from '../../helpers/shadows'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { SectionCard } from '../ui/SectionCard'
import { useColors } from '../../context/ThemeContext';
interface Measurement {
 label: string; before: number;
 after: number;
 unit: string;
}
interface ComparisonSliderProps {
 beforeUri?: string; afterUri?: string;
 measurements?: Measurement[];
 width?: number;
 height?: number;
}
export default function ComparisonSlider({
 beforeUri, afterUri, measurements = [], width = 320, height = 400,
}: ComparisonSliderProps): React.ReactElement {
const colors = useColors();
const styles = makeStyles(colors);
 
const [sliderX, setSliderX] = useState(width / 2); const [animatedX] = useState(() => 
new Animated.Value(width / 2));
 
const panResponder = useMemo(() => PanResponder.create({onStartShouldSetPanResponder: () => 
true,    onMoveShouldSetPanResponder: () => 
true,    onPanResponderMove: (_, gesture) => {
     
const newX = Math.max(20, Math.min(width - 20, gesture.moveX)); setSliderX(newX);
     animatedX.setValue(newX);
   
},  
}), [width]);
 
const renderMeasurements = useCallback(() => {
   
if (!measurements.length) return 
null;
   
return (      <SectionCard style={{ marginTop: SPACING.lg }}>
        <Text style={styles.measurementsTitle
}>MEDIÇÕES</Text>        {measurements.map((m, i) => { const diff = m.after - m.before;
         
const diffColor = diff < 0 ? colors.success : diff > 0 ? colors.error : colors.textMuted;
         
return (            <View key={i
} style={styles.measureRow
}>              <Text style={styles.measureLabel
}>{m.label
}</Text>              <View style={styles.measureValues
}>                <Text style={styles.measureBefore
}>{m.before
}{m.unit
}</Text>                <Ionicons name="arrow-forward" size={12
} color={colors.textMuted
} />                <Text style={styles.measureAfter
}>{m.after
}{m.unit
}</Text>                <Text style={[styles.measureDiff, {
color: diffColor }]
}>                  {diff > 0 ? '+' : ''
}{diff.toFixed(1)
}{m.unit
}                </Text>              </View>            </View>          );
})
}      </SectionCard>    );
}, [measurements]);
 
return (    <View style={styles.container
}>      <View style={[styles.sliderWrap, {
width, height }]
} {...panResponder.panHandlers
}>        {beforeUri ? ( <Image source={{ uri: beforeUri }}
 style={[styles.image, {
width, height }]}
 resizeMode="cover" />        ) : (          <View style={[styles.placeholder, {
width, height }]
}>            <Ionicons name="person" size={48
} color={colors.textMuted
} />            <Text style={styles.placeholderText
}>ANTES</Text>          </View>        )
}        {afterUri && ( <View style={[styles.afterClip, {
width: sliderX, height, overflow: 'hidden' }]
}>            <Image source={{ uri: afterUri }}
 style={[styles.image, {
width, height }]}
 resizeMode="cover" />          </View>        )
}        <View style={[styles.divider, {
left: sliderX - 1.5 }]
}>          <View style={styles.dividerLine
} />          <View style={styles.handle
}>            <Ionicons name="swap-horizontal" size={14
} color={colors.background
} />          </View>        </View>        <View style={[styles.label, {
left: 8 }]
}>          <Text style={styles.labelText
}>ANTES</Text>        </View>        <View style={[styles.label, {
right: 8, left: 'auto' as any }]
}>          <Text style={styles.labelText
}>DEPOIS</Text>        </View>      </View>      {renderMeasurements()
}    </View>  );
}
const makeStyles = (colors: any) => StyleSheet.create({
 container: {
alignItems: 'center', paddingVertical: SPACING.lg } as ViewStyle,  sliderWrap: {
borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', backgroundColor: COLORS.surfaceOverlay } as ViewStyle,  image: {
position: 'absolute', top: 0, left: 0 } as any,  afterClip: {
position: 'absolute', top: 0, left: 0 } as any,  placeholder: {
justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.surfaceOverlay } as ViewStyle,  placeholderText: {
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textMuted, letterSpacing: 2, marginTop: SPACING.sm } as TextStyle,  divider: {
position: 'absolute', top: 0, bottom: 0, width: 3, alignItems: 'center', justifyContent: 'center', zIndex: 5 } as any,  dividerLine: {
flex: 1, width: 2, backgroundColor: COLORS.textTitle } as ViewStyle,  handle: {
width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.textTitle, ...shadow({
y: 2, blur: 4, opacity: 0.3 }) 
} as ViewStyle,  label: {
position: 'absolute', bottom: SPACING.md, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, zIndex: 3 } as any,  labelText: {
fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.textTitle, letterSpacing: 1 } as TextStyle,  measurementsTitle: {
fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: SPACING.md } as TextStyle,  measureRow: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border } as ViewStyle,  measureLabel: {
fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle } as TextStyle,  measureValues: {
flexDirection: 'row', alignItems: 'center', gap: SPACING.xs } as ViewStyle,  measureBefore: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' } as TextStyle,  measureAfter: {
fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle } as TextStyle,  measureDiff: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 11 } as TextStyle,
});