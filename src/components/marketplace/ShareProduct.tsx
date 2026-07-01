// src/components/marketplace/ShareProduct.tsx
// Compartilhar produto - NOVAIX FITNESS

import { Share, Alert } from 'react-native';
import { Linking } from 'expo-linking';

const SAFE_URL_PATTERN = /^https?:\/\/.+/;

interface ShareableProduct {
  name?: string;
  price?: number;
  affiliate_url?: string;
}

function getShareMessage(product: ShareableProduct): string {
  if (!product) return '';
  const price = product.price ? ` - R$ ${product.price.toFixed(2)}` : '';
  const url = product.affiliate_url && SAFE_URL_PATTERN.test(product.affiliate_url) ? product.affiliate_url : '';
  return `${product.name || 'Produto'}${price}${url ? '\n' + url : ''}`;
}

export async function shareProduct(product: ShareableProduct): Promise<boolean> {
  if (!product) return false;
  try {
    const result = await Share.share({
      message: getShareMessage(product),
      title: product.name || 'Produto',
    });
    return result.action === Share.sharedAction;
  } catch {
    return false;
  }
}

export async function shareToWhatsApp(product: ShareableProduct): Promise<void> {
  if (!product) return;
  const message = getShareMessage(product);
  const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('WhatsApp nao instalado');
  }
}

export async function shareToInstagram(product: ShareableProduct): Promise<void> {
  if (!product) return;
  try {
    await Share.share({ message: getShareMessage(product), title: product.name || 'Produto' });
  } catch {}
}
