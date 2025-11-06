-- ================================================
-- SCHEMA SQL UNTUK APLIKASI KASIR MARTABAK TIP TOP
-- ================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VARIANTS TABLE (karena tiap varian punya harga berbeda)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  base_price INTEGER NOT NULL,
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
  variant_name TEXT,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SHIFTS TABLE (opsional)
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
-- INDEXES
-- ================================================
CREATE INDEX IF NOT EXISTS idx_orders_order_time ON orders(order_time DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ================================================
-- SEED DATA - MENU MARTABAK TIP TOP
-- ================================================

-- PRODUCTS
INSERT INTO products (id, name, base_price, is_active) VALUES
  ('prd_terang_bulan', 'Terang Bulan Tip Top', 15000, true),
  ('prd_martabak_telur', 'Martabak Telor', 20000, true)
ON CONFLICT (id) DO NOTHING;

-- VARIANTS UNTUK TERANG BULAN TIP TOP
INSERT INTO product_variants (product_id, variant_name, base_price) VALUES
  ('prd_terang_bulan', 'Kombinasi Original', 35000),
  ('prd_terang_bulan', 'Kombinasi Brownis', 40000),
  ('prd_terang_bulan', 'Kombinasi Mocca', 40000),
  ('prd_terang_bulan', 'Kombinasi Pandan', 40000),

  ('prd_terang_bulan', 'Keju Kacang Original', 30000),
  ('prd_terang_bulan', 'Keju Kacang Brownis', 35000),
  ('prd_terang_bulan', 'Keju Kacang Mocca', 35000),
  ('prd_terang_bulan', 'Keju Kacang Pandan', 35000),

  ('prd_terang_bulan', 'Keju Coklat Original', 30000),
  ('prd_terang_bulan', 'Keju Coklat Brownis', 35000),
  ('prd_terang_bulan', 'Keju Coklat Mocca', 35000),
  ('prd_terang_bulan', 'Keju Coklat Pandan', 35000),

  ('prd_terang_bulan', 'Double Keju Original', 35000),
  ('prd_terang_bulan', 'Double Keju Brownis', 40000),
  ('prd_terang_bulan', 'Double Keju Mocca', 40000),
  ('prd_terang_bulan', 'Double Keju Pandan', 40000),

  ('prd_terang_bulan', 'Double Kacang Original', 23000),
  ('prd_terang_bulan', 'Double Kacang Brownis', 28000),
  ('prd_terang_bulan', 'Double Kacang Mocca', 28000),
  ('prd_terang_bulan', 'Double Kacang Pandan', 28000),

  ('prd_terang_bulan', 'Double Coklat Original', 23000),
  ('prd_terang_bulan', 'Double Coklat Brownis', 28000),
  ('prd_terang_bulan', 'Double Coklat Mocca', 28000),
  ('prd_terang_bulan', 'Double Coklat Pandan', 28000),

  ('prd_terang_bulan', 'Choco Crunchy Original', 25000),
  ('prd_terang_bulan', 'Choco Crunchy Brownis', 30000),
  ('prd_terang_bulan', 'Choco Crunchy Mocca', 30000),
  ('prd_terang_bulan', 'Choco Crunchy Pandan', 30000),

  ('prd_terang_bulan', 'Choco Crunchy Kacang Original', 28000),
  ('prd_terang_bulan', 'Choco Crunchy Kacang Brownis', 33000),
  ('prd_terang_bulan', 'Choco Crunchy Kacang Mocca', 33000),
  ('prd_terang_bulan', 'Choco Crunchy Kacang Pandan', 33000),

  ('prd_terang_bulan', 'Choco Crunchy Keju Original', 33000),
  ('prd_terang_bulan', 'Choco Crunchy Keju Brownis', 38000),
  ('prd_terang_bulan', 'Choco Crunchy Keju Mocca', 38000),
  ('prd_terang_bulan', 'Choco Crunchy Keju Pandan', 38000),

  ('prd_terang_bulan', 'Keju Original', 28000),
  ('prd_terang_bulan', 'Keju Brownis', 33000),
  ('prd_terang_bulan', 'Keju Mocca', 33000),
  ('prd_terang_bulan', 'Keju Pandan', 33000),

  ('prd_terang_bulan', 'Kacang Coklat Original', 25000),
  ('prd_terang_bulan', 'Kacang Coklat Brownis', 30000),
  ('prd_terang_bulan', 'Kacang Coklat Mocca', 30000),
  ('prd_terang_bulan', 'Kacang Coklat Pandan', 30000),

  ('prd_terang_bulan', 'Coklat Original', 20000),
  ('prd_terang_bulan', 'Coklat Brownis', 25000),
  ('prd_terang_bulan', 'Coklat Mocca', 25000),
  ('prd_terang_bulan', 'Coklat Pandan', 25000),

  ('prd_terang_bulan', 'Kacang Original', 20000),
  ('prd_terang_bulan', 'Kacang Brownis', 25000),
  ('prd_terang_bulan', 'Kacang Mocca', 25000),
  ('prd_terang_bulan', 'Kacang Pandan', 25000),

  ('prd_terang_bulan', 'Kosongan Original', 15000),
  ('prd_terang_bulan', 'Kosongan Brownis', 20000),
  ('prd_terang_bulan', 'Kosongan Mocca', 20000),
  ('prd_terang_bulan', 'Kosongan Pandan', 20000)
ON CONFLICT DO NOTHING;

-- VARIANTS UNTUK MARTABAK TELOR
INSERT INTO product_variants (product_id, variant_name, base_price) VALUES
  ('prd_martabak_telur', 'Super', 50000),
  ('prd_martabak_telur', 'Istimewa', 40000),
  ('prd_martabak_telur', 'Spesial', 30000),
  ('prd_martabak_telur', 'Biasa', 20000)
ON CONFLICT DO NOTHING;

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
-- VIEW: DAILY SUMMARY
-- ================================================
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
