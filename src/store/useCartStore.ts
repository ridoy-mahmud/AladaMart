import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  color?: string;
  size?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i._id === item._id && i.color === item.color && i.size === item.size);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i._id === item._id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
            )
          };
        }
        return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i._id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => 
          i._id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    }),
    { name: 'shopmart-cart' }
  )
);
