import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '@/types/database';

interface CartState {
  items: CartItem[];
  discount: number;
  discountType: 'amount' | 'percentage';
  extraFee: number;
  payMethod: 'cash' | 'qris' | 'ewallet';
  paidAmount: number;
  
  // Actions
  addItem: (product: Product, variant: ProductVariant | null, qty: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateItemQty: (itemId: string, qty: number) => void;
  updateItemNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  
  setDiscount: (type: 'amount' | 'percentage', value: number) => void;
  setExtraFee: (fee: number) => void;
  setPayMethod: (method: 'cash' | 'qris' | 'ewallet') => void;
  setPaidAmount: (amount: number) => void;
  
  // Computed
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getChange: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discount: 0,
      discountType: 'amount',
      extraFee: 0,
      payMethod: 'cash',
      paidAmount: 0,
  
  addItem: (product, variant, qty, notes = '') => {
    const newItem: CartItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      product,
      variant,
      qty,
      notes,
    };
    
    set((state) => ({
      items: [...state.items, newItem],
    }));
  },
  
  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },
  
  updateItemQty: (itemId, qty) => {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }
    
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, qty } : item
      ),
    }));
  },
  
  updateItemNotes: (itemId, notes) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, notes } : item
      ),
    }));
  },
  
  clearCart: () => {
    set({
      items: [],
      discount: 0,
      discountType: 'amount',
      extraFee: 0,
      payMethod: 'cash',
      paidAmount: 0,
    });
  },
  
  setDiscount: (type, value) => {
    set({ discountType: type, discount: value });
  },
  
  setExtraFee: (fee) => {
    set({ extraFee: fee });
  },
  
  setPayMethod: (method) => {
    set({ payMethod: method });
  },
  
  setPaidAmount: (amount) => {
    set({ paidAmount: amount });
  },
  
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => {
      // Validasi data item untuk mencegah error
      if (!item || !item.product) return sum;
      
      const price = item.variant?.base_price ?? item.product?.base_price ?? 0;
      const qty = item.qty ?? 0;
      return sum + (price * qty);
    }, 0);
  },
  
  getDiscountAmount: () => {
    const { discount, discountType } = get();
    const subtotal = get().getSubtotal();
    
    if (discountType === 'percentage') {
      return Math.round((subtotal * discount) / 100);
    }
    return discount;
  },
  
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const { extraFee } = get();
    
    return subtotal - discountAmount + extraFee;
  },
  
  getChange: () => {
    const { paidAmount } = get();
    const total = get().getTotal();
    return Math.max(0, paidAmount - total);
  },
    }),
    {
      name: 'cart-storage', // nama key di localStorage
      storage: createJSONStorage(() => localStorage),
      // Validasi dan bersihkan data corrupt saat hydration
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          // Filter items yang valid saja
          state.items = state.items.filter((item: any) => 
            item && item.product && (item.product.base_price !== undefined)
          );
        }
      },
    }
  )
);
