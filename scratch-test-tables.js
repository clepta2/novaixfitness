// scratch/test-tables.js
// Script para testar se as novas tabelas foram criadas com sucesso no Supabase.

// Mock AsyncStorage para ambiente Node puro
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getItem = async () => null;
AsyncStorage.setItem = async () => null;
AsyncStorage.removeItem = async () => null;

import { supabase } from './src/config/supabase.js';

async function testTables() {
  console.log('--- Iniciando teste de tabelas do Supabase ---');

  const tables = [
    { name: 'profiles', select: 'id, email' },
    { name: 'workouts', select: 'id, title' },
    { name: 'user_workouts', select: 'id, completed' },
    { name: 'workout_comments', select: 'id, content' },
    { name: 'workout_likes', select: 'id' },
    { name: 'posts', select: 'id, content' },
    { name: 'post_likes', select: 'id' },
    { name: 'post_comments', select: 'id, content' }
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select(table.select)
        .limit(1);

      if (error) {
        console.error(`❌ Erro na tabela [${table.name}]:`, error.message);
      } else {
        console.log(`✅ Tabela [${table.name}] acessada com sucesso!`);
      }
    } catch (err) {
      console.error(`❌ Falha crítica ao acessar [${table.name}]:`, err.message || err);
    }
  }

  console.log('--- Fim do teste ---');
}

testTables();
