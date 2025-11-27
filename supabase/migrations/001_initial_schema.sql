-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_per_gram NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create popular_models table
CREATE TABLE IF NOT EXISTS popular_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  image_url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('Printables', 'Thingiverse', 'MakerWorld', 'Outros')),
  tag TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_config table
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on materials"
  ON materials FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access on popular_models"
  ON popular_models FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access on site_config"
  ON site_config FOR SELECT
  TO anon
  USING (true);

-- Create policies for authenticated write access (for admin)
-- Note: In production, you should implement proper authentication
-- For now, we'll allow anon to write (you can restrict this later)
CREATE POLICY "Allow anon write access on materials"
  ON materials FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon write access on popular_models"
  ON popular_models FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon write access on site_config"
  ON site_config FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert initial materials data
INSERT INTO materials (id, name, description, price_per_gram) VALUES
  ('pla', 'PLA', 'Plástico biodegradável, ideal para iniciantes', 0.08),
  ('petg', 'PETG', 'Resistente e durável, ótimo para peças funcionais', 0.12),
  ('abs', 'ABS', 'Alta resistência térmica, usado em peças automotivas', 0.10),
  ('tpu', 'TPU', 'Flexível e elástico, perfeito para peças que precisam dobrar', 0.15)
ON CONFLICT (id) DO NOTHING;

-- Insert initial popular models data
INSERT INTO popular_models (id, name, creator, image_url, source, tag, link) VALUES
  ('1', 'Dummy 13', 'Soozafone', 'https://media.printables.com/media/prints/1087519/images/8288542_e0f5c3f9-0e4a-4e88-8e0b-a2e0e9e8c8e8/thumbs/inside/1280x960/png/screenshot_2024-11-15_at_153638.webp', 'Printables', 'Novo', 'https://www.printables.com/model/1087519-dummy-13'),
  ('2', 'Flexi Rex', 'McGybeer', 'https://media.printables.com/media/prints/244943/images/2219821_a8e8e8e8-8e8e-8e8e-8e8e-8e8e8e8e8e8e/thumbs/inside/1280x960/jpg/img_20220814_194122.webp', 'Printables', 'Popular', 'https://www.printables.com/model/244943-flexi-rex-with-stronger-links'),
  ('3', 'Articulated Dragon', 'cinderwing3d', 'https://media.printables.com/media/prints/224368/images/2036551_8e8e8e8e-8e8e-8e8e-8e8e-8e8e8e8e8e8e/thumbs/inside/1280x960/jpg/20220629_091721.webp', 'Printables', 'Destaque', 'https://www.printables.com/model/224368-articulated-dragon-mcgybeer-flexi-print-in-place')
ON CONFLICT (id) DO NOTHING;

-- Insert initial contact info
INSERT INTO site_config (key, value) VALUES
  ('contact_info', '{"name": "Deivis", "phone": "5511985455659"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
