
import { supabase } from '@/lib/supabase';
import { Product, ProductPricing } from '@/types/database.types';

// Product Management
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  // Ensure all required fields are present with defaults if needed
  const productWithDefaults = {
    ...product,
    pack_sizes: product.pack_sizes || null,
    pack_prices: product.pack_prices || null,
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

export async function uploadProductImage(
  file: File,
  productId: number
): Promise<string | null> {
  try {
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${productId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }
    
    // Get the public URL of the uploaded file
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);
    
    if (!data) {
      console.error('Error getting public URL');
      return null;
    }
    
    // Update the product with the new image URL
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        image_url: data.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId);
    
    if (updateError) {
      console.error('Error updating product with image:', updateError);
      return null;
    }
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error in file upload process:', error);
    return null;
  }
}

export async function updateProductPricing(
  id: number,
  packSizes: string[],
  packPrices: ProductPricing[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ 
        pack_sizes: packSizes,
        pack_prices: packPrices,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product pricing:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating product pricing:', error);
    return false;
  }
}
