import { COLORS } from '../../constants/colors';
import { supabase } from '../../config/supabase';

export function getAverageColor(avgEnergy: number): string {
  if (avgEnergy >= 4) return COLORS.success;
  if (avgEnergy >= 3) return COLORS.attention;
  if (avgEnergy >= 2) return COLORS.secondary;
  return COLORS.error;
}

export function calculateAverage(ratings: Record<string, number>): string {
  const values = Object.values(ratings);
  if (values.length === 0) return '--';
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

export async function saveEnergyLogs(userId: string, ratings: Record<string, number>): Promise<void> {
  for (const [slot, level] of Object.entries(ratings)) {
    await supabase.from('energy_logs').upsert({
      user_id: userId,
      time_slot: slot,
      level,
      logged_at: new Date().toISOString(),
    }, { onConflict: 'user_id,time_slot,logged_at' });
  }
}

export async function loadTodayLogs(userId: string): Promise<Record<string, number>> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data } = await supabase.from('energy_logs')
    .select('time_slot, level')
    .eq('user_id', userId)
    .gte('logged_at', today.toISOString());
  const map: Record<string, number> = {};
  if (data) data.forEach((d: any) => { map[d.time_slot] = d.level; });
  return map;
}
