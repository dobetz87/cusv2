"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { MapPin, Plus, Minus, Trash2, Send, Loader2, Info } from "lucide-react";
import { calcOrderFees, fmtRp } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutForm({ userId, defaultAddress }: { userId: string, defaultAddress?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const { items, updateQty, removeItem, clearCart, getCartTotal } = useCartStore();
  
  const [address, setAddress] = useState(defaultAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate unique merchants for multiple stops
  const uniqueMerchants = new Set(items.map((i) => i.merchantId));
  const numStops = uniqueMerchants.size;
  
  const subtotal = getCartTotal();
  const { ongkir, service, total } = calcOrderFees(subtotal, numStops);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center px-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Keranjang Kosong</h3>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">Ayo cari makanan enak dulu!</p>
        <button 
          onClick={() => router.push("/search")}
          className="bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold active:scale-95 transition-transform"
        >
          Cari Makanan
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError("Mohon isi alamat pengiriman");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          order_type: "regular",
          delivery_addr: address,
          subtotal: subtotal,
          ongkir: ongkir,
          service_fee: service,
          total_fee: total,
          payment_method: "cod",
          status: "pending",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Create Order Stops and Items
      // Group items by merchant
      const itemsByMerchant: Record<string, typeof items> = {};
      items.forEach(item => {
        if (!itemsByMerchant[item.merchantId]) itemsByMerchant[item.merchantId] = [];
        itemsByMerchant[item.merchantId].push(item);
      });

      let position = 1;
      for (const [merchantId, merchantItems] of Object.entries(itemsByMerchant)) {
        // Create Stop
        const { data: stop, error: stopErr } = await supabase
          .from("order_stops")
          .insert({
            order_id: order.id,
            merchant_id: merchantId,
            stop_label: merchantItems[0].merchantName,
            position: position++,
          })
          .select()
          .single();
        
        if (stopErr) throw stopErr;

        // Create Items for this stop
        const orderItemsToInsert = merchantItems.map(i => ({
          order_id: order.id,
          stop_id: stop.id,
          item_id: i.menuItemId,
          name: i.name,
          price: i.price,
          qty: i.qty,
          subtotal: i.price * i.qty,
          notes: i.notes || null,
        }));

        const { error: itemsErr } = await supabase
          .from("order_items")
          .insert(orderItemsToInsert);

        if (itemsErr) throw itemsErr;
      }

      // 3. Clear cart and redirect
      clearCart();
      router.push(`/order/${order.id}`);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal membuat pesanan");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      {/* Alamat Pengiriman */}
      <section>
        <h2 className="font-bold text-[var(--text-primary)] mb-3">Alamat Pengiriman 📍</h2>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Detail alamat, gang, pagar warna apa..."
            className="w-full bg-white border border-[var(--border)] rounded-2xl py-3 pl-12 pr-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Daftar Pesanan */}
      <section>
        <h2 className="font-bold text-[var(--text-primary)] mb-3">Pesanan Kamu 🛍️</h2>
        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
          {items.map((item) => (
            <div key={item.id} className="p-4 border-b border-[var(--border)] last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="pr-4">
                  <h4 className="font-bold text-[var(--text-primary)] leading-tight mb-1">{item.name}</h4>
                  <p className="text-xs text-[var(--primary)] font-medium mb-1">{item.merchantName}</p>
                  {item.notes && (
                    <p className="text-xs text-[var(--text-muted)] italic">Catatan: {item.notes}</p>
                  )}
                  <div className="font-bold text-sm text-[var(--text-primary)] mt-1">
                    {fmtRp(item.price * item.qty)}
                  </div>
                </div>
                
                <button 
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-end mt-2">
                <div className="flex items-center bg-[var(--bg)] rounded-full border border-[var(--border)] p-0.5">
                  <button 
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-[var(--primary)] bg-white rounded-full shadow-sm active:scale-95 transition-transform"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-[var(--primary)] bg-white rounded-full shadow-sm active:scale-95 transition-transform"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rincian Pembayaran */}
      <section className="bg-white border border-[var(--border)] rounded-2xl p-4 space-y-3">
        <h2 className="font-bold text-[var(--text-primary)] mb-1">Rincian Pembayaran</h2>
        
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Harga Barang</span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="flex items-center text-[var(--text-secondary)]">
            Ongkos Kirim
            {numStops > 1 && (
              <span className="ml-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                {numStops} Stop
              </span>
            )}
          </span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(ongkir)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="flex items-center text-[var(--text-secondary)]">
            Biaya Layanan
            <Info className="w-3 h-3 ml-1 text-gray-400" />
          </span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(service)}</span>
        </div>

        <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
          <span className="font-bold text-[var(--text-primary)]">Total Pembayaran</span>
          <span className="font-black text-lg text-[var(--primary)]">{fmtRp(total)}</span>
        </div>
        
        <div className="bg-[var(--bg)] p-3 rounded-xl mt-3 flex items-start">
          <div className="w-6 h-6 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)] font-bold text-xs mr-2 shrink-0">
            $
          </div>
          <div className="text-xs text-[var(--text-secondary)] leading-tight">
            Pembayaran saat ini hanya menerima <strong>Cash on Delivery (COD)</strong>. Titipkan uang ke driver!
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--border)] z-10 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white font-bold rounded-2xl py-4 flex items-center justify-center shadow-md active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Pesan Sekarang — {fmtRp(total)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
