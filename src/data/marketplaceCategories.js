// src/data/marketplaceCategories.js
// Categorias do marketplace - NOVAIX FITNESS

export const MARKETPLACE_CATEGORIES = [
  { slug: 'equipamentos', label: 'Equipamentos', icon: 'barbell', color: '#6366F1' },
  { slug: 'roupas', label: 'Roupas Fitness', icon: 'shirt', color: '#EC4899' },
  { slug: 'suplementos', label: 'Suplementos', icon: 'flask', color: '#00E676' },
  { slug: 'acessorios', label: 'Acessorios', icon: 'bag-handle', color: '#FF6B35' },
  { slug: 'eletronicos', label: 'Eletronicos', icon: 'watch', color: '#3B82F6' },
  { slug: 'utilidades', label: 'Utilidades', icon: 'water', color: '#06B6D4' },
  { slug: 'digitais', label: 'Produtos Digitais', icon: 'document-text', color: '#8B5CF6' },
  { slug: 'cupons', label: 'Cupons/Parcerias', icon: 'pricetag', color: '#F59E0B' },
];

export function getCategoryBySlug(slug) {
  return MARKETPLACE_CATEGORIES.find(c => c.slug === slug);
}
