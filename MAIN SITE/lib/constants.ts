// ─── Pricing ─────────────────────────────────────────────────────────────────
export const PRICING = {
  baseOngkir: 8_000,   // Rp 8.000 — covers first stop
  stopFee:    2_000,   // Rp 2.000 per additional stop
  serviceFee: 2_000,   // Rp 2.000 platform fee (was 3.000 in cart, plan says 2.000)
  driverShare: 6_000,  // Rp 6.000 goes to driver per order
} as const;

/**
 * Calculate total ongkir based on number of stops.
 * @param stops - total number of stops (merchants/destinations), minimum 1
 */
export function calcOngkir(stops: number): number {
  if (stops <= 0) return PRICING.baseOngkir;
  return PRICING.baseOngkir + Math.max(0, stops - 1) * PRICING.stopFee;
}

/**
 * Calculate full order fee breakdown.
 */
export function calcOrderFees(subtotal: number, stops: number) {
  const ongkir = calcOngkir(stops);
  const service = PRICING.serviceFee;
  return {
    subtotal,
    ongkir,
    service,
    total: subtotal + ongkir + service,
  };
}

// ─── Status Enums ─────────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING:    'pending',
  ACCEPTED:   'accepted',
  PICKED_UP:  'picked_up',
  EN_ROUTE:   'en_route',
  COMPLETED:  'completed',
  CANCELLED:  'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:    'Menunggu Driver',
  accepted:   'Driver Diterima',
  picked_up:  'Sedang Mengambil',
  en_route:   'Dalam Perjalanan',
  completed:  'Selesai',
  cancelled:  'Dibatalkan',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    'var(--warning)',
  accepted:   'var(--primary)',
  picked_up:  'var(--primary)',
  en_route:   'var(--primary)',
  completed:  'var(--success)',
  cancelled:  'var(--error)',
};

export const DRIVER_STATUS = {
  PENDING:    'pending',
  ACTIVE:     'active',
  OFFLINE:    'offline',
  SUSPENDED:  'suspended',
} as const;

export type DriverStatus = typeof DRIVER_STATUS[keyof typeof DRIVER_STATUS];

export const PAYMENT_METHOD = {
  COD:  'cod',
  QRIS: 'qris',
} as const;

export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod:  'Bayar di Tempat (COD)',
  qris: 'QRIS',
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'semua',   label: 'Semua',   emoji: '🏠' },
  { id: 'makanan', label: 'Makanan', emoji: '🍱' },
  { id: 'minuman', label: 'Minuman', emoji: '☕' },
  { id: 'snack',   label: 'Snack',   emoji: '🍿' },
  { id: 'belanja', label: 'Belanja', emoji: '🛒' },
  { id: 'laundry', label: 'Laundry', emoji: '🧺' },
  { id: 'obat',    label: 'Obat',    emoji: '💊' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

// ─── ORDER CEPAT Examples ─────────────────────────────────────────────────────
export const CEPAT_EXAMPLES = [
  'Beli nasi pecel Bu Mut 2 porsi + es teh manis',
  'Ambilkan titipan di alfamart + tolong beli aqua galon',
  'Seblak Mang Ujang level 5, minta sambel ekstra',
  'Laundry kiloan di Bersih Wangi, antar ke rumah ya',
  'Beli obat maag di apotek dekat pasar Pujon',
];

// ─── WA Templates ────────────────────────────────────────────────────────────
export function buildWADriverTemplate(params: {
  driverName: string;
  orderId: string;
  customerName: string;
  stops: string[];
  totalFee: number;
}): string {
  const stopList = params.stops
    .map((s, i) => `${i + 1}. ${s}`)
    .join('\n');

  return (
    `Halo Kak ${params.driverName}! 👋\n\n` +
    `Ada order baru dari Cus:\n` +
    `📦 Order #${params.orderId.slice(-6).toUpperCase()}\n` +
    `👤 Pelanggan: ${params.customerName}\n\n` +
    `📍 Stop:\n${stopList}\n\n` +
    `💰 Total ongkir: ${fmtRp(params.totalFee)}\n\n` +
    `Konfirmasi terima order? Reply YA atau TOLAK. Terima kasih! 🚀`
  );
}

// ─── Formatters ───────────────────────────────────────────────────────────────
/**
 * Format number as Indonesian Rupiah.
 * @example fmtRp(25000) → "Rp 25.000"
 */
export function fmtRp(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format date to Indonesian locale.
 * @example fmtDate(new Date()) → "Sabtu, 9 Mei 2026, 00:55"
 */
export function fmtDate(date: Date | string): string {
  return new Date(date).toLocaleString('id-ID', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

/**
 * Generate slug from string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
