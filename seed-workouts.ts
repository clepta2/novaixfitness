// seed-workouts.js
// Script para inserir treinos reais no Supabase para popular o banco de dados

import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem = async () => null as any;
AsyncStorage.setItem = async () => { return; };
AsyncStorage.removeItem = async () => { return; };

import { supabase } from './src/config/supabase.js';

const realWorkouts = [
  {
    title: 'Treino A: Peito & Tríceps (Foco Hipertrofia)',
    description: 'Rotina intensa focada em desenvolvimento da musculatura do peitoral, ombros anteriores e tríceps com barra e halteres.'
  },
  {
    title: 'Queima Rápida: HIIT Cardio 30 minutos',
    description: 'Treino cardiovascular de alta intensidade utilizando apenas o peso corporal. Ideal para queima de gordura e ganho de resistência.'
  },
  {
    title: 'Treino B: Costas & Bíceps (Puxadas e Roscas)',
    description: 'Foco no desenvolvimento de dorsais, trapézio e bíceps completo com halteres e polias.'
  },
  {
    title: 'Mobilidade e Flexibilidade Completa',
    description: 'Rotina restaurativa focada em soltura articular, alívio de tensões nas costas e alongamento de pernas.'
  }
];

async function seed() {
  console.log('--- Inserindo treinos no Supabase ---');
  
  // Limpar treinos antigos para evitar duplicatas nos testes
  const { error: deleteError } = await supabase
    .from('workouts')
    .delete()
    .neq('title', ''); // Deleta tudo
    
  if (deleteError) {
    console.error('Erro ao deletar treinos antigos:', deleteError.message);
  } else {
    console.log('Treinos antigos limpos com sucesso.');
  }

  const { data, error } = await supabase
    .from('workouts')
    .insert(realWorkouts)
    .select();

  if (error) {
    console.error('❌ Erro ao cadastrar treinos:', error.message);
  } else {
    console.log(`✅ ${data.length} treinos cadastrados com sucesso no Supabase!`);
  }
}

seed();
