
import { getProducts, getFeaturedProducts, getProductById, getProductBySlug } from '@/api/productApi';
import { Product } from '@/types/database.types';

export type ProductCategory = string;

export async function searchProducts(query: string): Promise<Product[]> {
  return await getProducts(undefined, undefined, query);
}

export { getFeaturedProducts, getProductById, getProductBySlug };
