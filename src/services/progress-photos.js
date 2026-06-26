// src/services/progress-photos.js
// Servico de fotos de progresso - NOVAIX FITNESS

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../config/supabase';

export async function pickImage() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissao para acessar galeria negada');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0];
}

export async function takePhoto() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissao para acessar camera negada');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0];
}

export async function uploadProgressPhoto(userId, imageUri, label) {
  const fileName = `${userId}/${Date.now()}.jpg`;
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: fileName,
  });

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('progress-photos')
    .upload(fileName, formData, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('progress-photos')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('progress_photos')
    .insert({
      user_id: userId,
      image_url: urlData.publicUrl,
      storage_path: fileName,
      label: label || 'Progresso',
      recorded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProgressPhotos(userId, limit = 50) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getProgressPhotosByLabel(userId, label) {
  if (!userId) return [];

  const { data } = await supabase
    .from('progress_photos')
    .select('*')
    .eq('user_id', userId)
    .eq('label', label)
    .order('recorded_at', { ascending: true });

  return data || [];
}

export async function deleteProgressPhoto(photoId, userId, storagePath) {
  if (storagePath) {
    await supabase.storage.from('progress-photos').remove([storagePath]);
  }

  const { error } = await supabase
    .from('progress_photos')
    .delete()
    .eq('id', photoId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getProgressLabels(userId) {
  if (!userId) return [];

  const { data } = await supabase
    .from('progress_photos')
    .select('label')
    .eq('user_id', userId);

  const labels = [...new Set((data || []).map(p => p.label))];
  return labels.length > 0 ? labels : ['Frente', 'Lado', 'Costas'];
}

export const PHOTO_LABELS = ['Frente', 'Lado', 'Costas', 'Braco', 'Abdomen', 'Perna', 'Outro'];
