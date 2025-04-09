
import { supabase } from '@/lib/supabase';

export async function isAdmin(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) return false;

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
