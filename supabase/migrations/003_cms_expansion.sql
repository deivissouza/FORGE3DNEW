-- Add max_print_size to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS max_print_size DECIMAL(10,2) DEFAULT 250.00;

-- Create content_sections table for Hero, How it Works, etc.
CREATE TABLE IF NOT EXISTS content_sections (
  id TEXT PRIMARY KEY, -- e.g., 'hero', 'how_it_works', 'materials_intro'
  title TEXT,
  subtitle TEXT,
  content JSONB, -- Flexible content storage
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT, -- e.g., 'Cosplay', 'Engenharia', 'Decoração'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read content_sections" ON content_sections FOR SELECT USING (true);
CREATE POLICY "Public can read portfolio_items" ON portfolio_items FOR SELECT USING (true);

-- Admin write access (simplified for MVP, assuming anon key with logic in app or service role)
-- Ideally, we should use authenticated users, but for this MVP we are using the same pattern as before.
CREATE POLICY "Anon can update content_sections" ON content_sections FOR UPDATE USING (true);
CREATE POLICY "Anon can insert content_sections" ON content_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can delete content_sections" ON content_sections FOR DELETE USING (true);

CREATE POLICY "Anon can update portfolio_items" ON portfolio_items FOR UPDATE USING (true);
CREATE POLICY "Anon can insert portfolio_items" ON portfolio_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can delete portfolio_items" ON portfolio_items FOR DELETE USING (true);

-- Seed Data for Hero
INSERT INTO content_sections (id, title, subtitle, image_url, button_text, button_link)
VALUES (
  'hero',
  'Impressão 3D Sob Demanda',
  'Transforme suas ideias em realidade com alta precisão e materiais premium.',
  'https://images.unsplash.com/photo-1631541909061-71e349d1f203?q=80&w=2000&auto=format&fit=crop',
  'Quero Imprimir',
  '#order-section'
) ON CONFLICT (id) DO NOTHING;

-- Seed Data for How It Works
INSERT INTO content_sections (id, title, subtitle, content)
VALUES (
  'how_it_works',
  'Como Funciona',
  'Do arquivo digital à peça física em poucos passos.',
  '[
    {"title": "Envie seu Arquivo", "description": "Faça upload do seu modelo 3D (STL, OBJ) ou cole o link.", "icon": "Upload"},
    {"title": "Orçamento Instantâneo", "description": "Nossa IA calcula o preço na hora baseado no peso e tempo.", "icon": "Zap"},
    {"title": "Produção & Envio", "description": "Imprimimos com qualidade e enviamos em até 48h.", "icon": "Truck"}
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;
