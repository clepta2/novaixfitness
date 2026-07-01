import React from 'react';
// src/components/marketplace/ShareProduct.js
// Compartilhar produto - NOVAIX FITNESS

import { Share, Alert } from 'react-native';
import { Linking } from 'expo-linking';

const SAFE_URL_PATTERN = /^https?:\/\/.+/;

function getShareMessage(product: any) {
  if (!product) return '';
  const price = product.price ? ` - R$ ${product.price.toFixed(2)}` : '';
  const url = product.affiliate_url && SAFE_URL_PATTERN.test(product.affiliate_url) ? product.affiliate_url : '';
  return `${product.name || 'Produto'}${price}${url ? '\n' + url : ''}`;
}

export async function shareProduct(product: any) {
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

export async function shareToWhatsApp(product: any) {
  if (!product) return;
  const message = getShareMessage(product);
  const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('WhatsApp nao instalado');
  }
}

export async function shareToInstagram(product: any) {
  if (!product) return;
  try {
    await Share.share({ message: getShareMessage(product), title: product.name || 'Produto' });
  } catch {}
}
