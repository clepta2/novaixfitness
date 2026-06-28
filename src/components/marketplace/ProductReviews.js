// src/components/marketplace/ProductReviews.js
// Sistema de avaliacoes do produto - NOVAIX FITNESS

import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const MAX_COMMENT_LENGTH = 500;

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('marketplace_reviews')
        .select('*, profiles(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(20);
      setReviews(data || []);
    }
    load();
  }, [productId]);

  const handleSubmit = async () => {
    if (!user?.id || !comment.trim()) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_reviews')
        .insert({ product_id: productId, user_id: user.id, rating, comment: comment.trim().slice(0, MAX_COMMENT_LENGTH) })
        .select('*, profiles(name)')
        .single();
      if (error) {
        if (error.code === '23505') Alert.alert('Aviso', 'Voce ja avaliou este produto');
        else Alert.alert('Erro', 'Nao foi possivel enviar sua avaliacao');
        return;
      }
      if (data) {
        setReviews(prev => [data, ...prev]);
        setComment('');
        setRating(5);
        setShowForm(false);
      }
    } catch { Alert.alert('Erro', 'Falha ao enviar avaliacao'); }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AVALIACOES ({reviews.length})</Text>
        {reviews.length > 0 && (
          <View style={styles.avgRow}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.avgText}>{avgRating}</Text>
          </View>
        )}
      </View>

      {user?.id && (
        <>
          {!showForm ? (
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowForm(true)}>
              <Ionicons name="create-outline" size={16} color={COLORS.primary} />
              <Text style={styles.addBtnText}>Escrever avaliacao</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.form}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={22} color="#F59E0B" />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Deixe seu comentario..."
                placeholderTextColor={COLORS.textMuted}
                value={comment}
                onChangeText={(t) => setComment(t.slice(0, MAX_COMMENT_LENGTH))}
                multiline
                maxLength={MAX_COMMENT_LENGTH}
              />
              <Text style={styles.charCount}>{comment.length}/{MAX_COMMENT_LENGTH}</Text>
              <View style={styles.formActions}>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting || !comment.trim()}>
                  <Text style={styles.submitText}>{submitting ? '...' : 'Enviar'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}

      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewerName}>{review.profiles?.name || 'Anonimo'}</Text>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons key={i} name={i <= review.rating ? 'star' : 'star-outline'} size={12} color="#F59E0B" />
              ))}
            </View>
          </View>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString('pt-BR')}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textTitle, letterSpacing: 0.5 },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avgText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginBottom: SPACING.md },
  addBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  form: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  stars: { flexDirection: 'row', gap: 4, marginBottom: SPACING.sm },
  input: { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textTitle, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm, minHeight: 60, textAlignVertical: 'top' },
  charCount: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, textAlign: 'right', marginTop: 2 },
  formActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, marginTop: SPACING.sm },
  cancelText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  submitBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  submitText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: COLORS.background },
  reviewCard: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  reviewerName: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textTitle },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewComment: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, lineHeight: 18 },
  reviewDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: COLORS.textMuted, marginTop: SPACING.xs },
});
