/*
# MARESA Parts Portal: catalog, service centers, editable landing sections and stock

1. New tables
- `user_roles`: links a signed-in Supabase user to a protected role (`admin` or `viewer`).
- `site_sections`: editable public landing-page content, including title, body, CTA labels, images and sort order.
- `brands`: vehicle brands represented by the portal.
- `vehicles`: vehicle models and versions used to filter compatible parts.
- `parts`: original and approved replacement parts, with category, part number, price and compatibility metadata.
- `service_centers`: MARESA service and parts centers with city, province, address, coordinates and contact information.
- `inventory`: stock of each part at each service center, including quantity, reorder threshold and last update.

2. Security
- RLS is enabled on every new table.
- Public visitors can read only active landing sections, active brands, active vehicles, active parts and active service centers.
- Only authenticated users with `user_roles.role = 'admin'` can create, update or delete catalog, content, center and inventory records.
- Role changes cannot be made through normal table updates. The first authenticated account can claim initial admin access only when no administrator exists; all later role changes require a protected SQL function.
- Inventory writes are restricted to administrators, so stock cannot be changed from the public website.

3. Important notes
- This is a single MARESA tenant; rows are intentionally shared across the public catalog.
- The frontend must not treat browser state as authorization. All administrator checks are repeated by RLS.
- Seed content and starter catalog data are inserted only when absent and can be replaced from the admin screen.
*/

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT '',
  cta_href text NOT NULL DEFAULT '#',
  image_url text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  name text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'SUV',
  model_year_start integer,
  model_year_end integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_number text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12,2),
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  province text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL DEFAULT '',
  latitude numeric(10,7),
  longitude numeric(10,7),
  hours text NOT NULL DEFAULT 'Lunes a viernes, 08:00 a 17:30',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id uuid NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
  service_center_id uuid NOT NULL REFERENCES public.service_centers(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reorder_level integer NOT NULL DEFAULT 2 CHECK (reorder_level >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (part_id, service_center_id)
);

CREATE INDEX IF NOT EXISTS vehicles_brand_id_idx ON public.vehicles(brand_id);
CREATE INDEX IF NOT EXISTS inventory_part_id_idx ON public.inventory(part_id);
CREATE INDEX IF NOT EXISTS inventory_center_id_idx ON public.inventory(service_center_id);
CREATE INDEX IF NOT EXISTS service_centers_province_idx ON public.service_centers(province);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.create_default_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'viewer')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_maresa_role ON auth.users;
CREATE TRIGGER on_auth_user_created_maresa_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_user_role();

CREATE OR REPLACE FUNCTION public.claim_initial_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  UPDATE public.user_roles SET role = 'admin', updated_at = now() WHERE user_id = auth.uid();
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
REVOKE ALL ON FUNCTION public.create_default_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_initial_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_initial_admin() TO authenticated;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_role" ON public.user_roles;
CREATE POLICY "users_read_own_role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "public_read_sections" ON public.site_sections;
CREATE POLICY "public_read_sections" ON public.site_sections FOR SELECT TO anon, authenticated USING (is_visible = true OR public.is_admin());
DROP POLICY IF EXISTS "admin_insert_sections" ON public.site_sections;
CREATE POLICY "admin_insert_sections" ON public.site_sections FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_sections" ON public.site_sections;
CREATE POLICY "admin_update_sections" ON public.site_sections FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_sections" ON public.site_sections;
CREATE POLICY "admin_delete_sections" ON public.site_sections FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_brands" ON public.brands;
CREATE POLICY "public_read_brands" ON public.brands FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "admin_insert_brands" ON public.brands;
CREATE POLICY "admin_insert_brands" ON public.brands FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_brands" ON public.brands;
CREATE POLICY "admin_update_brands" ON public.brands FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_brands" ON public.brands;
CREATE POLICY "admin_delete_brands" ON public.brands FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_vehicles" ON public.vehicles;
CREATE POLICY "public_read_vehicles" ON public.vehicles FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "admin_insert_vehicles" ON public.vehicles;
CREATE POLICY "admin_insert_vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_vehicles" ON public.vehicles;
CREATE POLICY "admin_update_vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_vehicles" ON public.vehicles;
CREATE POLICY "admin_delete_vehicles" ON public.vehicles FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_parts" ON public.parts;
CREATE POLICY "public_read_parts" ON public.parts FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "admin_insert_parts" ON public.parts;
CREATE POLICY "admin_insert_parts" ON public.parts FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_parts" ON public.parts;
CREATE POLICY "admin_update_parts" ON public.parts FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_parts" ON public.parts;
CREATE POLICY "admin_delete_parts" ON public.parts FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_centers" ON public.service_centers;
CREATE POLICY "public_read_centers" ON public.service_centers FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
DROP POLICY IF EXISTS "admin_insert_centers" ON public.service_centers;
CREATE POLICY "admin_insert_centers" ON public.service_centers FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_centers" ON public.service_centers;
CREATE POLICY "admin_update_centers" ON public.service_centers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_centers" ON public.service_centers;
CREATE POLICY "admin_delete_centers" ON public.service_centers FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "public_read_inventory" ON public.inventory;
CREATE POLICY "public_read_inventory" ON public.inventory FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_insert_inventory" ON public.inventory;
CREATE POLICY "admin_insert_inventory" ON public.inventory FOR INSERT TO authenticated WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_update_inventory" ON public.inventory;
CREATE POLICY "admin_update_inventory" ON public.inventory FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "admin_delete_inventory" ON public.inventory;
CREATE POLICY "admin_delete_inventory" ON public.inventory FOR DELETE TO authenticated USING (public.is_admin());

