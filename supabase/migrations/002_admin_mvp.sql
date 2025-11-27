-- Admin MVP Tables
-- Drop existing tables if they exist
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS featured_items CASCADE;

-- Site Settings (pricing, company info, etc)
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  -- Pricing
  pla_price_per_gram DECIMAL(10,2) DEFAULT 0.15,
  petg_price_per_gram DECIMAL(10,2) DEFAULT 0.20,
  profit_margin DECIMAL(5,2) DEFAULT 30.00,
  machine_cost_per_hour DECIMAL(10,2) DEFAULT 5.00,
  minimum_order DECIMAL(10,2) DEFAULT 15.00,
  delivery_time TEXT DEFAULT 'Entrega a combinar',
  
  -- Company Info
  company_name TEXT DEFAULT 'Forge3D',
  company_email TEXT DEFAULT 'contato@forge3d.com',
  company_phone TEXT DEFAULT '5511985455659',
  company_address TEXT DEFAULT 'São Paulo, SP',
  
  -- WhatsApp message template
  whatsapp_message_template TEXT DEFAULT 'Olá! Gostaria de um orçamento para impressão 3D.',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Colors available for printing
CREATE TABLE colors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  material TEXT NOT NULL CHECK (material IN ('PLA', 'PETG')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured items for homepage
CREATE TABLE featured_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  tag TEXT DEFAULT 'Novo',
  description TEXT,
  weight_estimate DECIMAL(10,2) DEFAULT 50.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public read, anon write for MVP - secure later)
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Anon can update settings" ON site_settings FOR UPDATE USING (true);
CREATE POLICY "Anon can insert settings" ON site_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read colors" ON colors FOR SELECT USING (true);
CREATE POLICY "Anon can manage colors" ON colors FOR ALL USING (true);

CREATE POLICY "Public can read featured items" ON featured_items FOR SELECT USING (is_active = true);
CREATE POLICY "Anon can manage featured items" ON featured_items FOR ALL USING (true);

-- Insert default settings
INSERT INTO site_settings (id) VALUES ('default');

-- Insert default colors
INSERT INTO colors (id, name, hex, material) VALUES
  ('pla-white', 'Branco', '#FFFFFF', 'PLA'),
  ('pla-black', 'Preto', '#000000', 'PLA'),
  ('pla-red', 'Vermelho', '#EF4444', 'PLA'),
  ('pla-blue', 'Azul', '#3B82F6', 'PLA'),
  ('pla-green', 'Verde', '#10B981', 'PLA'),
  ('pla-yellow', 'Amarelo', '#FBBF24', 'PLA'),
  ('petg-white', 'Branco', '#FFFFFF', 'PETG'),
  ('petg-black', 'Preto', '#000000', 'PETG'),
  ('petg-transparent', 'Transparente', '#E0E0E0', 'PETG'),
  ('petg-blue', 'Azul', '#3B82F6', 'PETG');

-- Insert sample featured items
INSERT INTO featured_items (id, name, link, image_url, category, tag, description, weight_estimate, display_order) VALUES
  (
    'item-1',
    'Dummy Articulado',
    'https://www.printables.com/model/13',
    'https://picsum.photos/seed/dummy/400/300',
    'Articulado',
    'Popular',
    'Boneco articulado perfeito para poses e fotos',
    45.00,
    1
  ),
  (
    'item-2',
    'Vaso Paramétrico',
    'https://www.thingiverse.com/thing:123',
    'https://picsum.photos/seed/vase/400/300',
    'Decoração',
    'Novo',
    'Vaso moderno com design geométrico',
    60.00,
    2
  ),
  (
    'item-3',
    'Suporte de Celular',
    'https://www.printables.com/model/456',
    'https://picsum.photos/seed/phone/400/300',
    'Utilitário',
    'Útil',
    'Suporte ajustável para mesa',
    30.00,
    3
  ),
  (
    'item-4',
    'Engrenagem Mecânica',
    'https://www.thingiverse.com/thing:789',
    'https://picsum.photos/seed/gear/400/300',
    'Mecânico',
    'Técnico',
    'Engrenagem funcional para projetos',
    25.00,
    4
  ),
  (
    'item-5',
    'Porta-Chaves',
    'https://www.printables.com/model/321',
    'https://picsum.photos/seed/keychain/400/300',
    'Acessório',
    'Prático',
    'Porta-chaves personalizável',
    15.00,
    5
  ),
  (
    'item-6',
    'Organizador de Cabos',
    'https://www.thingiverse.com/thing:654',
    'https://picsum.photos/seed/cable/400/300',
    'Organização',
    'Essencial',
    'Organize seus cabos com estilo',
    20.00,
    6
  );
