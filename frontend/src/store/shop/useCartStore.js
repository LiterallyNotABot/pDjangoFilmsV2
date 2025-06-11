import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: {},

      addItem: (product, quantity) => {
        const items = { ...get().items };
        const existing = items[product.id];
        items[product.id] = {
          product: { ...product },
          quantity: existing ? existing.quantity + quantity : quantity,
        };
        set({ items });
      },

      removeItem: (productId) => {
        const items = { ...get().items };
        delete items[productId];
        set({ items });
      },

      clearCart: () => set({ items: {} }),
    }),
    {
      name: "cart-storage", 
    }
  )
);

export default useCartStore;
