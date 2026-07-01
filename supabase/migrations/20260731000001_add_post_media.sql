-- Adiciona colunas de midia avancada aos posts
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS mood TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT;

-- Valida mood contra tipos suportados
ALTER TABLE posts
  ADD CONSTRAINT posts_mood_check
  CHECK (mood IS NULL OR mood IN (
    'Motivado', 'Feliz', 'Cansado', 'Ansioso', 'Orgulhoso', 'Determinado'
  ));

-- Limite de 10 imagens por carousel
ALTER TABLE posts
  ADD CONSTRAINT posts_image_urls_check
  CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 10);
