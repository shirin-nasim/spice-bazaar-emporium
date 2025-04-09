
import { supabase } from '@/lib/supabase';

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createCategory = async (categoryData: any) => {
  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0];
};

export const updateCategory = async (id: string, categoryData: any) => {
  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0];
};

export const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const getSubcategories = async (categoryId?: string) => {
  let query = supabase
    .from('subcategories')
    .select('*')
    .order('name');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
