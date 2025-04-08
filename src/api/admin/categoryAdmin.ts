
import { supabase } from '@/lib/supabase';
import { Category, Subcategory } from '@/types/database.types';

// Get categories and subcategories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
  
  return data || [];
}

// Category Management
export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating category:', error);
    return null;
  }
  
  return data;
}

export async function updateCategory(
  id: number,
  category: Partial<Omit<Category, 'id' | 'created_at'>>
): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating category:', error);
    return null;
  }
  
  return data;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }
  
  return true;
}

// Subcategory Management
export async function createSubcategory(subcategory: Omit<Subcategory, 'id' | 'created_at'>): Promise<Subcategory | null> {
  const { data, error } = await supabase
    .from('subcategories')
    .insert([subcategory])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating subcategory:', error);
    return null;
  }
  
  return data;
}

export async function updateSubcategory(
  id: number,
  subcategory: Partial<Omit<Subcategory, 'id' | 'created_at'>>
): Promise<Subcategory | null> {
  const { data, error } = await supabase
    .from('subcategories')
    .update(subcategory)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating subcategory:', error);
    return null;
  }
  
  return data;
}

export async function deleteSubcategory(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
  
  return true;
}
