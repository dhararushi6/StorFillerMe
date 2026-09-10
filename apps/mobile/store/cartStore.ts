import { create } from 'zustand';

import { CART_BILL_DATA, INITIAL_CART_ITEMS, type CartItem } from '@/constants/cart';

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  getItemQuantity: (id: string) => number;
  getTotalCount: () => number;
  getItemsTotal: () => number;
  getTotalAmount: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: INITIAL_CART_ITEMS,

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    });
  },

  incrementItem: (id) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    }));
  },

  decrementItem: (id) => {
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  getItemQuantity: (id) => {
    const item = get().items.find((i) => i.id === id);
    return item ? item.quantity : 0;
  },

  getTotalCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getItemsTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getTotalAmount: () => {
    const itemsTotal = get().getItemsTotal();
    if (get().items.length === 0) return 0;
    return itemsTotal + CART_BILL_DATA.deliveryFeeAmount + CART_BILL_DATA.handlingFeeAmount;
  },

  clearCart: () => {
    set({ items: [] });
  },
}));
