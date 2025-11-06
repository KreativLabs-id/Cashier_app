// Database Types
export type Database = {
  Tables: {
    products: {
      Row: {
        id: string;
        name: string;
        base_price: number;
        is_active: boolean;
        created_at: string;
      };
      Insert: {
        id: string;
        name: string;
        base_price: number;
        is_active?: boolean;
        created_at?: string;
      };
      Update: {
        id?: string;
        name?: string;
        base_price?: number;
        is_active?: boolean;
        created_at?: string;
      };
    };
    product_variants: {
      Row: {
        id: string;
        product_id: string;
        variant_name: string;
        base_price: number;
        created_at: string;
      };
      Insert: {
        id?: string;
        product_id: string;
        variant_name: string;
        base_price: number;
        created_at?: string;
      };
      Update: {
        id?: string;
        product_id?: string;
        variant_name?: string;
        base_price?: number;
        created_at?: string;
      };
    };
    orders: {
      Row: {
        id: string;
        order_no: string;
        order_time: string;
        subtotal: number;
        discount_amount: number;
        extra_fee: number;
        total: number;
        paid_amount: number;
        change_amount: number;
        pay_method: 'cash' | 'qris' | 'ewallet';
        notes: string | null;
        created_at: string;
      };
      Insert: {
        id?: string;
        order_no: string;
        order_time?: string;
        subtotal: number;
        discount_amount?: number;
        extra_fee?: number;
        total: number;
        paid_amount: number;
        change_amount: number;
        pay_method: 'cash' | 'qris' | 'ewallet';
        notes?: string | null;
        created_at?: string;
      };
      Update: {
        id?: string;
        order_no?: string;
        order_time?: string;
        subtotal?: number;
        discount_amount?: number;
        extra_fee?: number;
        total?: number;
        paid_amount?: number;
        change_amount?: number;
        pay_method?: 'cash' | 'qris' | 'ewallet';
        notes?: string | null;
        created_at?: string;
      };
    };
    order_items: {
      Row: {
        id: string;
        order_id: string;
        product_id: string;
        variant_name: string | null;
        qty: number;
        unit_price: number;
        notes: string | null;
        created_at: string;
      };
      Insert: {
        id?: string;
        order_id: string;
        product_id: string;
        variant_name?: string | null;
        qty?: number;
        unit_price: number;
        notes?: string | null;
        created_at?: string;
      };
      Update: {
        id?: string;
        order_id?: string;
        product_id?: string;
        variant_name?: string | null;
        qty?: number;
        unit_price?: number;
        notes?: string | null;
        created_at?: string;
      };
    };
    shifts: {
      Row: {
        id: string;
        shift_date: string;
        opened_at: string | null;
        closed_at: string | null;
        opening_cash: number | null;
        closing_cash: number | null;
        notes: string | null;
        created_at: string;
      };
      Insert: {
        id?: string;
        shift_date: string;
        opened_at?: string | null;
        closed_at?: string | null;
        opening_cash?: number | null;
        closing_cash?: number | null;
        notes?: string | null;
        created_at?: string;
      };
      Update: {
        id?: string;
        shift_date?: string;
        opened_at?: string | null;
        closed_at?: string | null;
        opening_cash?: number | null;
        closing_cash?: number | null;
        notes?: string | null;
        created_at?: string;
      };
    };
  };
  Views: {
    daily_summary: {
      Row: {
        date: string;
        order_count: number;
        total_revenue: number;
        avg_order_value: number;
        cash_total: number;
        qris_total: number;
        ewallet_total: number;
      };
    };
  };
  Functions: {
    generate_order_no: {
      Args: Record<string, never>;
      Returns: string;
    };
  };
};

// Exported Types
export type Product = Database['Tables']['products']['Row'];
export type ProductVariant = Database['Tables']['product_variants']['Row'];
export type Order = Database['Tables']['orders']['Row'];
export type OrderItem = Database['Tables']['order_items']['Row'];
export type Shift = Database['Tables']['shifts']['Row'];
export type DailySummary = Database['Views']['daily_summary']['Row'];

// Application-specific Types
export interface ProductWithVariants {
  id: string;
  name: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
  product_variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  qty: number;
  notes: string;
}

export interface CreateOrderPayload {
  subtotal: number;
  discount_amount: number;
  extra_fee: number;
  total: number;
  paid_amount: number;
  change_amount: number;
  pay_method: 'cash' | 'qris' | 'ewallet';
  notes?: string;
  items: {
    product_id: string;
    variant_name: string | null;
    qty: number;
    unit_price: number;
    notes?: string;
  }[];
}
