
import { supabase } from '@/lib/supabase';
import { Wishlist } from '@/types/database.types';

export async function getUserWishlist(userId: string): Promise<Wishlist[]> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user wishlist:', error);
    return [];
  }
  
  return data || [];
}

export async function addToWishlist(
  userId: string,
  productId: number
): Promise<Wishlist | null> {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ user_id: userId, product_id: productId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }
  
  return data;
}

export async function removeFromWishlist(
  userId: string,
  productId: number
): Promise<boolean> {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  
  if (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
  
  return true;
}

export async function isInWishlist(
  userId: string,
  productId: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  
  if (error) {
    if (error.code !== 'PGRST116') { // Not found error
      console.error('Error checking wishlist:', error);
    }
    return false;
  }
  
  return !!data;
}
