"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { fmtRp } from "@/lib/constants";

interface MenuItemProps {
  item: any;
  merchant: any;
}

export default function MenuItem({ item, merchant }: MenuItemProps) {
  const [qty, setQty] = useState(0);
  const [notes, setNotes] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    if (qty === 0) setQty(1);
    setIsExpanded(true);
  };

  const handleIncrement = () => setQty((q) => q + 1);
  const handleDecrement = () => {
    if (qty > 1) {
      setQty((q) => q - 1);
    } else {
      setQty(0);
      setIsExpanded(false);
    }
  };

  const handleSaveToCart = () => {
    if (qty > 0) {
      addItem({
        id: `${item.id}-${Date.now()}`,
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
        notes: notes.trim() || undefined,
        merchantId: merchant.id,
        merchantName: merchant.name,
      });
      // Reset form
      setQty(0);
      setNotes("");
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border-b border-[var(--border)] last:border-0 py-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h4 className="font-bold text-[var(--text-primary)] mb-1">{item.name}</h4>
          {item.description && (
            <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="font-bold text-[var(--text-primary)] text-sm">
            {fmtRp(item.price)}
          </div>
        </div>
        
        {/* Item Image or Add Button */}
        <div className="flex flex-col items-end">
          {item.image_url ? (
            <div className="w-20 h-20 bg-gray-100 rounded-[14px] overflow-hidden mb-2 shadow-sm border border-[var(--border)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-2 opacity-0"></div> // spacer
          )}
          
          {!isExpanded && (
            <button
              onClick={handleAdd}
              disabled={!item.is_available}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95 border ${
                item.is_available 
                  ? "bg-white text-[var(--primary)] border-[var(--primary)]" 
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              {item.is_available ? "Tambah" : "Habis"}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Order Controls */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center bg-white border border-[var(--border)] rounded-full shadow-sm p-1">
              <button 
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center text-[var(--primary)] active:bg-[var(--primary-light)] rounded-full transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-sm">{qty}</span>
              <button 
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center text-[var(--primary)] active:bg-[var(--primary-light)] rounded-full transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="font-bold text-[var(--primary)]">
              {fmtRp(item.price * qty)}
            </div>
          </div>
          
          <input
            type="text"
            placeholder="Catatan (opsional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm bg-[var(--bg)] border border-[var(--border)] rounded-xl px-3 py-2.5 mb-3 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all"
          />
          
          <button
            onClick={handleSaveToCart}
            className="w-full bg-[var(--primary)] text-white font-bold rounded-xl py-2.5 active:scale-[0.98] transition-transform shadow-sm flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Masukkan Keranjang
          </button>
        </div>
      )}
    </div>
  );
}
