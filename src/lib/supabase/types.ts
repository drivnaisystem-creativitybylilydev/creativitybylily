/**
 * Database types for Supabase
 * These match the schema we'll create in Supabase
 */

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: 'earrings' | 'necklaces' | 'bracelets';
          description: string;
          price: number;
          compare_at_price: number | null;
          image_url: string;
          images: string[]; // Array of image URLs
          variants: ProductVariant[];
          inventory_count: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Update']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          subtotal: number;
          tax: number;
          shipping: number;
          total: number;
          shipping_address: ShippingAddress;
          billing_address: BillingAddress;
          customer_email: string | null;
          customer_first_name: string | null;
          customer_last_name: string | null;
          customer_phone: string | null;
          payment_intent_id: string | null;
          tracking_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Update']>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          price: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['order_items']['Update']>;
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cart_items']['Update']>;
      };
      inventory: {
        Row: {
          id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          reserved_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['inventory']['Update']>;
      };
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'super_admin';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Update']>;
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          shippo_shipment_id: string | null;
          shippo_transaction_id: string | null;
          shippo_rate_id: string | null;
          label_url: string | null;
          label_pdf_url: string | null;
          tracking_number: string | null;
          tracking_status: string | null;
          tracking_status_details: string | null;
          carrier: string | null;
          service_level: string | null;
          service_level_name: string | null;
          shipping_cost: number | null;
          parcel_weight: number | null;
          parcel_length: number | null;
          parcel_width: number | null;
          parcel_height: number | null;
          from_address: any | null;
          to_address: any | null;
          status: 'pending' | 'created' | 'purchased' | 'failed' | 'refunded';
          metadata: any;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['shipments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['shipments']['Update']>;
      };
      events: {
        Row: {
          id: string;
          title: string;
          type: 'event' | 'popup' | 'market';
          description: string;
          start_date: string;
          end_date: string | null;
          location: string;
          link: string | null;
          is_featured: boolean;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Update']>;
      };
    };
  };
};

// Helper types
export type ProductVariant = {
  id: string;
  name: string;
  price_modifier: number; // Additional cost for this variant
  inventory: number;
};

export type ShippingAddress = {
  name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type BillingAddress = ShippingAddress;

// Convenience types
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Shipment = Database['public']['Tables']['shipments']['Row'];
export type Event = Database['public']['Tables']['events']['Row'];

