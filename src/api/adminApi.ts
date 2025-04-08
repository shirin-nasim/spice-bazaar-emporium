import { supabase } from '@/lib/supabase';
import { AdminUser, Category, Product, Subcategory } from '@/types/database.types';

// Check if current user is admin
export async function isAdmin(): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) return false;
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.user.id)
    .single();
  
  if (error || !data) return false;
  return true;
}

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

// Admin User Management
export async function getAllAdmins(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .order('email');
  
  if (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
  
  return data || [];
}

export async function addAdmin(email: string): Promise<AdminUser | null> {
  // First check if user exists in auth
  const { data: { users } = {}, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError || !users) {
    console.error('Error finding users:', userError);
    return null;
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.error('User not found with email:', email);
    return null;
  }
  
  // Add user to admin_users table
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ id: user.id, email }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding admin user:', error);
    return null;
  }
  
  return data;
}

export async function removeAdmin(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing admin user:', error);
    return false;
  }
  
  return true;
}
