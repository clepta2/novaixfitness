// src/components/onboarding/StatePickerModal.js
// Modal de selecao de estado - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { ESTADOS } from '../../data/states';
import { typography } from '../../styles';

export default function StatePickerModal({ visible, selectedState, onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = ESTADOS.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase()) ||
    e.sigla.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (sigla) => {
    onSelect(sigla);
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={() => { setSearch(''); onClose(); }}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.box}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={typography.h4}>Selecione seu Estado</Text>
                <TouchableOpacity onPress={() => { setSearch(''); onClose(); }}>
                  <Ionicons name="close" size={24} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={COLORS.textMuted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar estado..."
                  placeholderTextColor={COLORS.textMuted}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              <FlatList
                data={filtered}
                keyExtractor={item => item.sigla}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.item, selectedState === item.sigla && styles.itemActive]}
                    onPress={() => handleSelect(item.sigla)}
                  >
                    <Text style={[styles.itemText, selectedState === item.sigla && styles.itemTextActive]}>
                      {item.nome} ({item.sigla})
                    </Text>
                    {selectedState === item.sigla && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: COLORS.background, borderRadius: 24, padding: SPACING.xl, width: '88%', maxHeight: '65%', marginTop: -60 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.md, marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  item: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm, marginBottom: 2,
  },
  itemActive: { backgroundColor: COLORS.primary + '15' },
  itemText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  itemTextActive: { color: COLORS.primary },
});
