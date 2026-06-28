// src/components/marketplace/ShareProduct.js
// Compartilhar produto - NOVAIX FITNESS

import { Share, Alert, Platform } from 'react-native';
import { Linking } from 'expo-linking';

export async function shareProduct(product) {
  const message = `${product.name} - R$ ${product.price?.toFixed(2)}\n${product.affiliate_url || ''}`;

  try {
    const result = await Share.share({
      message,
      title: product.name,
      url: product.affiliate_url,
    });
    return result.action === Share.sharedAction;
  } catch {
    return false;
  }
}

export async function shareToWhatsApp(product) {
  const message = `${product.name} - R$ ${product.price?.toFixed(2)}\n${product.affiliate_url || ''}`;
  const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('WhatsApp nao instalado');
  }
}

export async function shareToInstagram(product) {
  const message = `${product.name} - R$ ${product.price?.toFixed(2)}\n${product.affiliate_url || ''}`;
  try {
    await Share.share({ message, title: product.name });
  } catch {}
}
