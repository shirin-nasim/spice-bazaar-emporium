
import { supabase } from '@/lib/supabase';
import { AdminUser } from '@/types/database.types';

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
  const { data: { users } = { users: [] }, error: userError } = await supabase.auth.admin.listUsers();
  
  if (userError) {
    console.error('Error finding users:', userError);
    return null;
  }
  
  // Type assertion to handle possible undefined users
  const safeUsers = users || [];
  
  // Find user with matching email
  const user = safeUsers.find(u => {
    if (typeof u === 'object' && u !== null && 'email' in u) {
      return u.email === email;
    }
    return false;
  });
  
  if (!user || !('id' in user) || !user.email) {
    console.error('User not found with email:', email);
    return null;
  }
  
  // Add user to admin_users table
  const { data, error } = await supabase
    .from('admin_users')
    .insert([{ id: user.id, email: user.email }])
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
