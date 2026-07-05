// src/components/social/StoryCreateModal.js
// Modal de criação de story

import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from 'expo-crypto';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { Button } from '../ui/Button';
import { useI18n } from '../../i18n';

export default function StoryCreateModal({ visible, onClose, userId }: { visible: boolean; onClose: () => void; userId?: string }) {
  const { t } = useI18n();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [9, 16], quality: 0.8 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handlePublish = async () => {
    if (!imageUri) { Alert.alert(t('common.error'), t('social.storySelectImageError')); return; }
    setLoading(true);
    try {
      const uuid = Crypto.randomUUID();
      const fileName = `${userId}/stories/${uuid}.jpg`;
      const formData = new FormData();
      formData.append('file', { uri: imageUri, type: 'image/jpeg', name: fileName } as any);
      const { error: uploadError } = await supabase.storage.from('stories').upload(fileName, formData, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('stories').getPublicUrl(fileName);

      await supabase.from('stories').insert({
        user_id: userId,
        image_url: urlData.publicUrl,
        caption: caption.trim() || null,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      setImageUri(null);
      setCaption('');
      onClose();
    } catch (err: any) {
      Alert.alert(t('common.error'), t('social.storyPublishError', { error: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={styles.title}>Novo Story</Text>

          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
              <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)}>
                <Ionicons name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.pickOptions}>
              <TouchableOpacity style={styles.pickBtn} onPress={handleTakePhoto}>
                <Ionicons name="camera" size={32} color={COLORS.primary} />
                <Text style={styles.pickText}>Câmera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pickBtn} onPress={handlePickImage}>
                <Ionicons name="images" size={32} color={COLORS.primary} />
                <Text style={styles.pickText}>Galeria</Text>
              </TouchableOpacity>
            </View>
          )}

          {imageUri && (
            <TextInput
              style={styles.captionInput}
              placeholder="Adicione uma legenda..."
              placeholderTextColor={COLORS.textMuted}
              value={caption}
              onChangeText={setCaption}
              maxLength={200}
            />
          )}

          <Button title="PUBLICAR STORY" onPress={handlePublish} loading={loading} disabled={!imageUri || loading} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle, marginBottom: SPACING.xl },
  previewContainer: { position: 'relative', marginBottom: SPACING.lg },
  preview: { width: '100%', height: 300, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background },
  removeBtn: { position: 'absolute', top: 8, right: 8 },
  pickOptions: { flexDirection: 'row', gap: SPACING.xl, justifyContent: 'center', marginBottom: SPACING.xl },
  pickBtn: { alignItems: 'center', gap: SPACING.sm, padding: SPACING.xl, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  pickText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: COLORS.textTitle },
  captionInput: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 14, marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.border },
});
