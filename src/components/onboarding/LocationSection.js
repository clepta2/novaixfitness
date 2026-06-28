import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import StatePickerModal from './StatePickerModal';
import { formatCEP } from '../../data/states';

export default function LocationSection({ state, setState, city, setCity, cep, setCep, street, setStreet, neighborhood, setNeighborhood, number, setNumber, nearTo, setNearTo }) {
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const handleCepChange = async (text) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formatted.replace(/\D/g, '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setState(data.uf);
          setCity(data.localidade);
          if (setStreet) setStreet(data.logradouro || '');
          if (setNeighborhood) setNeighborhood(data.bairro || '');
        }
      } catch {}
      setLoadingCep(false);
    }
  };

  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        <View style={s.accentDot} />
        <Text style={s.sectionLabel}>LOCALIZAÇÃO</Text>
      </View>

      <Text style={s.fieldLabel}>CEP</Text>
      <View style={s.cepInputWrap}>
        <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
        <TextInput style={s.cepInput} placeholder="00000-000" placeholderTextColor={COLORS.textMuted} value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={9} />
        {loadingCep && <Ionicons name="sync" size={16} color={COLORS.primary} style={s.cepLoader} />}
      </View>

      {street !== undefined && (
        <>
          <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>RUA / LOGRADOURO</Text>
          <TextInput style={s.input} placeholder="Rua, Avenida..." placeholderTextColor={COLORS.textMuted} value={street} onChangeText={setStreet} />
        </>
      )}

      {neighborhood !== undefined && (
        <>
          <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>BAIRRO</Text>
          <TextInput style={s.input} placeholder="Bairro" placeholderTextColor={COLORS.textMuted} value={neighborhood} onChangeText={setNeighborhood} />
        </>
      )}

      {number !== undefined && (
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>NÚMERO</Text>
            <TextInput style={s.input} placeholder="Nº" placeholderTextColor={COLORS.textMuted} value={number} onChangeText={setNumber} keyboardType="numeric" />
          </View>
          {nearTo !== undefined && (
            <View style={{ flex: 2 }}>
              <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>PRÓXIMO DE</Text>
              <TextInput style={s.input} placeholder="Referência..." placeholderTextColor={COLORS.textMuted} value={nearTo} onChangeText={setNearTo} />
            </View>
          )}
        </View>
      )}

      <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>ESTADO</Text>
      <TouchableOpacity style={s.stateBtn} onPress={() => setShowStatePicker(true)}>
        <Text style={[s.stateText, !state && { color: COLORS.textMuted }]}>{state || 'Selecionar estado'}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      <Text style={[s.fieldLabel, { marginTop: SPACING.md }]}>CIDADE</Text>
      <TextInput style={s.cityInput} placeholder="Cidade" placeholderTextColor={COLORS.textMuted} value={city} onChangeText={setCity} />

      <StatePickerModal visible={showStatePicker} selectedState={state} onSelect={setState} onClose={() => setShowStatePicker(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  section: { marginBottom: SPACING.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  accentDot: { width: 3, height: 16, backgroundColor: COLORS.primary, borderRadius: 2 },
  sectionLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.textTitle, textTransform: 'uppercase', letterSpacing: 1.5 },
  fieldLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  cepInputWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  cepInput: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  cepLoader: { marginLeft: SPACING.sm },
  input: { height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  row: { flexDirection: 'row', gap: SPACING.md },
  stateBtn: { height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stateText: { color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  cityInput: { height: 52, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
});
