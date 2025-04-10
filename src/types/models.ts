
export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  origin: string;
  useCase: string;
  packSizes: string[];
  shelfLife: string;
  isGift: boolean;
  isBulk: boolean;
  prices: {
    INR: number;
    AED: number;
    USD: number;
    GBP: number;
  };
  hsCode: string;
  sourcing: string;
  sourcingCity?: string;
  supplierDetails?: string;
  productImage?: string;
  description?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  userName: string;
  date: string;
}
