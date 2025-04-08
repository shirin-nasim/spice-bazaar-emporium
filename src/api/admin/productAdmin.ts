
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';

// Product Management
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  // Ensure all required fields are present with defaults if needed
  const productWithDefaults = {
    ...product,
    pack_sizes: product.pack_sizes || null,
    rating: product.rating || 0,
    tags: product.tags || null,
    sourcing_city: product.sourcing_city || null,
    supplier_details: product.supplier_details || null,
  };
  
  const { data, error } = await supabase
    .from('products')
    .insert([productWithDefaults])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating product:', error);
    return null;
  }
  
  return data;
}

export async function updateProduct(
  id: number, 
  product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product | null> {
  // Add updated_at timestamp
  const updates = {
    ...product,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating product:', error);
    return null;
  }
  
  return data;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }
  
  return true;
}
