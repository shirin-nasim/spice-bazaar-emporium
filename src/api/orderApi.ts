
import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types/database.types';
import { clearCart, getCartItems } from './cartApi';
import { getProductById } from './productApi';

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
  
  return data || [];
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
  
  return data;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  if (error) {
    console.error(`Error fetching items for order ${orderId}:`, error);
    return [];
  }
  
  return data || [];
}

export async function createOrder(
  userId: string,
  cartId: number,
  shippingAddress: any,
  billingAddress: any,
  paymentMethod: string
): Promise<Order | null> {
  // Get cart items
  const cartItems = await getCartItems(cartId);
  if (!cartItems.length) {
    console.error('Cannot create order: cart is empty');
    return null;
  }

  // Calculate total
  let totalAmount = 0;
  const orderItems = [];
  
  for (const item of cartItems) {
    const product = await getProductById(item.product_id);
    if (!product) continue;
    
    const price = product.sale_price || product.price;
    totalAmount += price * item.quantity;
    
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      price: price,
      pack_size: item.pack_size
    });
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      payment_method: paymentMethod,
      status: 'pending',
      payment_status: 'pending'
    }])
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }

  // Add order items
  for (const item of orderItems) {
    const { error: itemError } = await supabase
      .from('order_items')
      .insert([{
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price,
        pack_size: item.pack_size
      }]);
    
    if (itemError) {
      console.error('Error adding order item:', itemError);
    }
  }

  // Clear cart
  await clearCart(cartId);
  
  return order;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
  
  return data || [];
}

export async function updateOrderStatus(
  orderId: number,
  status: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order status:', error);
    return null;
  }
  
  return data;
}

export async function updatePaymentStatus(
  orderId: number,
  paymentStatus: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      payment_status: paymentStatus, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating payment status:', error);
    return null;
  }
  
  return data;
}
