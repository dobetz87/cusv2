// Dummy data for Cus prototype
window.CUS_DATA = (() => {
  const fmtRp = (n) => 'Rp ' + n.toLocaleString('id-ID');

  const categories = [
    { id: 'makanan', label: 'Makanan', icon: '🍜', tone: 'var(--primary)' },
    { id: 'minuman', label: 'Minuman', icon: '☕', tone: '#8E44AD' },
    { id: 'kebutuhan_harian', label: 'Harian', icon: '🛒', tone: '#27AE60' },
    { id: 'laundry', label: 'Laundry', icon: '👕', tone: '#3498DB' },
    { id: 'dokumen', label: 'Dokumen', icon: '📄', tone: '#2C3E50' },
    { id: 'belanja_pasar', label: 'Pasar', icon: '🥬', tone: '#E74C3C' },
    { id: 'custom', label: 'Lainnya', icon: '✨', tone: '#95A5A6' },
  ];

  // Simple striped placeholder generator (svg data url) — used for food + merchant images
  const stripe = (label, hue = 28, sat = 70, lig = 60) => {
    const bg = `hsl(${hue}, ${sat}%, ${lig}%)`;
    const fg = `hsl(${hue}, ${sat}%, ${Math.max(0, lig - 14)}%)`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
      <defs>
        <pattern id='p' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(35)'>
          <rect width='14' height='14' fill='${bg}'/>
          <rect width='4' height='14' fill='${fg}' opacity='0.55'/>
        </pattern>
      </defs>
      <rect width='200' height='200' fill='url(#p)'/>
      <text x='100' y='108' text-anchor='middle' font-family='ui-monospace, monospace' font-size='13' fill='rgba(255,255,255,0.85)' font-weight='600'>${label}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  };

  const merchants = [
    {
      id: 'm1', slug: 'pecel-bu-mut', name: 'Pecel Bu Mut',
      category: 'makanan', rating: 4.8, total_orders: 234, distance_km: 1.2, est_minutes: 15,
      is_open: true, is_featured: true,
      address: 'Pasar Pujon, Kios No. 12',
      operating_hours: '07:00 - 14:00',
      tags: ['populer', 'sarapan', 'murah'],
      image: stripe('PECEL BU MUT', 28, 65, 52),
      menu: [
        { id: 'm1-1', name: 'Pecel Komplit', price: 14000, image: stripe('Pecel Komplit', 100, 45, 50), description: 'Nasi, sayur rebus, sambal pecel, rempeyek, telur', is_popular: true, is_available: true },
        { id: 'm1-2', name: 'Pecel Tanpa Nasi', price: 10000, image: stripe('Pecel', 100, 50, 55), description: 'Sayur rebus, sambal pecel, rempeyek', is_popular: false, is_available: true },
        { id: 'm1-3', name: 'Nasi + Telur Dadar', price: 8000, image: null, description: 'Nasi putih dengan telur dadar', is_popular: false, is_available: true },
        { id: 'm1-4', name: 'Es Teh Manis', price: 3000, image: null, description: 'Segar, manis pas', is_popular: true, is_available: true },
      ],
    },
    {
      id: 'm2', slug: 'seblak-mang-ujang', name: 'Seblak Mang Ujang',
      category: 'makanan', rating: 4.6, total_orders: 187, distance_km: 0.8, est_minutes: 10,
      is_open: true, is_featured: true,
      address: 'Jl. Raya Pujon No. 45',
      operating_hours: '10:00 - 21:00',
      tags: ['pedas', 'viral', 'murah'],
      image: stripe('SEBLAK', 8, 75, 50),
      menu: [
        { id: 'm2-1', name: 'Seblak Original', price: 12000, image: stripe('Seblak Ori', 12, 75, 50), description: 'Kerupuk, mie, telur, sayur', is_popular: true, is_available: true },
        { id: 'm2-2', name: 'Seblak Ceker', price: 15000, image: stripe('Ceker', 15, 75, 48), description: 'Seblak + ceker ayam 3 pcs', is_popular: true, is_available: true },
        { id: 'm2-3', name: 'Seblak Seafood', price: 18000, image: stripe('Seafood', 200, 60, 45), description: 'Seblak + udang, cumi, fish cake', is_popular: false, is_available: false },
      ],
    },
    {
      id: 'm3', slug: 'warung-rawon-pak-de', name: 'Warung Rawon Pak De',
      category: 'makanan', rating: 4.9, total_orders: 312, distance_km: 1.7, est_minutes: 18,
      is_open: true, is_featured: false,
      address: 'Jl. Pahlawan No. 8, Pujon',
      operating_hours: '08:00 - 15:00',
      tags: ['tradisional', 'nasi', 'favorit'],
      image: stripe('RAWON', 30, 30, 30),
      menu: [
        { id: 'm3-1', name: 'Rawon Daging', price: 20000, image: stripe('Rawon', 30, 30, 28), description: 'Rawon daging sapi + nasi + sambal + tauge', is_popular: true, is_available: true },
        { id: 'm3-2', name: 'Rawon Telur Asin', price: 18000, image: stripe('Rawon Telur', 35, 35, 32), description: 'Rawon + telur asin', is_popular: false, is_available: true },
        { id: 'm3-3', name: 'Soto Ayam', price: 15000, image: stripe('Soto', 45, 65, 55), description: 'Soto ayam kampung + nasi', is_popular: true, is_available: true },
      ],
    },
    {
      id: 'm4', slug: 'kedai-kopi-gunung', name: 'Kedai Kopi Gunung',
      category: 'minuman', rating: 4.5, total_orders: 98, distance_km: 2.1, est_minutes: 20,
      is_open: true, is_featured: true,
      address: 'Jl. Raya Pujon KM 3',
      operating_hours: '08:00 - 22:00',
      tags: ['kopi', 'nongkrong', 'estetik'],
      image: stripe('KOPI GUNUNG', 25, 35, 35),
      menu: [
        { id: 'm4-1', name: 'Es Kopi Susu', price: 15000, image: stripe('Kopi Susu', 30, 40, 40), description: 'Espresso + susu segar + gula aren', is_popular: true, is_available: true },
        { id: 'm4-2', name: 'Matcha Latte', price: 18000, image: stripe('Matcha', 90, 35, 50), description: 'Matcha premium + susu segar', is_popular: false, is_available: true },
        { id: 'm4-3', name: 'Roti Bakar Coklat', price: 12000, image: stripe('Roti Bakar', 28, 50, 45), description: 'Roti bakar + coklat + keju', is_popular: true, is_available: true },
      ],
    },
    {
      id: 'm5', slug: 'toko-jaya-abadi', name: 'Toko Jaya Abadi',
      category: 'kebutuhan_harian', rating: 4.3, total_orders: 156, distance_km: 0.5, est_minutes: 8,
      is_open: true, is_featured: false,
      address: 'Jl. Raya Pujon No. 12',
      operating_hours: '06:00 - 21:00',
      tags: ['sembako', 'rokok', 'lengkap'],
      image: stripe('TOKO JAYA', 140, 45, 45),
      menu: [
        { id: 'm5-1', name: 'Surya 12 (1 bungkus)', price: 21000, image: null, description: '', is_popular: true, is_available: true },
        { id: 'm5-2', name: 'Indomie Goreng (1 pcs)', price: 3500, image: null, description: '', is_popular: false, is_available: true },
        { id: 'm5-3', name: 'Aqua 600ml', price: 3000, image: null, description: '', is_popular: false, is_available: true },
      ],
    },
    {
      id: 'm6', slug: 'laundry-bersih-wangi', name: 'Laundry Bersih Wangi',
      category: 'laundry', rating: 4.4, total_orders: 67, distance_km: 1.0, est_minutes: 12,
      is_open: true, is_featured: false,
      address: 'Jl. Mawar No. 3, Pujon',
      operating_hours: '07:00 - 20:00',
      tags: ['kiloan', 'express'],
      image: stripe('LAUNDRY', 200, 55, 60),
      menu: [
        { id: 'm6-1', name: 'Cuci Kering Reguler (/kg)', price: 7000, image: null, description: 'Selesai 2 hari', is_popular: true, is_available: true },
        { id: 'm6-2', name: 'Cuci Kering Express (/kg)', price: 12000, image: null, description: 'Selesai 6 jam', is_popular: false, is_available: true },
        { id: 'm6-3', name: 'Setrika Saja (/kg)', price: 5000, image: null, description: 'Selesai 1 hari', is_popular: false, is_available: true },
      ],
    },
  ];

  const foodFeed = [
    { item_id: 'm1-1', merchant_id: 'm1', merchant_name: 'Pecel Bu Mut', item_name: 'Pecel Komplit', price: 14000, image: stripe('Pecel Komplit', 100, 45, 50), order_count_today: 23, badge: 'Terlaris' },
    { item_id: 'm2-2', merchant_id: 'm2', merchant_name: 'Seblak Mang Ujang', item_name: 'Seblak Ceker', price: 15000, image: stripe('Ceker', 15, 75, 48), order_count_today: 18, badge: null },
    { item_id: 'm3-1', merchant_id: 'm3', merchant_name: 'Warung Rawon Pak De', item_name: 'Rawon Daging', price: 20000, image: stripe('Rawon', 30, 30, 28), order_count_today: 15, badge: 'Favorit Warga' },
    { item_id: 'm4-1', merchant_id: 'm4', merchant_name: 'Kedai Kopi Gunung', item_name: 'Es Kopi Susu', price: 15000, image: stripe('Kopi Susu', 30, 40, 40), order_count_today: 12, badge: null },
    { item_id: 'm2-1', merchant_id: 'm2', merchant_name: 'Seblak Mang Ujang', item_name: 'Seblak Original', price: 12000, image: stripe('Seblak Ori', 12, 75, 50), order_count_today: 11, badge: 'Murah' },
    { item_id: 'm3-3', merchant_id: 'm3', merchant_name: 'Warung Rawon Pak De', item_name: 'Soto Ayam', price: 15000, image: stripe('Soto', 45, 65, 55), order_count_today: 9, badge: null },
  ];

  const user = {
    id: 'u1', name: 'Satrio', phone: '6281234567890',
    address: { label: 'Rumah', full: 'Jl. Ngroto RT 03, Pujon' },
  };

  const driver = {
    id: 'd1', name: 'Mas Eko', phone: '6281298765432',
    vehicle: 'Honda Beat Putih', plate: 'N 4521 ABC',
  };

  return { categories, merchants, foodFeed, user, driver, fmtRp, stripe };
})();
