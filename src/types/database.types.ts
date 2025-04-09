
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Subcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category_id: number | null;
  subcategory_id: number | null;
  price: number;
  sale_price: number | null;
  origin: string | null;
  use_case: string | null;
  pack_sizes: string[] | null;
  shelf_life: string | null;
  is_gift_suitable: boolean;
  is_bulk_available: boolean;
  rating: number;
  weight: string | null;
  tags: string[] | null;
  image_url: string | null;
  hs_code: string | null;
  sourcing: string | null;
  sourcing_city: string | null;
  supplier_details: string | null;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface GiftBox {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string | null;
  items: string[];
  featured: boolean;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Wishlist {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
}

export interface Cart {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number | null;
  gift_box_id: number | null; 
  quantity: number;
  pack_size: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: string | null;
  status: string;
  total_amount: number;
  shipping_address: any | null;
  billing_address: any | null;
  payment_method: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  gift_box_id: number | null;
  product_name: string;
  quantity: number;
  price: number;
  pack_size: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
