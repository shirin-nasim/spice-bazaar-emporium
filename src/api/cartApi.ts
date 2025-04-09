
import { supabase } from '@/lib/supabase';
import { Cart, CartItem } from '@/types/database.types';
import { getProductById } from './productApi';

// Cart Management
export async function getUserCart(userId: string): Promise<Cart | null> {
  // First check if user has an active cart
  const { data: existingCart, error: fetchError } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (existingCart) {
    return existingCart;
  }
  
  // If no cart exists, create one
  if (fetchError && fetchError.code === 'PGRST116') {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating cart:', createError);
      return null;
    }
    
    return newCart;
  }
  
  if (fetchError) {
    console.error('Error fetching cart:', fetchError);
    return null;
  }
  
  return null;
}

export interface CartItemType {
  id: number;
  productId: number | null;
  giftBoxId: number | null;
  isGiftBox: boolean;
  name: string;
  price: number;
  quantity: number;
  packSize: string | null;
  imageUrl: string | null;
  inStock: boolean;
}

export async function getCartItems(): Promise<CartItemType[]> {
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  
  // Get user's cart
  const cart = await getUserCart(session.user.id);
  if (!cart) return [];
  
  // Get cart items with product information
  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      pack_size,
      product_id,
      gift_box_id
    `)
    .eq('cart_id', cart.id);
  
  if (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
  
  // Transform cart items with product details
  const itemsWithDetails: CartItemType[] = [];
  
  for (const item of cartItems) {
    if (item.product_id) {
      // Handle product items
      const { data: product } = await supabase
        .from('products')
        .select('id, name, price, sale_price, image_url, in_stock')
        .eq('id', item.product_id)
        .single();
      
      if (product) {
        itemsWithDetails.push({
          id: item.id,
          productId: product.id,
          giftBoxId: null,
          isGiftBox: false,
          name: product.name,
          price: product.sale_price || product.price,
          quantity: item.quantity,
          packSize: item.pack_size,
          imageUrl: product.image_url,
          inStock: product.in_stock
        });
      }
    } else if (item.gift_box_id) {
      // Handle gift box items
      const { data: giftBox } = await supabase
        .from('gift_boxes')
        .select('id, name, price, image_url')
        .eq('id', item.gift_box_id)
        .single();
      
      if (giftBox) {
        itemsWithDetails.push({
          id: item.id,
          productId: null,
          giftBoxId: giftBox.id,
          isGiftBox: true,
          name: giftBox.name,
          price: giftBox.price,
          quantity: item.quantity,
          packSize: null,
          imageUrl: giftBox.image_url,
          inStock: true // Assume gift boxes are always in stock
        });
      }
    }
  }
  
  return itemsWithDetails;
}

export async function addToCart(
  cartId: number, 
  productId: number | null = null,
  giftBoxId: number | null = null,
  quantity: number = 1, 
  packSize: string | null = null
): Promise<boolean> {
  try {
    // Check if item is already in cart
    const { data: existingItems, error: fetchError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq(productId ? 'product_id' : 'gift_box_id', productId || giftBoxId);
    
    if (fetchError) {
      console.error('Error checking cart:', fetchError);
      return false;
    }
    
    // If pack size specified, check if specific pack size exists
    let existingItem = null;
    if (packSize && existingItems) {
      existingItem = existingItems.find(item => item.pack_size === packSize);
    } else if (existingItems && existingItems.length > 0) {
      existingItem = existingItems[0];
    }
    
    if (existingItem) {
      // Update quantity of existing item
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id);
      
      if (updateError) {
        console.error('Error updating cart item:', updateError);
        return false;
      }
    } else {
      // Add new item to cart
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cartId,
          product_id: productId,
          gift_box_id: giftBoxId,
          quantity,
          pack_size: packSize
        }]);
      
      if (insertError) {
        console.error('Error adding to cart:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(
  itemId: number, 
  quantity: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId);
    
    if (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating quantity:', error);
    return false;
  }
}

export async function removeCartItem(itemId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) {
      console.error('Error removing item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing item:', error);
    return false;
  }
}

export async function clearCart(): Promise<boolean> {
  try {
    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    // Get user's cart
    const cart = await getUserCart(session.user.id);
    if (!cart) return false;
    
    // Delete all items from the cart
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);
    
    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
}

export async function getCartCount(): Promise<number> {
  try {
    const cartItems = await getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}

export async function getCartTotal(): Promise<number> {
  try {
    const cartItems = await getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
}
