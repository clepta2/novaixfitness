// Hook de lógica de fotos de progresso (carregar, upload, deletar, comparar)

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import {
  pickImage,
  takePhoto,
  uploadProgressPhoto,
  getProgressPhotos,
  deleteProgressPhoto,
  PHOTO_LABELS,
} from '../services/progress-photos';

interface ProgressPhoto {
  id: string;
  label: string;
  storage_path: string;
  url?: string;
  created_at?: string;
  [key: string]: unknown;
}

interface UseProgressPhotosReturn {
  photos: ProgressPhoto[];
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  showPicker: boolean;
  setShowPicker: (val: boolean) => void;
  loading: boolean;
  selectedPhoto: ProgressPhoto | null;
  setSelectedPhoto: (photo: ProgressPhoto | null) => void;
  compareMode: boolean;
  comparePhotos: ProgressPhoto[];
  filteredPhotos: ProgressPhoto[];
  allLabels: string[];
  handlePickImage: (useCamera: boolean) => Promise<void>;
  handleDelete: (photo: ProgressPhoto) => void;
  toggleCompare: (photo: ProgressPhoto) => void;
  cancelCompare: () => void;
}

export function useProgressPhotos(): UseProgressPhotosReturn {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>('Frente');
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [comparePhotos, setComparePhotos] = useState<any[]>([]);

  const loadPhotos = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      const data = await getProgressPhotos(user.id);
      setPhotos(data);
    } catch (err) {
      if (__DEV__) console.error('Erro ao carregar fotos:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  const handlePickImage = useCallback(async (useCamera: boolean): Promise<void> => {
    if (!user?.id) return;
    try {
      const image = useCamera ? await takePhoto() : await pickImage();
      if (!image) return;
      await uploadProgressPhoto(user.id, image.uri, selectedLabel);
      Alert.alert('Sucesso', 'Foto salva!');
      await loadPhotos();
    } catch (err) {
      Alert.alert('Erro', (err as Error).message || 'Não foi possível salvar a foto.');
    } finally {
      setShowPicker(false);
    }
  }, [user?.id, selectedLabel, loadPhotos]);

  const handleDelete = useCallback((photo: ProgressPhoto): void => {
    if (!user?.id) return;
    Alert.alert('Excluir foto', 'Remover esta foto permanentemente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deleteProgressPhoto(photo.id, user.id, photo.storage_path);
          await loadPhotos();
        },
      },
    ]);
  }, [user?.id, loadPhotos]);

  const toggleCompare = useCallback((photo: ProgressPhoto): void => {
    setCompareMode((prev) => {
      if (!prev) {
        setComparePhotos([photo]);
        return true;
      }
      return prev;
    });
    setComparePhotos((prev) => {
      if (!compareMode) return [photo];
      return prev.length >= 2 ? [photo] : [...prev, photo];
    });
  }, [compareMode]);

  const filteredPhotos: ProgressPhoto[] = photos.filter(p => p.label === selectedLabel);
  const labels: string[] = [...new Set(photos.map(p => p.label))];
  const allLabels: string[] = [...new Set([...PHOTO_LABELS, ...labels])];

  const cancelCompare = useCallback((): void => {
    setCompareMode(false);
    setComparePhotos([]);
  }, []);

  return {
    photos,
    selectedLabel,
    setSelectedLabel,
    showPicker,
    setShowPicker,
    loading,
    selectedPhoto,
    setSelectedPhoto,
    compareMode,
    comparePhotos,
    filteredPhotos,
    allLabels,
    handlePickImage,
    handleDelete,
    toggleCompare,
    cancelCompare,
  };
}
