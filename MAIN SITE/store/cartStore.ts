import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // usually a mix of menu_id or just an index
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  notes?: string;
  merchantId: string;
  merchantName: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          // Check if same item & same notes exists
          const existingIdx = state.items.findIndex(
            (i) => i.menuItemId === newItem.menuItemId && i.notes === newItem.notes
          );

          if (existingIdx !== -1) {
            const newItems = [...state.items];
            newItems[existingIdx].qty += newItem.qty;
            return { items: newItems };
          }
          
          return { items: [...state.items, newItem] };
        });
      },
      updateQty: (id, delta) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item.id === id) {
              const newQty = item.qty + delta;
              return { ...item, qty: newQty > 0 ? newQty : 0 };
            }
            return item;
          }).filter((item) => item.qty > 0);
          
          return { items: newItems };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.qty, 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.qty, 0);
      },
    }),
    {
      name: "cus-cart-storage",
    }
  )
);
