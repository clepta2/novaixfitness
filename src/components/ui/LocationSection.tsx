import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { Input } from './Input';
import { typography } from '../../styles';

const ESTADOS = [
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

const formatCEP = (v) => {
  const clean = v.replace(/\D/g, '').slice(0, 8);
  return clean.length <= 5 ? clean : `${clean.slice(0, 5)}-${clean.slice(5)}`;
};

export default function LocationSection({ onLocationChange, initialLocation }) {
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [showStateModal, setShowStateModal] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  const filteredStates = ESTADOS.filter(e =>
    e.nome.toLowerCase().includes(stateSearch.toLowerCase()) ||
    e.sigla.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const fetchCEP = useCallback(async (cepValue) => {
    const clean = cepValue.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setStreet(data.logradouro || '');
        setNeighborhood(data.bairro || '');
        setCity(data.localidade || '');
        const stateObj = ESTADOS.find(e => e.sigla === data.uf);
        if (stateObj) setSelectedState(stateObj.sigla);
      }
    } catch {}
    setLoadingCep(false);
  }, []);

  useEffect(() => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) fetchCEP(cep);
  }, [cep, fetchCEP]);

  useEffect(() => {
    const location = `${street}${number ? ', ' + number : ''}${neighborhood ? ' - ' + neighborhood : ''}${city ? ', ' + city : ''}${selectedState ? ' - ' + selectedState : ''}`;
    onLocationChange?.({ street, number, neighborhood, city, state: selectedState, cep, full: location });
  }, [street, number, neighborhood, city, selectedState, cep]);

  return (
    <View>
      <Text style={styles.sectionLabel}>LOCALIZAÇÃO</Text>
      <View style={styles.cepRow}>
        <View style={{ flex: 1 }}>
          <Input label="CEP" placeholder="00000-000" value={cep} onChangeText={(v) => setCep(formatCEP(v))} keyboardType="numeric" icon="map-outline" />
        </View>
        {loadingCep && <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: SPACING.sm }} />}
      </View>

      {street.length > 0 && (
        <>
          <Input label="RUA" placeholder="" value={street} onChangeText={setStreet} icon="location-outline" />
          <View style={styles.row}>
            <View style={{ width: 60 }}>
              <Input label="NÚMERO" placeholder="Nº" value={number} onChangeText={setNumber} keyboardType="numeric" icon={"hash" as any} />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="BAIRRO" placeholder="" value={neighborhood} onChangeText={setNeighborhood} icon="location-outline" />
            </View>
          </View>
        </>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={styles.stateBtn} onPress={() => setShowStateModal(true)} accessibilityLabel={`Estado: ${selectedState || 'Selecionar'}`} accessibilityRole="button" accessibilityHint="Abrir lista de estados">
          <Text style={styles.stateLabel}>ESTADO</Text>
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>{selectedState || 'UF'}</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.textTitle} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Input label="CIDADE" placeholder={selectedState ? "Buscar cidade" : "CEP primeiro"} value={city} onChangeText={setCity} icon="location-outline" />
        </View>
      </View>

      <TouchableOpacity style={styles.gpsBtn} onPress={() => {}} accessibilityLabel="Usar minha localização" accessibilityRole="button" accessibilityHint="Detectar localização automaticamente">
        <Ionicons name="locate" size={16} color={COLORS.primary} />
        <Text style={styles.gpsText}>Usar minha localização</Text>
      </TouchableOpacity>

      {showStateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={typography.h4}>Selecione seu Estado</Text>
              <TouchableOpacity onPress={() => { setShowStateModal(false); setStateSearch(''); }} accessibilityLabel="Fechar" accessibilityRole="button">
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
              data={filteredStates}
              keyExtractor={item => item.sigla}
              style={{ maxHeight: 250 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.stateItem, selectedState === item.sigla && styles.stateItemActive]}
                  onPress={() => { setSelectedState(item.sigla); setCity(''); setStateSearch(''); setShowStateModal(false); }}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  cepRow: { flexDirection: 'row', alignItems: 'center' },
  row: { flexDirection: 'row', gap: SPACING.md },
  stateBtn: { width: 80 },
  stateLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  stateBox: { height: 56, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md },
  stateText: { color: COLORS.textTitle, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: SPACING.sm },
  gpsText: { color: COLORS.primary, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 999 },
  modalBox: { backgroundColor: COLORS.background, borderRadius: 24, padding: SPACING.xl, width: '88%', maxHeight: '70%' },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.lg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  searchInput: { flex: 1, paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14 },
  stateItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.sm, marginBottom: 2 },
  stateItemActive: { backgroundColor: COLORS.primary + '15' },
  stateItemText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
});