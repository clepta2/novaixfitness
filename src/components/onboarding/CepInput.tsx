// @ts-nocheck
// src/components/onboarding/CepInput.js
// Campo de CEP com lookup automático - NOVAIX FITNESS

import { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { formatCEP } from '../../data/states';

export default function CepInput({ cep, setCep, setState, setCity, setStreet, setNeighborhood }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (text) => {
    const formatted = formatCEP(text);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      setLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formatted.replace(/\D/g, '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setState(data.uf);
          setCity(data.localidade);
          if (setStreet) setStreet(data.logradouro || '');
          if (setNeighborhood) setNeighborhood(data.bairro || '');
        }
      } catch (e) { if (__DEV__) console.warn('CepInput: erro ao buscar CEP:', e); }
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <TextInput
        style={s.input}
        placeholder="00000-000"
        placeholderTextColor={COLORS.textMuted}
        value={cep}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={9}
      />
      <View style={s.iconLeft}>
        <Ionicons name="location-outline" size={16} color={COLORS.textMuted} />
      </View>
      {loading && (
        <View style={s.loaderRight}>
          <Ionicons name="sync" size={16} color={COLORS.primary} style={s.spinIcon} />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { position: 'relative', width: '100%', height: 52 },
  input: {
    width: '100%', height: 52, backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
    paddingLeft: 46, paddingRight: 46, color: COLORS.textTitle, fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  iconLeft: { position: 'absolute', left: SPACING.lg, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  loaderRight: { position: 'absolute', right: SPACING.lg, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
});
