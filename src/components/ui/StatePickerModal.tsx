import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

export const ESTADOS = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

export default function StatePickerModal({ visible, selectedState, onSelect, onClose }) {
  const [stateSearch, setStateSearch] = useState('');

  if (!visible) return null;

  const filtered = ESTADOS.filter(e =>
    e.nome.toLowerCase().includes(stateSearch.toLowerCase()) ||
    e.sigla.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={typography.h4}>Selecione seu Estado</Text>
          <TouchableOpacity onPress={() => { onClose(); setStateSearch(''); }} accessibilityLabel="Fechar" accessibilityRole="button">
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Buscar..." placeholderTextColor={COLORS.textMuted} value={stateSearch} onChangeText={setStateSearch} accessibilityLabel="Buscar estado" />
        </View>
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          data={filtered}
          keyExtractor={item => item.sigla}
          style={{ maxHeight: 250 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.stateItem, selectedState === item.sigla && styles.stateItemActive]}
              onPress={() => { onSelect(item.sigla); setStateSearch(''); }}
              accessibilityLabel={`${item.nome} (${item.sigla})`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedState === item.sigla }}
            >
              <Text style={[styles.stateItemText, selectedState === item.sigla && { color: COLORS.primary }]}>{item.nome} ({item.sigla})</Text>
              {selectedState === item.sigla && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  box: { backgroundColor: COLORS.background, borderRadius: 24, padding: SPACING.xl, width: '88%', maxHeight: '70%' },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  stateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: 2 },
  stateItemActive: { backgroundColor: COLORS.primary + '15' },
  stateItemText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
});
