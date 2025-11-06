-- ================================================
-- SCHEMA SQL UNTUK APLIKASI KASIR MARTABAK
-- Import ke Supabase SQL Editor
-- ================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TOPPINGS TABLE
CREATE TABLE IF NOT EXISTS toppings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  order_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subtotal INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  extra_fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  paid_amount INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  pay_method TEXT NOT NULL CHECK (pay_method IN ('cash', 'qris', 'ewallet')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER_ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDER_ITEM_TOPPINGS TABLE
CREATE TABLE IF NOT EXISTS order_item_toppings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  topping_id TEXT NOT NULL REFERENCES toppings(id),
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SHIFTS TABLE (opsional, untuk shift pagi/malam)
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_date DATE NOT NULL,
  opened_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  opening_cash INTEGER,
  closing_cash INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES untuk performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_item_toppings_order_item_id ON order_item_toppings(order_item_id);
CREATE INDEX IF NOT EXISTS idx_order_item_toppings_topping_id ON order_item_toppings(topping_id);

-- ================================================
-- SEED DATA - Menu Martabak & Terang Bulan
-- ================================================

-- Products
INSERT INTO products (id, name, base_price, is_active) VALUES
  ('prd_terang_tipis', 'Terang Bulan Tipis', 25000, true),
  ('prd_terang_tebal', 'Terang Bulan Tebal', 30000, true),
  ('prd_martabak_telur', 'Martabak Telur', 28000, true)
ON CONFLICT (id) DO NOTHING;

-- Toppings
INSERT INTO toppings (id, name, price, is_active) VALUES
  ('top_keju', 'Keju', 6000, true),
  ('top_coklat', 'Coklat', 5000, true),
  ('top_kacang', 'Kacang', 3000, true),
  ('top_meses', 'Meses', 3000, true),
  ('top_susu', 'Susu', 2000, true),
  ('top_mix', 'Mix (Keju+Coklat)', 9000, true)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- ROW LEVEL SECURITY (RLS) - DISABLE untuk kasir internal
-- Kalau mau enable RLS, uncomment di bawah
-- ================================================

-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_item_toppings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow semua aksi (karena ini internal kasir)
-- CREATE POLICY "Allow all for authenticated users" ON products FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON toppings FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON orders FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON order_items FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON order_item_toppings FOR ALL USING (true);
-- CREATE POLICY "Allow all for authenticated users" ON shifts FOR ALL USING (true);

-- ================================================
-- FUNCTION: Generate Order Number (YYYYMMDD-####)
-- ================================================
CREATE OR REPLACE FUNCTION generate_order_no()
RETURNS TEXT AS $$
DECLARE
  today_prefix TEXT;
  last_seq INTEGER;
  new_seq TEXT;
BEGIN
  today_prefix := TO_CHAR(NOW() AT TIME ZONE 'Asia/Jakarta', 'YYYYMMDD');
  
  SELECT COALESCE(
    MAX(
      SUBSTRING(order_no FROM LENGTH(today_prefix) + 2)::INTEGER
    ), 0
  ) INTO last_seq
  FROM orders
  WHERE order_no LIKE today_prefix || '-%';
  
  new_seq := LPAD((last_seq + 1)::TEXT, 4, '0');
  
  RETURN today_prefix || '-' || new_seq;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- VIEWS untuk Laporan
-- ================================================

-- View: Daily Summary
CREATE OR REPLACE VIEW daily_summary AS
SELECT
  DATE(order_time AT TIME ZONE 'Asia/Jakarta') AS date,
  COUNT(*) AS order_count,
  SUM(total) AS total_revenue,
  ROUND(AVG(total)::NUMERIC, 0) AS avg_order_value,
  SUM(CASE WHEN pay_method = 'cash' THEN total ELSE 0 END) AS cash_total,
  SUM(CASE WHEN pay_method = 'qris' THEN total ELSE 0 END) AS qris_total,
  SUM(CASE WHEN pay_method = 'ewallet' THEN total ELSE 0 END) AS ewallet_total
FROM orders
GROUP BY DATE(order_time AT TIME ZONE 'Asia/Jakarta')
ORDER BY date DESC;

-- ================================================
-- DONE! 🎉
-- ================================================
-- Langkah selanjutnya:
-- 1. Copy semua SQL ini ke Supabase SQL Editor
-- 2. Run/Execute
-- 3. Cek table sudah terbuat & terisi seed data
-- 4. Copy SUPABASE_URL & SUPABASE_ANON_KEY ke .env.local
-- ================================================
