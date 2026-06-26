// src/services/body-measurements.js
// Servico de medidas corporais - NOVAIX FITNESS

import { supabase } from '../config/supabase';

export async function saveMeasurement(userId, measurement) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { data, error } = await supabase
    .from('body_measurements')
    .insert({
      user_id: userId,
      weight: measurement.weight,
      chest: measurement.chest,
      waist: measurement.waist,
      hips: measurement.hips,
      arms: measurement.arms,
      thighs: measurement.thighs,
      calves: measurement.calves,
      body_fat: measurement.body_fat,
      recorded_at: measurement.date || new Date().toISOString(),
      notes: measurement.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMeasurements(userId, limit = 50) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getLatestMeasurement(userId) {
  if (!userId) return null;

  const { data } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .single();

  return data;
}

export async function getMeasurementHistory(userId, type = 'weight', months = 6) {
  if (!userId) return [];

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data } = await supabase
    .from('body_measurements')
    .select(`recorded_at, ${type}`)
    .eq('user_id', userId)
    .not(type, 'is', null)
    .gte('recorded_at', startDate.toISOString())
    .order('recorded_at', { ascending: true });

  return (data || []).map(d => ({
    value: d[type],
    date: new Date(d.recorded_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    fullDate: d.recorded_at,
  }));
}

export async function deleteMeasurement(id, userId) {
  if (!userId) throw new Error('Usuario nao autenticado');

  const { error } = await supabase
    .from('body_measurements')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

export function getBMICategory(bmi) {
  if (!bmi) return { label: 'N/D', color: '#94A3B8' };
  const val = parseFloat(bmi);
  if (val < 18.5) return { label: 'Abaixo do peso', color: '#FFD600' };
  if (val < 25) return { label: 'Peso normal', color: '#00E676' };
  if (val < 30) return { label: 'Sobrepeso', color: '#FF6B35' };
  return { label: 'Obesidade', color: '#FF1744' };
}

export function calculateProgress(first, last, type) {
  if (!first || !last) return null;
  const diff = last - first;
  const pct = first !== 0 ? ((diff / first) * 100).toFixed(1) : 0;
  return {
    difference: diff.toFixed(1),
    percentage: parseFloat(pct),
    improved: (type === 'weight' || type === 'waist' || type === 'body_fat')
      ? diff < 0 : diff > 0,
  };
}

export const MEASUREMENT_TYPES = [
  { key: 'weight', label: 'Peso', unit: 'kg', icon: 'body', decimals: 1 },
  { key: 'chest', label: 'Peito', unit: 'cm', icon: 'resize', decimals: 0 },
  { key: 'waist', label: 'Cintura', unit: 'cm', icon: 'resize', decimals: 0 },
  { key: 'hips', label: 'Quadril', unit: 'cm', icon: 'resize', decimals: 0 },
  { key: 'arms', label: 'Bracos', unit: 'cm', icon: 'resize', decimals: 0 },
  { key: 'thighs', label: 'Coxas', unit: 'cm', icon: 'resize', decimals: 0 },
  { key: 'body_fat', label: 'Gordura Corporal', unit: '%', icon: 'water', decimals: 1 },
];
