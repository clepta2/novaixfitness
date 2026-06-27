import { supabase } from '../config/supabase';
import { APP_CONFIG } from '../config/app';

const { defaultPrefs, types } = APP_CONFIG.notifications;

export async function getNotificationPrefs(userId) {
  if (!userId) return defaultPrefs;
  try {
    const { data } = await supabase.from('profiles').select('notification_prefs').eq('id', userId).single();
    return { ...defaultPrefs, ...(data?.notification_prefs || {}) };
  } catch {
    return defaultPrefs;
  }
}

export async function setNotificationPref(userId, type, enabled) {
  if (!userId) return;
  try {
    const current = await getNotificationPrefs(userId);
    const updated = { ...current, [type]: enabled };
    await supabase.from('profiles').update({ notification_prefs: updated }).eq('id', userId);
    return updated;
  } catch (err) {
    console.error('Erro ao salvar preferencia:', err);
  }
}

export async function isNotificationEnabled(userId, type) {
  if (!userId) return true;
  const prefs = await getNotificationPrefs(userId);
  return prefs[type] !== false;
}

export function getNotificationGroups() {
  const groups = {};
  for (const [key, config] of Object.entries(types)) {
    if (!config.label) continue;
    const group = config.group || 'outros';
    if (!groups[group]) groups[group] = [];
    groups[group].push({ key, ...config });
  }
  return groups;
}

export function getPrefsForSettings() {
  const groups = getNotificationGroups();
  return Object.entries(groups).map(([group, items]) => ({
    title: group.toUpperCase(),
    items: items.map(item => ({
      key: item.key,
      icon: item.icon + '-outline',
      label: item.label,
      desc: item.desc,
      color: item.color,
    })),
  }));
}
