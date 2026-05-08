"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Clock, MapPin, Navigation, Truck, MessageCircle } from "lucide-react";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, fmtRp, fmtDate } from "@/lib/constants";

interface OrderTrackerProps {
  initialOrder: any;
  orderStops: any[];
}

export default function OrderTracker({ initialOrder, orderStops }: OrderTrackerProps) {
  const supabase = createClient();
  const [order, setOrder] = useState(initialOrder);

  // Real-time subscription for order status updates
  useEffect(() => {
    const channel = supabase
      .channel(`order_${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev: any) => ({ ...prev, ...payload.new }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id, supabase]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-6 h-6" />;
      case "accepted": return <CheckCircle2 className="w-6 h-6" />;
      case "picked_up": return <Truck className="w-6 h-6" />;
      case "en_route": return <Navigation className="w-6 h-6" />;
      case "completed": return <CheckCircle2 className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const statusColor = ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] || "var(--text-muted)";
  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status;

  return (
    <div className="space-y-6 pb-10">
      {/* Status Banner */}
      <div 
        className="rounded-2xl p-5 text-white flex items-center shadow-md relative overflow-hidden"
        style={{ backgroundColor: statusColor }}
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="mr-4 p-3 bg-white/20 rounded-full backdrop-blur-sm">
          {getStatusIcon(order.status)}
        </div>
        <div>
          <h2 className="font-bold text-lg mb-0.5 leading-none">{statusLabel}</h2>
          <p className="text-white/80 text-xs font-medium">
            {order.status === "pending" ? "Mencari driver terdekat..." : 
             order.status === "completed" ? "Pesanan telah selesai." :
             "Driver sedang memproses pesananmu."}
          </p>
        </div>
      </div>

      {/* Driver Info (If accepted) */}
      {order.drivers && (
        <div className="bg-white rounded-2xl border border-[var(--border)] p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden border border-[var(--border)]">
              {order.drivers.profiles.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={order.drivers.profiles.avatar_url} alt="Driver" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-lg text-gray-400">
                  {order.drivers.profiles.name?.charAt(0) || "D"}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-bold text-[var(--text-primary)] text-sm mb-0.5">
                {order.drivers.profiles.name}
              </h4>
              <div className="text-xs text-[var(--text-secondary)] font-medium flex items-center bg-[var(--bg)] px-2 py-0.5 rounded-md inline-flex">
                <Star className="w-3 h-3 text-[var(--warning)] fill-current mr-1" />
                {order.drivers.rating} • {order.drivers.vehicle_plat || order.drivers.vehicle_type}
              </div>
            </div>
          </div>
          
          <a 
            href={`https://wa.me/${order.drivers.profiles.phone.replace(/[^0-9]/g, '')}`} 
            target="_blank" rel="noreferrer"
            className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>
        </div>
      )}

      {/* Rute / Stops */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-sm">
        <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1.5 text-[var(--primary)]" />
          Detail Rute
        </h3>
        
        <div className="relative pl-6 space-y-6">
          {/* Line connecting stops */}
          <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-gray-200"></div>

          {orderStops.map((stop: any, index: number) => (
            <div key={stop.id} className="relative">
              <div className="absolute -left-6 w-3 h-3 bg-gray-200 rounded-full border-2 border-white mt-1"></div>
              <h4 className="font-bold text-sm text-[var(--text-primary)]">{stop.stop_label}</h4>
              {stop.address && <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stop.address}</p>}
            </div>
          ))}

          {/* Destination */}
          <div className="relative">
            <div className="absolute -left-[26px] w-4 h-4 bg-[var(--primary)] rounded-full border-2 border-white mt-0.5 shadow-sm"></div>
            <h4 className="font-bold text-sm text-[var(--primary)]">Tujuan Pengiriman</h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
              {order.delivery_addr}
            </p>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-[var(--text-primary)] mb-2">Rincian Pembayaran</h3>
        
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Subtotal Barang</span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Ongkos Kirim</span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(order.ongkir)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">Biaya Layanan</span>
          <span className="font-semibold text-[var(--text-primary)]">{fmtRp(order.service_fee)}</span>
        </div>
        
        <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center">
          <span className="font-bold text-[var(--text-primary)]">Total Bayar (COD)</span>
          <span className="font-black text-[var(--primary)] text-lg">{fmtRp(order.total_fee)}</span>
        </div>
      </div>
      
      {/* Order Cepat specific note */}
      {order.order_type === "cepat" && order.subtotal === 0 && (
        <div className="bg-[var(--primary-light)] text-[var(--primary)] text-xs p-3 rounded-xl border border-[var(--primary)] border-opacity-20 font-medium">
          💡 Ini adalah Order Cepat. Total harga barang akan diupdate oleh driver setelah membelikan pesananmu.
        </div>
      )}
    </div>
  );
}
