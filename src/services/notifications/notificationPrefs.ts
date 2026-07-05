import { supabase } from '../../config/supabase';
import { APP_CONFIG } from '../../config/app';
import { tryIf } from '../../utils/tryIf';

const { defaultPrefs, types } = APP_CONFIG.notifications;

export async function getNotificationPrefs(userId: string) {
  if (!userId) return defaultPrefs;
  const result = await tryIf(async () => {
    const { data } = await supabase.from('profiles').select('notification_prefs').eq('id', userId).single();
    return { ...defaultPrefs, ...(data?.notification_prefs || {}) };
  }, { retries: 2, baseDelay: 500 });
  return result.ok ? result.data : defaultPrefs;
}

export async function setNotificationPref(userId: string, type: string, enabled: boolean) {
  if (!userId) return;
  const result = await tryIf(async () => {
    const current = await getNotificationPrefs(userId);
    const updated = { ...current, [type]: enabled };
    await supabase.from('profiles').update({ notification_prefs: updated }).eq('id', userId);
    return updated;
  }, { retries: 2, baseDelay: 500 });
  if (!result.ok && __DEV__) console.error('Erro ao salvar preferencia:', result.error);
  return result.ok ? result.data : undefined;
}

export async function isNotificationEnabled(userId: string, type: string) {
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
  return Object.entries(groups).map(([group, items]: [string, any]) => ({
    title: group.toUpperCase(),
    items: (items as any[]).map(item => ({
      key: item.key,
      icon: item.icon + '-outline',
      label: item.label,
      desc: item.desc,
      color: item.color,
    })),
  }));
}
