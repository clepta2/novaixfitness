// src/components/ui/CategoryFilter.tsx// Filtro de categorias horizontal - NOVAIX FITNESS
import React  from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface Category {
 id: string; label: string;
}
interface CategoryFilterProps {
 categories: Category[]; selected: string | 
null;
 onSelect: (id: string | 
null) => void;
 showAll?: boolean;
 allLabel?: string;
}
export default function CategoryFilter({
categories, selected, onSelect, showAll = true, allLabel = 'Todos' 
}: CategoryFilterProps) {
return ( <View style={styles.container
}>      {showAll && ( <TouchableOpacity          style={[styles.chip, !selected && styles.chipActive]
}          onPress={() => onSelect(
null)
}        >          <Text style={[styles.chipText, !selected && styles.chipTextActive]
}>{allLabel
}</Text>        </TouchableOpacity>      )
}      {categories.map((cat) => ( <TouchableOpacity          key={cat.id
}          style={[styles.chip, selected === cat.id && styles.chipActive]
}          onPress={() => onSelect(selected === cat.id ? null : cat.id)
}        >          <Text style={[styles.chipText, selected === cat.id && styles.chipTextActive]
}>{cat.label
}</Text>        </TouchableOpacity>      ))
}    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 
container: {
flexDirection: 'row', gap: SPACING.sm },  chip: {
paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: colors.surface, borderRadius: BORDER_RADIUS.full, borderWidth: 1, borderColor: colors.border },  chipActive: {
backgroundColor: colors.primary, borderColor: colors.primary },  chipText: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: colors.textMuted },  chipTextActive: {
color: colors.background },
});