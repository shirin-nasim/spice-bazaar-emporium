
import { supabase } from '@/lib/supabase';
import { Cart, CartItem } from '@/types/database.types';

export async function getUserCart(userId: string): Promise<Cart | null> {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No cart exists yet, create one
      return createCart(userId);
    }
    console.error('Error fetching user cart:', error);
    return null;
  }
  
  return data;
}

export async function createCart(userId: string): Promise<Cart | null> {
  const { data, error } = await supabase
    .from('carts')
    .insert([{ user_id: userId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating cart:', error);
    return null;
  }
  
  return data;
}

export async function getCartItems(cartId: number): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId);
  
  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
  
  return data || [];
}

export async function addToCart(
  cartId: number,
  productId: number,
  quantity: number,
  packSize?: string
): Promise<CartItem | null> {
  // Check if item already exists
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .eq('pack_size', packSize || null);
  
  if (existingItems && existingItems.length > 0) {
    // Update quantity
    const existingItem = existingItems[0];
    const newQuantity = existingItem.quantity + quantity;
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('id', existingItem.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
    
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          cart_id: cartId,
          product_id: productId,
          quantity,
          pack_size: packSize || null
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding item to cart:', error);
      return null;
    }
    
    return data;
  }
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number
): Promise<CartItem | null> {
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('id', cartItemId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating cart item:', error);
    return null;
  }
  
  return data;
}

export async function removeCartItem(cartItemId: number): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);
  
  if (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
  
  return true;
}

export async function clearCart(cartId: number): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);
  
  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
  
  return true;
}
