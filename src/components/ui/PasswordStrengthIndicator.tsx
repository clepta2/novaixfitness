// src/components/ui/PasswordStrengthIndicator.tsx// Indicador de forca da senha - NOVAIX FITNESS
import { View, Text, StyleSheet  } from 'react-native'
import { Ionicons  } from '@expo/vector-icons';
import { COLORS  } from '../../constants/colors'
import { SPACING  } from '../../constants/spacing';
import { useColors  } from '../../context/ThemeContext';
interface PasswordStrengthIndicatorProps {
 password: string;
 strength: number;
 label: string;
 color: string;
}
const CHECKS = [  {
label: 'Minimo 8 caracteres', test: (p: string) => p.length >= 8 
},  {
label: 'Maiuscula (A-Z)', test: (p: string) => /[A-Z]/.test(p) 
},  {
label: 'Minuscula (a-z)', test: (p: string) => /[a-z]/.test(p) 
},  {
label: 'Numero (0-9)', test: (p: string) => /[0-9]/.test(p) 
},  {
label: 'Simbolo (@, #, !)', test: (p: string) => /[^A-Za-z0-9]/.test(p) 
},];
export 
function PasswordStrengthIndicator({
 password,  strength,  label,  color,
}: PasswordStrengthIndicatorProps) {
 
const colors = useColors();
return (    <View style={styles.container
}>      <View style={styles.barBg
}>        <View style={[styles.barFill, {
width: `${(strength / 5) * 100
}%`, backgroundColor: color 
}]
} />      </View>      <Text style={[styles.label, {
color 
}]
}>{label
}</Text>      <View style={styles.checks
}>        {CHECKS.map(({
label: lbl, test 
}) => {
         
const ok = test(password);
         
return (            <View key={lbl
} style={styles.checkRow
}>              <Ionicons name={ok ? 'checkmark-circle' : 'ellipse-outline'
} size={12
} color={ok ? colors.primary : colors.textMuted
} />              <Text style={[styles.checkText, {
color: ok ? colors.primary : colors.textMuted 
}]
}>{lbl
}</Text>            </View>          );
       
})
}      </View>    </View>  );
}
const styles = StyleSheet.create({
 container: {
marginBottom: SPACING.md 
},  barBg: {
height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden', marginBottom: SPACING.xs 
},  barFill: {
height: '100%', borderRadius: 3 
},  label: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, marginBottom: SPACING.xs 
},  checks: {
gap: 4 
},  checkRow: {
flexDirection: 'row', alignItems: 'center', gap: 6 
},  checkText: {
fontFamily: 'Inter_400Regular', fontSize: 11 
},
});