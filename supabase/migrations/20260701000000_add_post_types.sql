-- Adiciona tipos de post e suporte a fotos de progresso
ALTER TABLE posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'text';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS second_image_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS filter_applied TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reactions_count INTEGER DEFAULT 0;
