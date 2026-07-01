import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { supabase } from '../../config/supabase';
import { Button } from '../ui/Button';
import { COMPOSER } from '../../data/socialTexts';
import { validateContent } from '../../middleware/communityGuard';

export default function CreatePostModal({ visible, onClose, onSubmit, userId }) {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(COMPOSER.permissionTitle, COMPOSER.permissionMessage);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async (userId) => {
    if (!imageUri) return null;
    setUploading(true);
    try {
      const fileName = `${userId}/posts/${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append('file', { uri: imageUri, type: 'image/jpeg', name: fileName });
      const { error: uploadError } = await supabase.storage.from('posts').upload(fileName, formData, { contentType: 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('posts').getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (err) {
      Alert.alert(COMPOSER.errorTitle, COMPOSER.uploadError + err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && !imageUri) {
      Alert.alert(COMPOSER.errorTitle, COMPOSER.emptyError);
      return;
    }
    if (content.trim()) {
      const { clean, masked, violations } = validateContent(content);
      if (!clean) {
        Alert.alert(
          'Conteúdo inadequado',
          'Seu post contém palavras proibidas. Por favor, mantenha o respeito na comunidade.',
        );
        if (violations.length > 0) setContent(masked);
        return;
      }
    }
    setLoading(true);
    const imageUrl = await uploadImage(userId);
    onSubmit?.({ content, image: imageUrl });
    setContent('');
    setImageUri(null);
    setLoading(false);
    onClose();
  };

  const removeImage = () => setImageUri(null);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{COMPOSER.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder={COMPOSER.placeholder} placeholderTextColor={COLORS.textMuted} value={content} onChangeText={setContent} multiline textAlignVertical="top" />

          {imageUri && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
                <Ionicons name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.options}>
            <TouchableOpacity style={styles.optionBtn} onPress={handlePickImage} disabled={uploading}>
              {uploading ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Ionicons name="image-outline" size={24} color={COLORS.primary} />}
              <Text style={styles.optionText}>{COMPOSER.photoLabel}</Text>
            </TouchableOpacity>
          </View>

          <Button title={COMPOSER.buttonLabel} onPress={() => handleSubmit()} loading={loading || uploading} disabled={(!content.trim() && !imageUri) || uploading} />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.xl, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: COLORS.textTitle },
  input: { height: 120, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, color: COLORS.textTitle, fontFamily: 'Inter_400Regular', fontSize: 16, marginBottom: SPACING.lg, borderWidth: 1, borderColor: COLORS.border },
  imagePreview: { position: 'relative', marginBottom: SPACING.lg },
  previewImage: { width: '100%', height: 180, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background },
  removeBtn: { position: 'absolute', top: 8, right: 8 },
  options: { flexDirection: 'row', gap: SPACING.xl, marginBottom: SPACING.xl },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle },
});