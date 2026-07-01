// app/progress/initialPhoto.js
// Foto inicial para comparação

import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../src/constants/spacing';
import { supabase } from '../../src/config/supabase';
import { useAuth } from '../../src/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const POSES = [
  { id: 'front', label: 'Frente', icon: 'person' },
  { id: 'side', label: 'Lado', icon: 'body' },
  { id: 'back', label: 'Costas', icon: 'person' },
];

export default function InitialPhotoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [photos, setPhotos] = useState({});
  const [saved, setSaved] = useState(false);

  const takePhoto = async (poseId) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão', 'Precisamos de acesso à câmera');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true, aspect: [3, 4] });
    if (!result.canceled) {
      setPhotos({ ...photos, [poseId]: result.assets[0].uri });
    }
  };

  const savePhotos = async () => {
    if (!user?.id) return;
    try {
      const photoData = {};
      for (const [poseId, uri] of Object.entries(photos)) {
        const fileName = `${user.id}/${poseId}_${Date.now()}.jpg`;
        const response = await fetch(uri);
        const blob = await response.blob();
        const { data } = await supabase.storage.from('progress-photos').upload(fileName, blob);
        if (data) photoData[poseId] = supabase.storage.from('progress-photos').getPublicUrl(data.path).data.publicUrl;
      }
      await supabase.from('initial_photos').insert({ user_id: user.id, front_url: photoData.front, side_url: photoData.side, back_url: photoData.back });
      setSaved(true);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar as fotos');
    }
  };

  if (saved) {
    return (
      <View style={styles.completedContainer}>
        <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
        <Text style={styles.completedTitle}>FOTOS SALVAS!</Text>
        <Text style={styles.completedSubtitle}>Compare sua evolução em 30, 60 e 90 dias</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>FOTO INICIAL</Text>
      <Text style={styles.subtitle}>Tire fotos para comparar sua evolução</Text>

      <View style={styles.photoGrid}>
        {POSES.map((pose) => (
          <TouchableOpacity key={pose.id} style={styles.photoCard} onPress={() => takePhoto(pose.id)}>
            {photos[pose.id] ? (
              <Image source={{ uri: photos[pose.id] }} style={styles.photoImage} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="camera" size={32} color={COLORS.textMuted} />
                <Text style={styles.photoLabel}>{pose.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text style={styles.infoText}>Fotos em pé, com roupa de treino, boa iluminação</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, Object.keys(photos).length < 1 && styles.buttonDisabled]}
        onPress={savePhotos}
        disabled={Object.keys(photos).length < 1}
      >
        <Text style={styles.buttonText}>SALVAR FOTOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.skipButton} onPress={() => router.back()}>
        <Text style={styles.skipText}>Pular por agora</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 54 : 40 },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: COLORS.textTitle, marginBottom: SPACING.sm },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginBottom: SPACING.xl },
  photoGrid: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
  photoCard: { flex: 1, aspectRatio: 3/4, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textMuted, marginTop: SPACING.sm },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, backgroundColor: COLORS.primary + '10', borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xl },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.primary, flex: 1 },
  button: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginBottom: SPACING.md },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.background },
  skipButton: { alignItems: 'center', paddingVertical: SPACING.md },
  skipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted },
  completedContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  completedTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: COLORS.textTitle, marginTop: SPACING.xl },
  completedSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted, marginTop: SPACING.sm, textAlign: 'center' },
});
