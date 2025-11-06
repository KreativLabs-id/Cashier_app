import { create } from 'zustand';
import type { CartItem, Product, Topping } from '@/types/database';

type DiscountType = 'amount' | 'percentage';

interface CartStore {
  // Cart items
  items: CartItem[];
  
  // Discount & Extra Fee
  discountType: DiscountType;
  discountValue: number;
  extraFee: number;
  
  // Payment
  payMethod: 'cash' | 'qris' | 'ewallet';
  paidAmount: number;
  
  // Actions
  addItem: (product: Product, toppings: Topping[], qty?: number, notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateItemQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  
  // Discount & Fee
  setDiscount: (type: DiscountType, value: number) => void;
  setExtraFee: (fee: number) => void;
  
  // Payment
  setPayMethod: (method: 'cash' | 'qris' | 'ewallet') => void;
  setPaidAmount: (amount: number) => void;
  
  // Computed values
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getChange: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  // Initial state
  items: [],
  discountType: 'amount',
  discountValue: 0,
  extraFee: 0,
  payMethod: 'cash',
  paidAmount: 0,
  
  // Add item to cart
  addItem: (product, toppings, qty = 1, notes) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      product,
      qty,
      toppings: toppings.map(t => ({
        id: t.id,
        name: t.name,
        price: t.price,
      })),
      notes,
    };
    
    set(state => ({
      items: [...state.items, newItem],
    }));
  },
  
  // Remove item from cart
  removeItem: (itemId) => {
    set(state => ({
      items: state.items.filter(item => item.id !== itemId),
    }));
  },
  
  // Update item quantity
  updateItemQty: (itemId, qty) => {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }
    
    set(state => ({
      items: state.items.map(item =>
        item.id === itemId ? { ...item, qty } : item
      ),
    }));
  },
  
  // Clear cart
  clearCart: () => {
    set({
      items: [],
      discountType: 'amount',
      discountValue: 0,
      extraFee: 0,
      payMethod: 'cash',
      paidAmount: 0,
    });
  },
  
  // Set discount
  setDiscount: (type, value) => {
    set({ discountType: type, discountValue: Math.max(0, value) });
  },
  
  // Set extra fee
  setExtraFee: (fee) => {
    set({ extraFee: Math.max(0, fee) });
  },
  
  // Set payment method
  setPayMethod: (method) => {
    set({ payMethod: method });
  },
  
  // Set paid amount
  setPaidAmount: (amount) => {
    set({ paidAmount: Math.max(0, amount) });
  },
  
  // Get subtotal (sum of all items with toppings)
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => {
      const toppingTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
      return total + (item.qty * (item.product.base_price + toppingTotal));
    }, 0);
  },
  
  // Get discount amount
  getDiscountAmount: () => {
    const { discountType, discountValue } = get();
    const subtotal = get().getSubtotal();
    
    if (discountType === 'percentage') {
      return Math.round(subtotal * (discountValue / 100));
    }
    
    return Math.min(discountValue, subtotal); // Tidak boleh lebih dari subtotal
  },
  
  // Get total
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const { extraFee } = get();
    
    return Math.max(0, subtotal - discount + extraFee);
  },
  
  // Get change
  getChange: () => {
    const { paidAmount } = get();
    const total = get().getTotal();
    
    return Math.max(0, paidAmount - total);
  },
}));
