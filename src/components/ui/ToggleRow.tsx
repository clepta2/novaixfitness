// src/components/ui/ToggleRow.tsx// Linha com toggle reutilizavel para settings - NOVAIX FITNESS
import React  from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing'
import SpaceBetween  from './SpaceBetween';
import { useColors } from '../../context/ThemeContext';
interface ToggleRowProps {
 label: string; description?: string;
 value: boolean;
 onValueChange: (val: boolean) => void;
 disabled?: boolean;
}
export default function ToggleRow({
label, description, value, onValueChange, disabled = false }: ToggleRowProps) {
return ( <SpaceBetween style={styles.row
}>      <View style={styles.info
}>        <Text style={styles.label
}>{label
}</Text>        {description && <Text style={styles.description
}>{description
}</Text>
}      </View>      <Switch        value={value
}        onValueChange={onValueChange
}        disabled={disabled
}        trackColor={{ false: colors.surfaceOverlay, 
true: colors.primary + '60' 
}}
        thumbColor={value ? colors.primary : colors.textMuted
}      />    </SpaceBetween>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
row: {
   paddingVertical: SPACING.md, },  info: {
   flex: 1, marginRight: SPACING.md,  
},  label: {
   fontFamily: 'Montserrat_600SemiBold', fontSize: 14,    color: colors.textTitle,  
},  description: {
   fontFamily: 'Inter_400Regular', fontSize: 12,    color: colors.textMuted,    marginTop: 2,  
},
});