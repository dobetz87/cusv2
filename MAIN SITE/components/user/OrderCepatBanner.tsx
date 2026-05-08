import Link from "next/link";
import { Zap } from "lucide-react";

export default function OrderCepatBanner() {
  return (
    <div className="bg-gradient-to-r from-[var(--primary)] to-[#ff8a50] rounded-2xl p-5 text-white shadow-md relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1 flex items-center">
            <Zap className="w-5 h-5 mr-1.5 fill-current" />
            Order Cepat
          </h3>
          <p className="text-white/90 text-sm font-medium mb-3">
            Bebas ketik aja mau pesen apa
          </p>
          <Link 
            href="/order-cepat" 
            className="inline-block bg-white text-[var(--primary)] px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
