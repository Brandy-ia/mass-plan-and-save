
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  brand TEXT,
  is_mass_brand BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  hours TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  original_price TEXT,
  discount TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.shopping_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mi lista',
  store_id UUID REFERENCES public.stores(id),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.shopping_list_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

GRANT SELECT ON public.stores TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stores TO authenticated;
GRANT ALL ON public.stores TO service_role;

GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopping_lists TO authenticated;
GRANT ALL ON public.shopping_lists TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shopping_list_items TO authenticated;
GRANT ALL ON public.shopping_list_items TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT USING (true);

CREATE POLICY "Stores are viewable by everyone"
ON public.stores FOR SELECT USING (true);

CREATE POLICY "Offers are viewable by everyone"
ON public.offers FOR SELECT USING (true);

CREATE POLICY "Users can manage their own lists"
ON public.shopping_lists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own list items"
ON public.shopping_list_items FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.shopping_lists
    WHERE shopping_lists.id = shopping_list_items.list_id
    AND shopping_lists.user_id = auth.uid()
  )
);

-- Insert default products
INSERT INTO public.products (name, price, image_url, category, brand, is_mass_brand) VALUES
('Arroz Costeño Superior 5kg', 26.90, '/images/arroz-costeno.webp', 'Abarrotes', 'Costeño', false),
('Aceite Primor Premium 1L', 9.50, '/images/aceite-primor.webp', 'Abarrotes', 'Primor', false),
('Leche Gloria Evaporada 400g', 4.20, '/images/leche-gloria.jfif', 'Lácteos', 'Gloria', false),
('Fideos Don Vittorio Spaghetti 500g', 3.50, '/images/fideos-vittorio.jpeg', 'Abarrotes', 'Don Vittorio', false),
('Detergente Bolívar Floral 2.6kg', 24.90, '/images/detergente-bolivar.jfif', 'Limpieza', 'Bolívar', false),
('Azúcar Rubia Bell''s 1kg', 3.90, '/images/azucar-bells.webp', 'Abarrotes', 'Bell''s', true),
('Papel Higiénico Elite x12', 19.90, '/images/papel-higienico.webp', 'Limpieza', 'Elite', false),
('Atún Florida en aceite 170g', 5.50, '/images/atun-florida.jpeg', 'Conservas', 'Florida', false),
('Jabón Bolívar', 4.90, '/images/jabon-bolivar.webp', 'Limpieza', 'Bolívar', false),
('Inca Kola 1.5L', 6.90, '/images/inka-kola.webp', 'Bebidas', 'Inca Kola', false);

-- Insert default stores
INSERT INTO public.stores (name, address, lat, lng, is_open, hours, phone) VALUES
('Mass Av. Los Próceres', 'Av. Los Próceres 234, S.J.L.', -11.9893, -77.0035, true, 'Cierra 10:00 PM', '01 234-5678'),
('Mass Canto Grande', 'Av. Canto Grande 1820, S.J.L.', -11.9712, -76.9968, true, 'Cierra 11:00 PM', '01 234-5679'),
('Mass Las Flores', 'Jr. Las Flores 456, S.J.L.', -11.9821, -77.0102, false, 'Abre 7:00 AM', '01 234-5680'),
('Mass Mariscal Cáceres', 'Av. Mariscal Cáceres 1290, S.J.L.', -11.9580, -76.9897, true, 'Cierra 10:00 PM', '01 234-5681'),
('Mass Bayóvar', 'Av. Bayóvar 905, S.J.L.', -11.9445, -76.9810, true, 'Cierra 9:30 PM', '01 234-5682');

-- Insert default offers
INSERT INTO public.offers (product_id, title, description, price, original_price, discount)
SELECT id, name || ' - Oferta', 'Precio especial por tiempo limitado', 
  CASE name
    WHEN 'Aceite Primor Premium 1L' THEN 'S/ 8.50'
    WHEN 'Arroz Costeño Superior 5kg' THEN 'S/ 23.90'
    WHEN 'Leche Gloria Evaporada 400g' THEN 'S/ 3.80'
    WHEN 'Detergente Bolívar Floral 2.6kg' THEN 'S/ 21.90'
    WHEN 'Inca Kola 1.5L' THEN 'S/ 5.50'
    WHEN 'Atún Florida en aceite 170g' THEN 'S/ 4.90'
  END,
  CASE name
    WHEN 'Aceite Primor Premium 1L' THEN 'S/ 10.90'
    WHEN 'Arroz Costeño Superior 5kg' THEN 'S/ 28.50'
    WHEN 'Leche Gloria Evaporada 400g' THEN 'S/ 4.50'
    WHEN 'Detergente Bolívar Floral 2.6kg' THEN 'S/ 26.90'
    WHEN 'Inca Kola 1.5L' THEN 'S/ 6.90'
    WHEN 'Atún Florida en aceite 170g' THEN 'S/ 6.20'
  END,
  CASE name
    WHEN 'Aceite Primor Premium 1L' THEN '-22%'
    WHEN 'Arroz Costeño Superior 5kg' THEN '-16%'
    WHEN 'Leche Gloria Evaporada 400g' THEN '-15%'
    WHEN 'Detergente Bolívar Floral 2.6kg' THEN '-19%'
    WHEN 'Inca Kola 1.5L' THEN '-20%'
    WHEN 'Atún Florida en aceite 170g' THEN '-21%'
  END
FROM public.products
WHERE name IN ('Aceite Primor Premium 1L', 'Arroz Costeño Superior 5kg', 'Leche Gloria Evaporada 400g', 'Detergente Bolívar Floral 2.6kg', 'Inca Kola 1.5L', 'Atún Florida en aceite 170g');
