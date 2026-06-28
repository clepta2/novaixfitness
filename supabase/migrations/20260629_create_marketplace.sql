-- Marketplace - NOVAIX FITNESS
-- Migration: criar tabelas do marketplace

-- Categorias de produtos
CREATE TABLE IF NOT EXISTS marketplace_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Produtos
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES marketplace_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  brand TEXT,
  image_url TEXT,
  affiliate_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  stock_type TEXT DEFAULT 'physical' CHECK (stock_type IN ('physical', 'digital', 'coupon')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Favoritos
CREATE TABLE IF NOT EXISTS marketplace_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- RLS
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads categories" ON marketplace_categories FOR SELECT USING (true);
CREATE POLICY "Anyone reads active products" ON marketplace_products FOR SELECT USING (is_active = true);
CREATE POLICY "Users read own favorites" ON marketplace_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add favorites" ON marketplace_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove favorites" ON marketplace_favorites FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON marketplace_products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON marketplace_products(brand);
CREATE INDEX IF NOT EXISTS idx_products_featured ON marketplace_products(is_active, is_featured);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON marketplace_favorites(user_id);

-- Dados iniciais das categorias
INSERT INTO marketplace_categories (name, slug, icon, color, sort_order) VALUES
  ('Equipamentos', 'equipamentos', 'barbell', '#6366F1', 1),
  ('Roupas Fitness', 'roupas', 'shirt', '#EC4899', 2),
  ('Suplementos', 'suplementos', 'flask', '#00E676', 3),
  ('Acessorios', 'acessorios', 'bag-handle', '#FF6B35', 4),
  ('Eletronicos', 'eletronicos', 'watch', '#3B82F6', 5),
  ('Utilidades', 'utilidades', 'water', '#06B6D4', 6),
  ('Produtos Digitais', 'digitais', 'document-text', '#8B5CF6', 7),
  ('Cupons/Parcerias', 'cupons', 'pricetag', '#F59E0B', 8)
ON CONFLICT (slug) DO NOTHING;
