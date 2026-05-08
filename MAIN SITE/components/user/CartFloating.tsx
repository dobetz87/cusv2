"use client";

import { useCartStore } from "@/store/cartStore";
import { fmtRp } from "@/lib/constants";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartFloating() {
  const { getCartCount, getCartTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const count = getCartCount();
  const total = getCartTotal();

  if (!mounted || count === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 z-40 animate-slide-up">
      <Link 
        href="/checkout"
        className="bg-[var(--primary)] text-white rounded-2xl p-4 shadow-lg flex items-center justify-between active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-white text-[var(--primary)] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
              {count}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-medium text-white/80 leading-none mb-1">
              Total Pesanan
            </div>
            <div className="font-bold">
              {fmtRp(total)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center font-bold text-sm">
          Checkout
          <ChevronRight className="w-5 h-5 ml-1" />
        </div>
      </Link>
    </div>
  );
}
