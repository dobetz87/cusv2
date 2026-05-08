-- ============================================================
-- Cus MVP — Database Schema Migration
-- Run in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  address     TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'driver', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── DRIVERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS drivers (
  id           UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL DEFAULT 'motor' CHECK (vehicle_type IN ('motor', 'mobil', 'sepeda')),
  vehicle_plat TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'offline', 'suspended')),
  wallet_bal   INTEGER NOT NULL DEFAULT 0,  -- in IDR cents
  rating       NUMERIC(3,2) DEFAULT 5.00,
  total_orders INTEGER NOT NULL DEFAULT 0,
  verified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MERCHANTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS merchants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  category    TEXT NOT NULL CHECK (category IN ('makanan', 'minuman', 'snack', 'belanja', 'laundry', 'obat', 'lainnya')),
  description TEXT,
  image_url   TEXT,
  address     TEXT,
  phone       TEXT,
  rating      NUMERIC(3,2) DEFAULT 5.00,
  is_open     BOOLEAN NOT NULL DEFAULT TRUE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  open_hours  TEXT DEFAULT '07:00 - 21:00',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── MENU ITEMS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id  UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        INTEGER NOT NULL CHECK (price >= 0),  -- in IDR
  image_url    TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  category     TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FEED POSTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feed_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  item_id     UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  image_url   TEXT,
  badge       TEXT,  -- e.g. "🔥 Lagi Rame", "⚡ Cepat"
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDERS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id),
  driver_id     UUID REFERENCES drivers(id),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','accepted','picked_up','en_route','completed','cancelled')),
  order_type    TEXT NOT NULL DEFAULT 'regular' CHECK (order_type IN ('regular', 'cepat')),
  cepat_text    TEXT,             -- raw text for ORDER CEPAT
  delivery_addr TEXT NOT NULL,
  subtotal      INTEGER NOT NULL DEFAULT 0,
  ongkir        INTEGER NOT NULL DEFAULT 8000,
  service_fee   INTEGER NOT NULL DEFAULT 2000,
  total_fee     INTEGER NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod', 'qris')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDER STOPS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_stops (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id),
  stop_label  TEXT,               -- for cepat orders: "Apotek XYZ"
  address     TEXT,
  stop_fee    INTEGER NOT NULL DEFAULT 0,
  position    INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ORDER ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stop_id      UUID NOT NULL REFERENCES order_stops(id) ON DELETE CASCADE,
  item_id      UUID REFERENCES menu_items(id),
  name         TEXT NOT NULL,     -- snapshot at time of order
  price        INTEGER NOT NULL,
  qty          INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  subtotal     INTEGER NOT NULL DEFAULT 0,
  notes        TEXT
);

-- ─── PAYMENTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method         TEXT NOT NULL CHECK (method IN ('cod', 'qris')),
  amount         INTEGER NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'refunded')),
  qris_image_url TEXT,
  paid_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status      ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id   ON orders(driver_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at  ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_stops_order  ON order_stops(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order  ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_merch   ON feed_posts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_merch   ON menu_items(merchant_id);

-- ─── TRIGGERS: updated_at ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments    ENABLE ROW LEVEL SECURITY;

-- Helper: check if caller is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "profiles_select_public"  ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_update_own"     ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"     ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- MERCHANTS (public read, admin write)
CREATE POLICY "merchants_select_all"    ON merchants FOR SELECT USING (TRUE);
CREATE POLICY "merchants_admin_insert"  ON merchants FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "merchants_admin_update"  ON merchants FOR UPDATE USING (is_admin());
CREATE POLICY "merchants_admin_delete"  ON merchants FOR DELETE USING (is_admin());

-- MENU ITEMS (public read)
CREATE POLICY "menu_items_select_all"   ON menu_items FOR SELECT USING (TRUE);
CREATE POLICY "menu_items_admin_write"  ON menu_items FOR ALL USING (is_admin());

-- FEED POSTS (public read)
CREATE POLICY "feed_posts_select_all"   ON feed_posts FOR SELECT USING (TRUE);
CREATE POLICY "feed_posts_admin_write"  ON feed_posts FOR ALL USING (is_admin());

-- DRIVERS
CREATE POLICY "drivers_select_public"   ON drivers FOR SELECT USING (TRUE);
CREATE POLICY "drivers_update_own"      ON drivers FOR UPDATE USING (auth.uid() = id OR is_admin());
CREATE POLICY "drivers_insert_own"      ON drivers FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "drivers_admin_all"       ON drivers FOR ALL USING (is_admin());

-- ORDERS
CREATE POLICY "orders_select_own_or_admin"
  ON orders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "orders_insert_auth"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_update_admin"
  ON orders FOR UPDATE USING (is_admin());

-- ORDER STOPS
CREATE POLICY "order_stops_select_own"
  ON order_stops FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_admin()))
  );
CREATE POLICY "order_stops_insert_own"
  ON order_stops FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "order_stops_admin_all"   ON order_stops FOR ALL USING (is_admin());

-- ORDER ITEMS
CREATE POLICY "order_items_select_own"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_admin()))
  );
CREATE POLICY "order_items_insert_own"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "order_items_admin_all"   ON order_items FOR ALL USING (is_admin());

-- PAYMENTS
CREATE POLICY "payments_select_own"
  ON payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR is_admin()))
  );
CREATE POLICY "payments_insert_own"
  ON payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
CREATE POLICY "payments_admin_all"      ON payments FOR ALL USING (is_admin());
