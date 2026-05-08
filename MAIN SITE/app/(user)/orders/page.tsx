import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/shared/BottomNav";
import { Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, fmtRp, fmtDate } from "@/lib/constants";

export default async function OrdersHistoryPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth");
  }

  // Fetch Orders
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      order_type,
      total_fee,
      created_at,
      order_stops (
        stop_label
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-nav">
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm z-10 sticky top-0">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          Riwayat Pesanan 🧾
        </h1>
      </div>

      <main className="px-4 py-6 animate-screen-in">
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] || "var(--text-muted)";
              const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status;
              
              return (
                <Link 
                  href={`/order/${order.id}`} 
                  key={order.id}
                  className="block bg-white rounded-2xl p-4 border border-[var(--border)] shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg)] px-2 py-0.5 rounded-full uppercase">
                          {order.order_type === 'cepat' ? '⚡ Cepat' : '🛍️ Regular'}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {fmtDate(order.created_at).split(',')[0]}
                        </span>
                      </div>
                      <h3 className="font-bold text-[var(--text-primary)] text-sm">
                        {order.order_stops?.[0]?.stop_label || "Pesanan Custom"} 
                        {order.order_stops?.length > 1 && ` +${order.order_stops.length - 1} toko`}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--primary)] text-sm">
                        {fmtRp(order.total_fee)}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center text-xs font-semibold" style={{ color: statusColor }}>
                      {order.status === 'completed' ? <CheckCircle2 className="w-4 h-4 mr-1" /> : <Clock className="w-4 h-4 mr-1" />}
                      {statusLabel}
                    </div>
                    <div className="flex items-center text-[10px] font-bold text-[var(--text-secondary)]">
                      Detail <ChevronRight className="w-3 h-3 ml-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Belum ada pesanan</h3>
            <p className="text-[var(--text-secondary)] text-sm mb-6">Mulai pesan makanan atau barang favoritmu sekarang!</p>
            <Link 
              href="/search"
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold shadow-sm active:scale-95 transition-transform"
            >
              Cari Merchant
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
