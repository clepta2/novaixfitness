// src/components/social/GiftPanel.js
// Painel de presentes para lives

import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useAuth } from '../../context/AuthContext';
import { getWallet, getGiftCatalog, sendGift } from '../../services/virtualGifting';

export default function GiftPanel({ receiverId, liveId, onClose }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  useEffect(() => { loadData(); }, [user?.id]);

  const loadData = async () => {
    const [w, c] = await Promise.all([
      getWallet(user.id),
      getGiftCatalog(),
    ]);
    setWallet(w);
    setCatalog(c);
    setLoading(false);
  };

  const handleSendGift = async (gift) => {
    if (wallet.balance < gift.coin_value) {
      Alert.alert('Saldo insuficiente', 'Compre mais coins para enviar presentes.');
      return;
    }

    setSending(gift.id);
    try {
      const result = await sendGift(user.id, receiverId, gift.id, liveId);
      setWallet(prev => ({ ...prev, balance: prev.balance - gift.coin_value }));
      Alert.alert('Presente enviado!', `${gift.emoji} ${gift.name} enviado!`);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
    setSending(null);
  };

  if (loading) return <View style={styles.loading}><Text style={styles.loadingText}>Carregando...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ENVIAR PRESENTE</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.walletBar}>
        <Ionicons name="wallet" size={18} color={COLORS.primary} />
        <Text style={styles.balance}>{wallet?.balance || 0} coins</Text>
        <TouchableOpacity style={styles.buyBtn}>
          <Ionicons name="add-circle" size={16} color={COLORS.primary} />
          <Text style={styles.buyText}>Comprar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.giftsScroll}>
        {catalog.map((gift) => (
          <TouchableOpacity
            key={gift.id}
            style={[styles.giftCard, sending === gift.id && styles.giftSending]}
            onPress={() => handleSendGift(gift)}
            disabled={sending !== null}
          >
            <Text style={styles.giftEmoji}>{gift.emoji}</Text>
            <Text style={styles.giftName}>{gift.name}</Text>
            <View style={styles.giftValue}>
              <Ionicons name="diamond" size={10} color={COLORS.primary} />
              <Text style={styles.giftCoins}>{gift.coin_value}</Text>
            </View>
            {gift.rarity !== 'common' && (
              <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(gift.rarity) }]}>
                <Text style={styles.rarityText}>{gift.rarity.toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function getRarityColor(rarity) {
  const colors = { rare: COLORS.info, epic: COLORS.purple, legendary: COLORS.star };
  return colors[rarity] || COLORS.textMuted;
}

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, paddingBottom: 30 },
  loading: { padding: SPACING.xl, alignItems: 'center' },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textMuted },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  walletBar: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
  balance: { flex: 1, fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.primary },
  buyBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  buyText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.primary },
  giftsScroll: { flexGrow: 0 },
  giftCard: { width: 90, alignItems: 'center', padding: SPACING.md, marginRight: SPACING.sm, backgroundColor: COLORS.surfaceElevated, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  giftSending: { opacity: 0.5 },
  giftEmoji: { fontSize: 32, marginBottom: SPACING.xs },
  giftName: { fontFamily: 'Inter_500Medium', fontSize: 11, color: COLORS.textTitle, marginBottom: 4 },
  giftValue: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  giftCoins: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.primary },
  rarityBadge: { position: 'absolute', top: -6, right: -6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  rarityText: { fontFamily: 'Montserrat_700Bold', fontSize: 7, color: COLORS.textTitle },
});
