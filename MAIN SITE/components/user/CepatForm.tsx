"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, MapPin, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CEPAT_EXAMPLES, calcOrderFees } from "@/lib/constants";

export default function CepatForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [text, setText] = useState("");
  const [address, setAddress] = useState("");
  const [stops, setStops] = useState(1);

  const { ongkir, service, total } = calcOrderFees(0, stops);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !address) {
      setError("Mohon isi pesanan dan alamat pengiriman");
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
          order_type: "cepat",
          cepat_text: text,
          delivery_addr: address,
          subtotal: 0, // Admin will update this later when they know the price
          ongkir: ongkir,
          service_fee: service,
          total_fee: total,
          payment_method: "cod", // Default
          status: "pending",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Redirect to tracking page
      router.push(`/order/${order.id}`);
    } catch (err: any) {
      setError(err.message || "Gagal membuat pesanan");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
          Mau pesan apa? 📝
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={CEPAT_EXAMPLES[0]}
          className="w-full bg-white border border-[var(--border)] rounded-2xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-sm"
        />
        <p className="text-[11px] text-[var(--text-muted)] mt-2">
          Tulis selengkap mungkin. Contoh: "Beli nasi padang 2 bungkus di RM Sederhana Pujon, lauk rendang semua."
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
          Alamat Pengiriman 📍
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Contoh: Jl. Diponegoro No 15 (Pagar Hitam)"
            className="w-full bg-white border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Estimasi Biaya */}
      <div className="bg-[var(--bg)] rounded-2xl p-4 border border-[var(--border)] space-y-3">
        <h4 className="font-bold text-sm text-[var(--text-primary)]">Estimasi Biaya</h4>
        
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Ongkos Kirim</span>
          <span className="font-semibold text-[var(--text-primary)]">Rp {ongkir.toLocaleString('id-ID')}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Biaya Layanan</span>
          <span className="font-semibold text-[var(--text-primary)]">Rp {service.toLocaleString('id-ID')}</span>
        </div>

        <div className="pt-3 border-t border-[var(--border)] flex justify-between">
          <span className="font-bold text-[var(--text-primary)]">Total (Belum Harga Barang)</span>
          <span className="font-bold text-[var(--primary)]">Rp {total.toLocaleString('id-ID')}</span>
        </div>
        
        <p className="text-[10px] text-[var(--text-muted)] leading-tight pt-1">
          * Harga barang akan diupdate oleh admin setelah dikonfirmasi. Kamu bayar sesuai total akhir nanti.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primary)] text-white font-bold rounded-2xl py-4 flex items-center justify-center shadow-md active:scale-[0.98] transition-transform disabled:opacity-70 disabled:active:scale-100"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Cus Pesan Sekarang
          </>
        )}
      </button>
    </form>
  );
}
