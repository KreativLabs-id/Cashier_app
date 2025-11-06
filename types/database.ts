export type Database = {
  public: {
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
      toppings: {
        Row: {
          id: string;
          name: string;
          price: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          price: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          is_active?: boolean;
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
          qty: number;
          unit_price: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          qty?: number;
          unit_price: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          qty?: number;
          unit_price?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
      order_item_toppings: {
        Row: {
          id: string;
          order_item_id: string;
          topping_id: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          topping_id: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_item_id?: string;
          topping_id?: string;
          price?: number;
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
};

// Types untuk aplikasi
export type Product = Database['public']['Tables']['products']['Row'];
export type Topping = Database['public']['Tables']['toppings']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderItemTopping = Database['public']['Tables']['order_item_toppings']['Row'];
export type DailySummary = Database['public']['Views']['daily_summary']['Row'];

// Type untuk cart item (di frontend)
export type CartItemTopping = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = {
  id: string; // temporary ID untuk cart
  product: Product;
  qty: number;
  toppings: CartItemTopping[];
  notes?: string;
};

// Type untuk create order
export type CreateOrderItem = {
  product_id: string;
  qty: number;
  unit_price: number;
  notes?: string;
  toppings: {
    topping_id: string;
    price: number;
  }[];
};

export type CreateOrderPayload = {
  order_time: string;
  items: CreateOrderItem[];
  discount_amount: number;
  extra_fee: number;
  pay_method: 'cash' | 'qris' | 'ewallet';
  paid_amount: number;
  notes?: string;
};
