// src/components/workout/BasicInfoStep.tsx// Step 0: Informacoes basicas do treino - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Input } from '../ui'
import { ALL_CATEGORIES } from '../../data/categories';
import { LEVELS, LEVEL_COLORS } from '../../hooks/useCreateWorkout'
import { useColors } from '../../context/ThemeContext';
interface BasicInfoStepProps {
 form: any; errors: any;
 updateForm: (key: string, value: any) => void;
}
export default function BasicInfoStep({
form, errors, updateForm }: BasicInfoStepProps) {
return ( <View>      <Input        label="Nome do Treino"        value={form.name
}        onChangeText={(v: string) => updateForm('name', v)
}        placeholder="Ex: Treino A - Peito"        icon="create-outline"        error={errors.name
}        secureTextEntry={
false
}        keyboardType="default"        autoCapitalize="none"
      />      {errors.category && ( <View style={styles.error
}>          <Ionicons name="alert-circle" size={16
} color={colors.error
} />          <Text style={styles.errorText
}>{errors.category
}</Text>        </View>      )
}      <Text style={styles.label
}>CATEGORIA</Text>      <View style={styles.grid
}>        {ALL_CATEGORIES.map(c => ( <TouchableOpacity            key={c.id
}            style={[styles.catCard, form.category === c.id && styles.catCardActive]
}            onPress={() => updateForm('category', c.id)
}          >            <View style={[styles.catIcon, {
backgroundColor: (form.category === c.id ? colors.background : c.color) + '20' }]
}>              <Ionicons name={c.icon as any
} size={20
} color={form.category === c.id ? colors.background : c.color
} />            </View>            <Text style={[styles.catLabel, form.category === c.id && {
color: colors.background }]
}>{c.label
}</Text>          </TouchableOpacity>        ))
}      </View>      <Text style={styles.label
}>NIVEL</Text>      <View style={styles.levelRow
}>        {LEVELS.map(l => ( <TouchableOpacity            key={l.id
}            style={[styles.levelCard, form.level === l.id && {
borderColor: LEVEL_COLORS[l.id], backgroundColor: LEVEL_COLORS[l.id] + '10' }]
}            onPress={() => updateForm('level', l.id)
}          >            <Ionicons name={l.icon as any
} size={18
} color={form.level === l.id ? LEVEL_COLORS[l.id] : colors.textMuted
} />            <Text style={[styles.levelLabel, form.level === l.id && {
color: LEVEL_COLORS[l.id] }]
}>{l.label
}</Text>          </TouchableOpacity>        ))
}      </View>      <Text style={styles.label
}>DURACAO (minutos)</Text>      <View style={styles.durationRow
}>        {[30, 45, 60, 90].map(d => ( <TouchableOpacity            key={d
}            style={[styles.durationCard, form.duration === d && styles.durationCardActive]
}            onPress={() => updateForm('duration', d)
}          >            <Text style={[styles.durationText, form.duration === d && styles.durationTextActive]
}>{d
}</Text>          </TouchableOpacity>        ))
}      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
error: {
flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: SPACING.sm },  errorText: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.error },  label: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: SPACING.xl, marginBottom: SPACING.sm },  grid: {
flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },  catCard: {
width: '48%', flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: colors.border },  catCardActive: {
backgroundColor: colors.primary, borderColor: colors.primary },  catIcon: {
width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },  catLabel: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: colors.textTitle },  levelRow: {
flexDirection: 'row', gap: SPACING.sm },  levelCard: {
flex: 1, alignItems: 'center', gap: SPACING.xs, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: colors.border },  levelLabel: {
fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.textMuted },  durationRow: {
flexDirection: 'row', gap: SPACING.sm },  durationCard: {
flex: 1, alignItems: 'center', paddingVertical: SPACING.md, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: colors.border },  durationCardActive: {
backgroundColor: colors.primary, borderColor: colors.primary },  durationText: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: colors.textTitle },  durationTextActive: {
color: colors.background },
});