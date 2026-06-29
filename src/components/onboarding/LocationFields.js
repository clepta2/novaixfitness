import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { formatCEP } from '../../data/states';

export default function LocationFields({ state, setState, city, setCity, cep, setCep, street, setStreet, neighborhood, setNeighborhood, number, setNumber, nearTo, setNearTo }) {
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
    <>
      <Text style={s.label}>CEP</Text>
      <View style={s.inputWrap}>
        <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
        <TextInput style={s.input} placeholder="00000-000" placeholderTextColor={COLORS.textMuted} value={cep} onChangeText={handleCepChange} keyboardType="numeric" maxLength={9} />
        {loadingCep && <Ionicons name="sync" size={16} color={COLORS.primary} />}
      </View>

      {street !== undefined && (
        <>
          <Text style={[s.label, { marginTop: SPACING.md }]}>RUA / LOGRADOURO</Text>
          <TextInput style={s.input} placeholder="Rua, Avenida..." placeholderTextColor={COLORS.textMuted} value={street} onChangeText={setStreet} />
        </>
      )}

      {neighborhood !== undefined && (
        <>
          <Text style={[s.label, { marginTop: SPACING.md }]}>BAIRRO</Text>
          <TextInput style={s.input} placeholder="Bairro" placeholderTextColor={COLORS.textMuted} value={neighborhood} onChangeText={setNeighborhood} />
        </>
      )}

      {number !== undefined && (
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { marginTop: SPACING.md }]}>NÚMERO</Text>
            <TextInput style={s.input} placeholder="Nº" placeholderTextColor={COLORS.textMuted} value={number} onChangeText={setNumber} keyboardType="numeric" />
          </View>
          {nearTo !== undefined && (
            <View style={{ flex: 2 }}>
              <Text style={[s.label, { marginTop: SPACING.md }]}>PRÓXIMO DE</Text>
              <TextInput style={s.input} placeholder="Referência..." placeholderTextColor={COLORS.textMuted} value={nearTo} onChangeText={setNearTo} />
            </View>
          )}
        </View>
      )}

      <Text style={[s.label, { marginTop: SPACING.md }]}>ESTADO</Text>
      <View style={s.inputWrap}>
        <Text style={[s.inputText, !state && { color: COLORS.textMuted }]}>{state || 'Selecionar estado'}</Text>
      </View>

      <Text style={[s.label, { marginTop: SPACING.md }]}>CIDADE</Text>
      <TextInput style={s.input} placeholder="Cidade" placeholderTextColor={COLORS.textMuted} value={city} onChangeText={setCity} />
    </>
  );
}

const s = StyleSheet.create({
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg },
  input: { flex: 1, height: 48, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, paddingHorizontal: SPACING.lg, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  inputText: { flex: 1, color: COLORS.textTitle, fontSize: 15, fontFamily: 'Inter_500Medium' },
  row: { flexDirection: 'row', gap: SPACING.md },
});
