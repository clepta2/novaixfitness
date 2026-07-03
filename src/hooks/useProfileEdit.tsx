import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import { calcStreak } from '../helpers/streaks';
import { Profile } from '../types';

interface ProfileStats {
  streak: number;
  workouts: number;
  time: number;
  favorites: number;
}

interface UseProfileEditReturn {
  profile: Profile | null;
  stats: ProfileStats;
  showEditName: boolean;
  setShowEditName: (val: boolean) => void;
  userName: string;
  userEmail: string;
  memberSince: string;
  handleUpdateAvatar: () => void;
  updateProfileName: (newName: string) => Promise<void>;
}

export function useProfileEdit(): UseProfileEditReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({ streak: 0, workouts: 0, time: 0, favorites: 0 });
  const [showEditName, setShowEditName] = useState<boolean>(false);

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      const { data: profileData } = await supabase.from('profiles')
        .select('*').eq('id', user.id).single();
      const { data: workouts } = await supabase.from('user_workouts')
        .select('*, workouts(title, duration_minutes, duration)')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
      const { count: favCount } = await supabase.from('favorites')
        .select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const completed = workouts?.filter((w: { completed: boolean }) => w.completed).length || 0;
      const totalMinutes = workouts?.reduce(
        (sum: number, w: { duration?: number; workouts?: { duration_minutes?: number; duration?: number } }) =>
          sum + (w.duration || w.workouts?.duration_minutes || 0), 0
      ) || 0;
      setProfile(profileData as Profile);
      setStats({
        streak: calcStreak(workouts || []),
        workouts: completed,
        time: Math.round(totalMinutes / 60),
        favorites: favCount || 0,
      });
    } catch (err) { if (__DEV__) console.error(err); }
  }, [user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const pickImage = useCallback(async (cam: boolean): Promise<void> => {
    if (!user?.id) return;
    const perm = cam
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = cam
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!res.canceled && res.assets?.[0]?.uri) {
      const uri = res.assets[0].uri;
      await supabase.from('profiles').update({ avatar_url: uri }).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, avatar_url: uri } : prev);
    }
  }, [user?.id]);

  const handleUpdateAvatar = useCallback((): void => Alert.alert('Foto de Perfil', 'Escolha:', [
    { text: 'Câmera', onPress: () => pickImage(true) },
    { text: 'Galeria', onPress: () => pickImage(false) },
    { text: 'Cancelar', style: 'cancel' },
  ]), [pickImage]);

  const updateProfileName = useCallback(async (newName: string): Promise<void> => {
    if (!user?.id) return;
    try {
      await supabase.from('profiles').update({ name: newName }).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, name: newName } : prev);
    } catch { Alert.alert('Erro', 'Não foi possível salvar'); }
  }, [user?.id]);

  const userName: string = user?.user_metadata?.name || profile?.name || 'Atleta';
  const userEmail: string = user?.email || '';
  const memberSince: string = profile?.created_at
    ? new Date(profile.created_at as any).toLocaleDateString('pt-BR') : '-';

  return {
    profile, stats, showEditName, setShowEditName,
    userName, userEmail, memberSince,
    handleUpdateAvatar, updateProfileName,
  };
}
