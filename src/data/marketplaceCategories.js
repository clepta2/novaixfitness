// src/data/marketplaceCategories.js
// Categorias do marketplace - NOVAIX FITNESS

import { COLORS } from '../constants/colors';

export const MARKETPLACE_CATEGORIES = [
  { slug: 'equipamentos', label: 'Equipamentos', icon: 'barbell', color: COLORS.purple },
  { slug: 'roupas', label: 'Roupas Fitness', icon: 'shirt', color: COLORS.pink },
  { slug: 'suplementos', label: 'Suplementos', icon: 'flask', color: COLORS.success },
  { slug: 'acessorios', label: 'Acessorios', icon: 'bag-handle', color: COLORS.secondary },
  { slug: 'eletronicos', label: 'Eletronicos', icon: 'watch', color: COLORS.info },
  { slug: 'utilidades', label: 'Utilidades', icon: 'water', color: COLORS.water },
  { slug: 'digitais', label: 'Produtos Digitais', icon: 'document-text', color: COLORS.slateBlue },
  { slug: 'cupons', label: 'Cupons/Parcerias', icon: 'pricetag', color: COLORS.amber },
];

export function getCategoryBySlug(slug) {
  return MARKETPLACE_CATEGORIES.find(c => c.slug === slug);
}
