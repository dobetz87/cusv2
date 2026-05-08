-- ============================================================
-- Cus MVP — Seed Data
-- Run AFTER 001_init.sql migration
-- ============================================================

-- ─── MERCHANTS ────────────────────────────────────────────────
INSERT INTO merchants (id, name, slug, category, description, image_url, address, phone, rating, is_open, open_hours) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Pecel Bu Mut', 'pecel-bu-mut', 'makanan',
   'Pecel legendaris dengan sambel kacang khas Pujon, disajikan dengan aneka lauk pilihan.',
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
   'Jl. Raya Pujon No. 12, Malang', '08123456701', 4.9, TRUE, '06:00 - 14:00'),

  ('a1000000-0000-0000-0000-000000000002', 'Seblak Mang Ujang', 'seblak-mang-ujang', 'makanan',
   'Seblak pedas level 1-10, bisa request level. Topping lengkap: ceker, baso, otak-otak.',
   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400',
   'Jl. Mawar No. 5, Pujon', '08123456702', 4.7, TRUE, '11:00 - 22:00'),

  ('a1000000-0000-0000-0000-000000000003', 'Warung Rawon Pak De', 'rawon-pak-de', 'makanan',
   'Rawon hitam pekat dengan daging empuk pilihan, resep turun-temurun dari Jawa Timur.',
   'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
   'Jl. Veteran No. 88, Malang', '08123456703', 4.8, TRUE, '07:00 - 15:00'),

  ('a1000000-0000-0000-0000-000000000004', 'Kedai Kopi Gunung', 'kopi-gunung', 'minuman',
   'Kopi arabika single origin dari lereng Gunung Kawi. Manual brew & espresso based.',
   'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
   'Jl. Panglima Sudirman No. 21, Pujon', '08123456704', 4.6, TRUE, '07:00 - 21:00'),

  ('a1000000-0000-0000-0000-000000000005', 'Toko Jaya Abadi', 'toko-jaya-abadi', 'belanja',
   'Minimarket serba ada: sembako, snack, minuman dingin, kebutuhan sehari-hari.',
   'https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=400',
   'Jl. Raya Ngantang No. 45, Malang', '08123456705', 4.5, TRUE, '07:00 - 22:00'),

  ('a1000000-0000-0000-0000-000000000006', 'Laundry Bersih Wangi', 'laundry-bersih-wangi', 'laundry',
   'Laundry kiloan & satuan. Cuci + setrika express 3 jam, harum dan rapi.',
   'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400',
   'Jl. Arjuna No. 7, Pujon', '08123456706', 4.8, TRUE, '08:00 - 20:00')
ON CONFLICT (id) DO NOTHING;

-- ─── MENU ITEMS ───────────────────────────────────────────────
INSERT INTO menu_items (id, merchant_id, name, description, price, is_available, category) VALUES
  -- Pecel Bu Mut
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001',
   'Pecel Komplit', 'Pecel + nasi + tempe + tahu + rempeyek + telur', 18000, TRUE, 'nasi'),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001',
   'Pecel Sayur', 'Pecel tanpa nasi, sambel kacang extra', 10000, TRUE, 'pecel'),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001',
   'Nasi Putih', 'Nasi putih hangat', 4000, TRUE, 'nasi'),

  -- Seblak Mang Ujang
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002',
   'Seblak Komplit Level 5', 'Kerupuk, ceker, baso, otak-otak, mie, level 5', 25000, TRUE, 'seblak'),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002',
   'Seblak Original', 'Kerupuk + telur, level bisa request', 15000, TRUE, 'seblak'),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002',
   'Minuman Teh Manis', 'Teh manis hangat atau dingin', 5000, TRUE, 'minuman'),

  -- Rawon Pak De
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003',
   'Rawon Daging', 'Rawon dengan daging sapi pilihan, kuah hitam pekat', 28000, TRUE, 'rawon'),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003',
   'Rawon Ayam', 'Rawon ayam kampung, lebih ringan', 22000, TRUE, 'rawon'),

  -- Kedai Kopi Gunung
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004',
   'Kopi Hitam V60', 'Pour over arabika Kawi, fruity & bright', 18000, TRUE, 'kopi'),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004',
   'Kopi Susu Gula Aren', 'Espresso + susu segar + gula aren lokal', 22000, TRUE, 'kopi'),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004',
   'Matcha Latte', 'Matcha premium + susu segar, bisa hot/iced', 24000, TRUE, 'non-kopi')
ON CONFLICT (id) DO NOTHING;

-- ─── FEED POSTS ───────────────────────────────────────────────
INSERT INTO feed_posts (merchant_id, item_id, title, image_url, badge) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'Pecel Komplit Bu Mut — Favorit Warga!',
   'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', '🔥 Lagi Rame'),
  ('a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004',
   'Seblak Level 5 — Tantanganmu Hari Ini!',
   'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400', '🌶 Super Pedas'),
  ('a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000010',
   'Kopi Susu Gula Aren — Khas Gunung',
   'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400', '☕ Baru'),
  ('a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000007',
   'Rawon Pak De — Resep Nenek',
   'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', '⭐ Top Rated'),
  ('a1000000-0000-0000-0000-000000000005', NULL,
   'Jaya Abadi — Belanja Serba Ada',
   'https://images.unsplash.com/photo-1604719312566-8912e9667d9f?w=400', '🛒 Lengkap'),
  ('a1000000-0000-0000-0000-000000000006', NULL,
   'Laundry Express 3 Jam!',
   'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400', '⚡ Express')
ON CONFLICT DO NOTHING;
