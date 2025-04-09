
import { supabase } from '@/lib/supabase';

// Add to cart function (supporting both products and gift boxes)
export async function addToCart(
  itemId: number, 
  quantity: number, 
  packSize: string | null = null,
  isGiftBox: boolean = false
): Promise<boolean> {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Check if user has a cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  // If no cart exists, create one
  let cartId;
  if (cartError || !cart) {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .single();
    
    if (newCartError || !newCart) {
      console.error('Error creating cart:', newCartError);
      return false;
    }
    
    cartId = newCart.id;
  } else {
    cartId = cart.id;
  }
  
  // Check if item already exists in cart
  const { data: existingItem, error: existingItemError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq(isGiftBox ? 'gift_box_id' : 'product_id', itemId)
    .eq('pack_size', packSize)
    .maybeSingle();
  
  // If item exists, update quantity
  if (existingItem && !existingItemError) {
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);
    
    if (updateError) {
      console.error('Error updating cart item:', updateError);
      return false;
    }
  } else {
    // If item doesn't exist, insert new item
    const newItem = {
      cart_id: cartId,
      quantity: quantity,
      pack_size: packSize,
    };
    
    // Add either product_id or gift_box_id based on the type
    if (isGiftBox) {
      newItem['gift_box_id'] = itemId;
      newItem['product_id'] = null;
    } else {
      newItem['product_id'] = itemId;
      newItem['gift_box_id'] = null;
    }
    
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert(newItem);
    
    if (insertError) {
      console.error('Error adding item to cart:', insertError);
      return false;
    }
  }
  
  return true;
}

// Get cart items (including gift boxes)
export async function getCartItems() {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (cartError || !cart) {
    // No cart exists yet
    return [];
  }
  
  // Get cart items with product details
  const { data: cartProductItems, error: productItemsError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      pack_size,
      products:product_id(
        id,
        name,
        price,
        sale_price,
        image_url,
        in_stock
      )
    `)
    .eq('cart_id', cart.id)
    .not('product_id', 'is', null);
  
  // Get cart items with gift box details
  const { data: cartGiftBoxItems, error: giftBoxItemsError } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      gift_boxes:gift_box_id(
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('cart_id', cart.id)
    .not('gift_box_id', 'is', null);
  
  if (productItemsError) {
    console.error('Error fetching cart product items:', productItemsError);
    return [];
  }
  
  if (giftBoxItemsError) {
    console.error('Error fetching cart gift box items:', giftBoxItemsError);
    return [];
  }
  
  // Format product items
  const productItems = cartProductItems
    ? cartProductItems.map(item => ({
        id: item.id,
        productId: item.products?.id,
        name: item.products?.name,
        price: item.products?.sale_price || item.products?.price,
        originalPrice: item.products?.price,
        image: item.products?.image_url,
        quantity: item.quantity,
        packSize: item.pack_size,
        inStock: item.products?.in_stock,
        isGiftBox: false
      }))
    : [];
  
  // Format gift box items
  const giftBoxItems = cartGiftBoxItems
    ? cartGiftBoxItems.map(item => ({
        id: item.id,
        productId: item.gift_boxes?.id,
        name: item.gift_boxes?.name,
        price: item.gift_boxes?.price,
        originalPrice: item.gift_boxes?.price,
        image: item.gift_boxes?.image_url,
        quantity: item.quantity,
        packSize: null,
        inStock: true,
        isGiftBox: true
      }))
    : [];
  
  // Combine and return all items
  return [...productItems, ...giftBoxItems];
}

// Update cart item
export async function updateCartItem(id: number, quantity: number): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating cart item:', error);
    return false;
  }
  
  return true;
}

// Remove item from cart
export async function removeFromCart(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error removing cart item:', error);
    return false;
  }
  
  return true;
}

// Clear all items from cart
export async function clearCart(): Promise<boolean> {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Get the user's cart
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (cartError || !cart) {
    // No cart exists
    return true;
  }
  
  // Delete all items in the cart
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id);
  
  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
  
  return true;
}
