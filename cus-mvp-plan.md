# Cus MVP — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fullstack hyperlocal delivery PWA ("Cus") for Pujon/Malang with user ordering, admin dispatch, and manual WA driver coordination.

**Architecture:** Next.js 14 App Router with route groups `(user)` and `(admin)`. Supabase handles auth (phone OTP), Postgres DB, storage, and realtime subscriptions. shadcn/ui components styled with design tokens from the Cus OTW prototype.

**Tech Stack:** Next.js 14+, Tailwind CSS, shadcn/ui, Supabase (Auth, DB, Storage, Realtime), Vercel

---

## Design Tokens (from Prototype)

```
--primary: #E67E22           --primary-hover: #CA6916
--primary-light: #FCEFE3     --secondary: #2C3E50
--bg: #FAF9F7                --surface: #FFFFFF
--text-primary: #2C3E50      --text-secondary: rgba(44,62,80,0.70)
--success: #27AE60           --warning: #F39C12   --error: #E94560
--order-cepat-gradient: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)
--gateway-gradient: linear-gradient(170deg, #E67E22 0%, #D35400 60%, #BF4904 100%)
Fonts: Plus Jakarta Sans (headings 700-800), DM Sans (body 400-600)
Border-radius: buttons=14px, cards=18px, pills=999px
```

---

## PHASE 1: Project Scaffold + DB + Auth (Tasks 1-7)

### Task 1: Initialize Next.js Project

**Files:** Create `cus-app/` via npx, `.env.local`

**Steps:**
1. `npx -y create-next-app@latest cus-app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm`
2. `cd cus-app && npm install @supabase/supabase-js @supabase/ssr`
3. `npx -y shadcn@latest init -d`
4. Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Verify: `npm run dev` → app runs on localhost:3000
6. Commit: `chore: scaffold Next.js 14 + Tailwind + shadcn`

### Task 2: Design System — Tailwind Config + Global Styles

**Files:** Modify `tailwind.config.ts`, `app/globals.css`, `app/layout.tsx`

**Steps:**
1. Extend Tailwind config with Cus color tokens, font families, border-radius, shadows
2. Add Google Fonts (Plus Jakarta Sans, DM Sans) via `next/font/google` in root layout
3. Add CSS custom properties + animation keyframes (screenIn, fadeIn, toastIn, pulse, sheetIn, slideUp) to globals.css
4. Verify page renders with correct fonts
5. Commit: `style: add Cus design system tokens + fonts`

### Task 3: Supabase Client Setup

