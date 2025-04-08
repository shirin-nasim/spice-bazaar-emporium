
import { supabase } from '@/lib/supabase';

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
