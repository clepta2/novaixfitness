import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';

function convertToCSV(data, headers: any) {
  const rows = [headers.join(',')];
  data.forEach(row => {
    const values = headers.map(h => {
      const val = row[h] ?? '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
    });
    rows.push(values.join(','));
  });
  return rows.join('\n');
}

function formatDate(dateStr: any) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function StudentExporter() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (type) => {
    setExporting(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, subscription_status, subscription_plan, created_at, total_xp, total_workouts, streak');
      if (error) throw error;

      let csv, filename;
      if (type === 'basic') {
        const rows = (profiles || []).map(p => ({
          nome: p.name || '',
          email: p.email || '',
          plano: p.subscription_plan || 'free',
          status: p.subscription_status || 'inactive',
          cadastrado_em: formatDate(p.created_at),
        }));
        csv = convertToCSV(rows, ['nome', 'email', 'plano', 'status', 'cadastrado_em']);
        filename = 'novaix_alunos.csv';
      } else {
        const rows = (profiles || []).map(p => ({
          nome: p.name || '',
          email: p.email || '',
          plano: p.subscription_plan || 'free',
          status: p.subscription_status || 'inactive',
          xp_total: p.total_xp || 0,
          treinos_total: p.total_workouts || 0,
          streak: p.streak || 0,
          cadastrado_em: formatDate(p.created_at),
        }));
        csv = convertToCSV(rows, ['nome', 'email', 'plano', 'status', 'xp_total', 'treinos_total', 'streak', 'cadastrado_em']);
        filename = 'novaix_alunos_completo.csv';
      }

      const fileUri = FileSystem.documentDirectory + filename;
      await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Exportar alunos' });
      }
      Alert.alert('Sucesso', `Arquivo ${filename} exportado!`);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>EXPORTAR DADOS</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('basic')} disabled={exporting} accessibilityLabel="Exportar alunos básico" accessibilityRole="button" accessibilityHint="Exporta lista básica de alunos em CSV">
          <Ionicons name="document-text-outline" size={18} color={COLORS.primary} />
          <Text style={styles.exportText}>Alunos (Básico)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportBtn} onPress={() => handleExport('full')} disabled={exporting} accessibilityLabel="Exportar alunos completo" accessibilityRole="button" accessibilityHint="Exporta lista completa de alunos com dados em CSV">
          <Ionicons name="documents-outline" size={18} color={COLORS.primary} />
          <Text style={styles.exportText}>Alunos (Completo)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.lg },
  label: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: SPACING.sm },
  row: { flexDirection: 'row', gap: SPACING.sm },
  exportBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  exportText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
});