INSERT INTO public.site_sections (section_key, eyebrow, title, body, cta_label, cta_href, sort_order)
VALUES
('hero', 'Repuestos originales y servicio experto', 'Todo lo que tu auto necesita, en un solo lugar', 'Compra repuestos originales para Mazda, Jeep, RAM, Fiat, Chery y Dongfeng con respaldo MARESA. Encuentra disponibilidad en tu centro más cercano.', 'Cotizar repuesto', '#selector', 1),
('about', 'Quiénes somos', 'Movemos al Ecuador con confianza', 'Somos el respaldo posventa de Corporación Maresa: especialistas en repuestos, mantenimiento, colisiones y accesorios para tu vehículo.', 'Conoce MARESA', '#nosotros', 2),
('points', 'Puntos de venta', 'Estamos cerca de ti', 'Consulta centros de servicio, horarios, contacto y disponibilidad de repuestos por ciudad.', 'Ver centros', '#puntos', 3),
('dealer', 'Quiero ser proveedor', 'Construyamos juntos la movilidad del Ecuador', 'Conecta tu negocio con nuestra red nacional de servicio y repuestos.', 'Quiero ser proveedor', '#proveedores', 4)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.brands (name, sort_order) VALUES
('Mazda', 1), ('Jeep', 2), ('RAM', 3), ('Fiat', 4), ('Chery', 5), ('Dongfeng', 6)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.service_centers (name, city, province, address, phone, latitude, longitude) VALUES
('Maresa Center Granados', 'Quito', 'Pichincha', 'Av. de los Granados y De las Hiedras E11-67', '0991050600', -0.1745, -78.4698),
('Maresa Center Juan Tanca Marengo', 'Guayaquil', 'Guayas', 'Av. Juan Tanca Marengo', '0991050600', -2.1435, -79.9145),
('Maresa Center Cuenca', 'Cuenca', 'Azuay', 'Av. España y Elia Liut', '0991050600', -2.9006, -79.0045),
('Maresa Center Manta', 'Manta', 'Manabí', 'Av. 4 de Noviembre', '0991050600', -0.9677, -80.7089),
('Maresa Center Ambato', 'Ambato', 'Tungurahua', 'Av. Atahualpa', '0991050600', -1.2491, -78.6168)
ON CONFLICT DO NOTHING;

INSERT INTO public.parts (part_number, name, category, description, price) VALUES
('MAZ-OIL-5W30', 'Aceite sintético 5W-30 Mazda', 'Lubricantes', 'Lubricante original para protección y rendimiento del motor.', 49.90),
('MAZ-FILT-AIR-01', 'Filtro de aire Mazda', 'Filtros', 'Filtro de aire original para mantener el motor limpio.', 32.50),
('MAZ-PAD-FRONT', 'Pastillas de freno delanteras', 'Frenos', 'Juego de pastillas de freno para aplicaciones Mazda.', 118.00),
('MAZ-RAD-KIT-01', 'Kit de radiador', 'Motor', 'Kit de reemplazo para sistema de refrigeración.', 285.00),
('MAZ-SHOCK-SET', 'Kit de amortiguadores', 'Suspensión', 'Amortiguadores para conducción segura y confortable.', 399.00),
('MAZ-BATT-01', 'Batería Interstate 65-750', 'Baterías', 'Batería de arranque para vehículos livianos.', 159.90),
('JEEP-FILT-CAB', 'Filtro de cabina Jeep', 'Filtros', 'Filtra polvo y partículas del aire del habitáculo.', 28.90),
('RAM-PAD-REAR', 'Pastillas de freno traseras RAM', 'Frenos', 'Componentes originales para pick-ups RAM.', 146.00)
ON CONFLICT (part_number) DO NOTHING;