**Files:** Create `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `middleware.ts`

**Steps:**
1. Browser client using `createBrowserClient`
2. Server client using `createServerClient` + `cookies()` from `next/headers`
3. Middleware for session refresh on every request
4. Verify import without errors
5. Commit: `feat: Supabase client/server/middleware setup`

### Task 4: Database Schema Migration

**Files:** Create `supabase/migrations/001_init.sql`

**Steps:**
1. Create all 8 tables from PRD §3: profiles, drivers, merchants, feed_posts, orders, order_stops, order_items, payments — with all CHECK constraints, REFERENCES, DEFAULTs
2. Add indexes on orders(user_id, status, driver_id), order_stops(order_id), feed_posts(merchant_id)
3. Enable RLS: profiles (SELECT public, UPDATE own), orders (SELECT own or admin, INSERT auth), merchants (SELECT public, admin CRUD), drivers (SELECT public, UPDATE own/admin)
4. Run migration via Supabase dashboard or CLI
5. Commit: `feat: database schema with RLS + indexes`

### Task 5: Seed Data

**Files:** Create `supabase/seed.sql`

**Steps:**
1. Insert 6 merchants from prototype data.js (Pecel Bu Mut, Seblak Mang Ujang, Warung Rawon Pak De, Kedai Kopi Gunung, Toko Jaya Abadi, Laundry Bersih Wangi) with full menus
2. Insert 6 feed_posts for popular items
3. Run seed, verify in Supabase dashboard
4. Commit: `chore: seed merchant + feed data`

### Task 6: Constants and Pricing Logic

**Files:** Create `lib/constants.ts`, `lib/utils.ts`

**Steps:**
1. Implement PRICING object: baseOngkir=8000, stopFee=2000, platformFee=2000, driverShare=6000, calculate(stops)
2. Add status enums, category list, `fmtRp` formatter
3. Commit: `feat: pricing logic + constants`

### Task 7: Auth — Phone OTP Flow

**Files:** Create `app/(user)/auth/page.tsx`, `components/auth/PhoneForm.tsx`, `components/auth/OtpForm.tsx`

**Steps:**
1. PhoneForm: +62 prefix input, validation (≥9 digits), "Kirim Kode OTP" button (border-radius 14, Plus Jakarta Sans)
2. OtpForm: 4-digit inputs with auto-focus-next, 30s countdown, resend link
3. Wire to Supabase Auth `signInWithOtp({ phone })`
4. On verify → upsert `profiles` (role: user)
5. AC: submit phone → OTP form → enter code → redirect to `/home`
6. Commit: `feat: phone OTP auth flow`

---

## PHASE 2: User PWA Core (Tasks 8-16)

### Task 8: PWA Layout + Manifest

**Files:** Create `app/(user)/layout.tsx`, `public/manifest.json`, PWA icons

**Steps:**
1. manifest.json: name "Cus", theme_color "#E67E22", background "#FAF9F7", display "standalone"
2. User layout with viewport meta for PWA, bottom nav slot
3. Generate PWA icons (192x192, 512x512)
4. Commit: `feat: PWA manifest + user layout`

### Task 9: Gateway Page

**Files:** Create `app/(user)/page.tsx`

**Steps:**
1. Recreate Gateway from prototype screens-1.jsx: top hero with gateway-gradient, logo SVG, "cus" title, "Cus, otw! ⚡" subtitle
2. Bottom cards: "Mau Pesan" (primary, ShoppingBag icon) + "Daftar Jadi Driver" (secondary, Bike icon)
3. Entry animations (scale, translateY, opacity)
4. "Masuk sebagai Pemesan" → `/auth?role=user`, "Daftar Jadi Driver" → `/auth?role=driver`
5. Commit: `feat: gateway screen`

### Task 10: Bottom Navigation

**Files:** Create `components/shared/BottomNav.tsx`

**Steps:**
1. 3-tab nav: Home, Orders, Profile. Show on home/orders/profile routes only
2. Active = --primary, inactive = --text-muted
3. Commit: `feat: bottom navigation`

### Task 11: Home Feed + "Lagi Rame"

**Files:** Create `app/(user)/home/page.tsx`, `components/user/FeedCard.tsx`, `components/user/CategoryRow.tsx`

**Steps:**
1. Greeting, search bar, category pills (7 categories from data.js)
2. "Lagi Rame 🔥" feed grid: fetch feed_posts JOIN merchants, show image/name/price/badge
3. Infinite scroll with Supabase `.range()` pagination
4. Commit: `feat: home feed with categories`

### Task 12: ORDER CEPAT Input

**Files:** Create `components/user/OrderCepatBanner.tsx`, `app/(user)/order-cepat/page.tsx`

**Steps:**
1. Banner on home: orange gradient, ⚡, "Ketik apa aja, kami antarkan!"
2. Full page: helper card, textarea with rotating examples, attachment chips (location/photo/voice UI), address, submit
3. On submit → create order with cepat flag + raw text
4. Commit: `feat: Order Cepat free-text flow`

### Task 13: Merchant Detail Page

**Files:** Create `app/(user)/merchant/[slug]/page.tsx`, `components/user/MenuItem.tsx`

**Steps:**
1. Header: merchant image, name, rating, tags, hours
2. Menu list by availability, each item with "+" button
3. Sticky "Lihat Keranjang" bar when cart has items
4. Commit: `feat: merchant detail + menu`

### Task 14: Multi-Stop Cart

**Files:** Create `app/(user)/cart/page.tsx`, `components/user/CartItem.tsx`, `components/user/CheckoutSummary.tsx`

**Steps:**
1. Cart grouped by merchant, qty +/- controls, trash icon at qty=1
2. "Titip Sekalian" dashed CTA → Order Cepat
3. Address card, payment selector (COD/QRIS), cost breakdown
4. Pricing: subtotal + Rp8.000 base + (stops-1)*Rp2.000 + Rp3.000 service
5. "Pesan Sekarang" → insert orders + order_stops + order_items + payments → redirect `/order/[id]`
6. Commit: `feat: multi-stop cart + checkout`

### Task 15: Order Tracking

**Files:** Create `app/(user)/order/[id]/page.tsx`, `components/user/OrderStatusBadge.tsx`, `components/user/TrackingTimeline.tsx`

**Steps:**
1. Status hero with dynamic gradient
2. Stop progress bar (circles + lines)
3. Driver card (name, vehicle, rating, WA/chat buttons)
4. Timeline with vertical line + dots
5. Collapsible cost breakdown
6. Commit: `feat: order tracking page`

### Task 16: Orders History + Profile

**Files:** Create `app/(user)/orders/page.tsx`, `app/(user)/profile/page.tsx`

**Steps:**
1. Orders list: cards with date/status badge/items/total, tap → tracking
2. Profile: avatar, name, phone, address, logout
3. Commit: `feat: orders history + profile`

---

## PHASE 3: Admin Dashboard (Tasks 17-22)

### Task 17: Admin Layout + Auth Guard

**Files:** Create `app/(admin)/layout.tsx`, `components/admin/AdminSidebar.tsx`

**Steps:**
1. Sidebar: Dashboard, Orders, Drivers, Merchants links
2. Auth guard: check `profiles.role === 'admin'`, redirect if not
3. Commit: `feat: admin layout + sidebar + auth guard`

### Task 18: Admin Dashboard Overview

**Files:** Create `app/(admin)/page.tsx`

**Steps:**
1. Stats cards: orders today, active drivers, pending orders, revenue
2. Recent orders list (last 10)
3. Commit: `feat: admin dashboard overview`

### Task 19: Order Queue + Dispatch

**Files:** Create `app/(admin)/orders/page.tsx`, `components/admin/OrderQueueTable.tsx`, `components/admin/DispatchDialog.tsx`

**Steps:**
1. Table: ID, User, Items, Status, Driver, Created. Filter by status
2. Click order → detail + driver dropdown (active drivers only)
3. Assign → update driver_id + status='accepted'
4. Status buttons: accepted → picked_up → en_route → completed
5. Commit: `feat: order queue + driver dispatch`

### Task 20: Order Parser

**Files:** Create `components/admin/OrderParser.tsx`

**Steps:**
1. Display raw ORDER CEPAT text
2. UI to split into stops + items (add stop, items per stop, set prices)
3. Save → insert order_stops + order_items, recalculate total_fee
4. Commit: `feat: admin order parser for ORDER CEPAT`

### Task 21: Driver Management

**Files:** Create `app/(admin)/drivers/page.tsx`

**Steps:**
1. Table: name, phone, status, wallet, verified_at
2. Actions: Verify (pending→active), Suspend (active→suspended)
3. WA template preview with copy-to-clipboard
4. Commit: `feat: admin driver management`

### Task 22: Merchant Management

**Files:** Create `app/(admin)/merchants/page.tsx`, `components/admin/MerchantForm.tsx`

**Steps:**
1. Table: name, category, address, is_active toggle
2. CRUD dialog for create/edit
3. Commit: `feat: admin merchant CRUD`

---

## PHASE 4: Realtime + Polish + Deploy (Tasks 23-28)

### Task 23: Supabase Realtime Subscriptions

**Files:** Modify `app/(user)/order/[id]/page.tsx`, `app/(admin)/orders/page.tsx`

**Steps:**
1. User tracking: subscribe to `postgres_changes` on `orders` table filtered by order ID
2. Admin queue: auto-refresh on new/updated orders
3. Commit: `feat: realtime order status updates`

### Task 24: Error Boundaries + Loading + Empty States

**Files:** Create `components/shared/ErrorBoundary.tsx`, `LoadingSpinner.tsx`, `EmptyState.tsx`, `app/(user)/loading.tsx`, `app/(admin)/loading.tsx`

**Steps:**
1. Error boundary with retry, skeleton loaders, empty states (🛒 empty cart, no orders, etc.)
2. Commit: `feat: error boundaries + loading + empty states`

### Task 25: Toast System

**Files:** Create `components/shared/Toast.tsx`, `lib/hooks/useToast.ts`

**Steps:**
1. Pill-shaped toast, dark bg, toastIn animation, 1.8s auto-dismiss
2. Global hook for triggering
3. Commit: `feat: global toast system`

### Task 26: Search Page

**Files:** Create `app/(user)/search/page.tsx`

**Steps:**
1. Debounced search input
2. Search merchants + menu items, grouped results
3. Commit: `feat: search merchants + items`

### Task 27: PWA Service Worker

**Files:** Modify `next.config.mjs`

**Steps:**
1. Install next-pwa or basic SW registration
2. Cache static assets + API
3. Test "Add to Home Screen" on mobile
4. Commit: `feat: PWA service worker + installability`

### Task 28: Deploy to Vercel

**Files:** Create `vercel.json` if needed

**Steps:**
1. Connect repo to Vercel, set env vars
2. Deploy + verify all routes
3. Pre-launch checklist:
   - [ ] WA OTP flow works end-to-end
   - [ ] Multi-stop pricing correct
   - [ ] Realtime status updates work
   - [ ] Admin dispatch works
   - [ ] RLS blocks unauthorized access
   - [ ] PWA installs on mobile
   - [ ] Vercel + Supabase stable
4. Commit: `chore: deploy config + final polish`

---

## Execution Summary

| Phase | Tasks | Est. Effort | Deliverables |
|-------|-------|-------------|--------------|
| Phase 1 | 1-7 | ~3-4 hrs | Scaffold, DB, auth |
| Phase 2 | 8-16 | ~6-8 hrs | User PWA (9 screens) |
| Phase 3 | 17-22 | ~4-5 hrs | Admin dashboard (5 screens) |
| Phase 4 | 23-28 | ~3-4 hrs | Realtime, polish, deploy |
| **Total** | **28** | **~16-21 hrs** | **Production MVP** |
