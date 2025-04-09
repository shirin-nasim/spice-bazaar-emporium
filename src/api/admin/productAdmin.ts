
import { supabase } from '@/lib/supabase';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), subcategories(*)')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createProduct = async (productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0];
};

export const updateProduct = async (id: string, productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0];
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const uploadProductImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('product_images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw new Error(error.message);
  }

  const publicUrl = supabase.storage
    .from('product_images')
    .getPublicUrl(data.path);

  return publicUrl.data.publicUrl;
};

export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), subcategories(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
