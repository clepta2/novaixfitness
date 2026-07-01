// src/services/marketplace.ts
// Servico do marketplace - NOVAIX FITNESS

import { supabase } from '../config/supabase';

interface ProductParams {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  featured?: boolean;
}

export async function getProducts({ 
  category, 
  brand, 
  search, 
  minPrice, 
  maxPrice, 
  limit = 20, 
  offset = 0, 
  featured = false 
}: ProductParams = {}) {
  let query = supabase
    .from('marketplace_products')
    .select('*, marketplace_categories(name, slug, icon, color)')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('marketplace_categories.slug', category);
  if (brand) query = query.ilike('brand', `%${brand}%`);
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`);
  if (minPrice) query = query.gte('price', minPrice);
  if (maxPrice) query = query.lte('price', maxPrice);
  if (featured) query = query.eq('is_featured', featured);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('marketplace_products')
    .select('*, marketplace_categories(name, slug, icon, color)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('marketplace_categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;
  return data || [];
}

export async function getFeaturedProducts(limit = 6) {
  return getProducts({ featured: true, limit });
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const { data } = await supabase
    .from('marketplace_products')
    .select('*, marketplace_categories(name, slug, icon, color)')
    .eq('category_id', categoryId)
    .neq('id', productId)
    .eq('is_active', true)
    .limit(limit);
  return data || [];
}

export async function getBrands() {
  const { data } = await supabase
    .from('marketplace_products')
    .select('brand')
    .eq('is_active', true)
    .not('brand', 'is', null);
  const brands = [...new Set((data || []).map((d: any) => d.brand).filter(Boolean))];
  return brands.sort();
}

export async function toggleFavorite(userId: string, productId: string) {
  if (!userId || !productId) return false;

  const { data: existing } = await supabase
    .from('marketplace_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    await supabase.from('marketplace_favorites').delete().eq('id', existing.id);
    return false;
  }

  const { error } = await supabase
    .from('marketplace_favorites')
    .insert({ user_id: userId, product_id: productId });

  if (error?.code === '23505') return true;
  return !error;
}

export async function getFavoriteIds(userId: string) {
  if (!userId) return new Set<string>();
  const { data } = await supabase
    .from('marketplace_favorites')
    .select('product_id')
    .eq('user_id', userId);
  return new Set<string>((data || []).map((f: any) => f.product_id));
}

export async function isFavorited(userId: string, productId: string) {
  if (!userId || !productId) return false;
  const { data } = await supabase
    .from('marketplace_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  return !!data;
}
