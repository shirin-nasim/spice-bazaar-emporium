
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useCartCount = (): number => {
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // Check local storage for non-authenticated users
      const localCart = localStorage.getItem('guestCart');
      if (localCart) {
        try {
          const cart = JSON.parse(localCart);
          setCount(cart.items?.length || 0);
        } catch (e) {
          console.error('Error parsing local cart:', e);
          setCount(0);
        }
      } else {
        setCount(0);
      }
      return;
    }

    const fetchCartCount = async () => {
      try {
        // First, get the cart ID
        const { data: cartData, error: cartError } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (cartError || !cartData) {
          setCount(0);
          return;
        }

        // Then count the items in that cart
        const { data: itemsData, error: itemsError } = await supabase
          .from('cart_items')
          .select('id', { count: 'exact' })
          .eq('cart_id', cartData.id);

        if (itemsError) {
          console.error('Error fetching cart items:', itemsError);
          setCount(0);
          return;
        }

        setCount(itemsData?.length || 0);
      } catch (error) {
        console.error('Error in useCartCount hook:', error);
        setCount(0);
      }
    };

    fetchCartCount();

    // Set up real-time subscription
    const subscription = supabase
      .channel('cart_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cart_items',
      }, () => {
        fetchCartCount();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return count;
};
