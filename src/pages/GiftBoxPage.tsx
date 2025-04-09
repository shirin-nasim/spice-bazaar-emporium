
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Gift } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { GiftBox } from '@/types/database.types';
import { useAuth } from '@/contexts/AuthContext';

export default function GiftBoxPage() {
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('gift_boxes')
          .select('*')
          .order('featured', { ascending: false });

        if (error) {
          throw error;
        }

        setGiftBoxes(data || []);
      } catch (error) {
        console.error('Error fetching gift boxes:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load gift boxes',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGiftBoxes();
  }, [toast]);

  const addToCart = async (giftBoxId: number) => {
    try {
      // For logged in users, add to database
      if (user) {
        const { data: cartData, error: cartError } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let cartId;
        
        if (cartError || !cartData) {
          // Create a new cart if it doesn't exist
          const { data: newCart, error: newCartError } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select('id')
            .single();

          if (newCartError) {
            throw newCartError;
          }
          
          cartId = newCart.id;
        } else {
          cartId = cartData.id;
        }

        // Add item to cart
        const { error: itemError } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartId,
            gift_box_id: giftBoxId,
            quantity: 1
          });

        if (itemError) {
          throw itemError;
        }
      } else {
        // For guests, store in localStorage
        const existingCart = localStorage.getItem('guestCart');
        const cart = existingCart ? JSON.parse(existingCart) : { items: [] };
        
        // Check if gift box already in cart
        const existingItem = cart.items.find((item: any) => 
          item.gift_box_id === giftBoxId
        );
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({
            gift_box_id: giftBoxId,
            quantity: 1,
            id: Date.now() // temporary ID for the guest cart
          });
        }
        
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }

      toast({
        title: 'Success',
        description: 'Gift box added to cart',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add gift box to cart',
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading gift boxes...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gift Boxes</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Perfect for celebrations, festivals, or to simply show someone you care. Our curated gift boxes contain a selection of premium products.
          </p>
        </div>

        {giftBoxes.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Gift Boxes Available</h2>
            <p className="text-gray-600">Please check back later for our special collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftBoxes.map((giftBox) => (
              <Card key={giftBox.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {giftBox.image_url ? (
                    <img 
                      src={giftBox.image_url} 
                      alt={giftBox.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-100">
                      <Gift className="h-16 w-16 text-amber-500" />
                    </div>
                  )}
                  {giftBox.featured && (
                    <Badge className="absolute top-3 right-3 bg-amber-500">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{giftBox.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">{giftBox.description}</p>
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-900 mb-2">Gift Box Contains:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {giftBox.items.map((item, index) => (
                        <li key={index} className="line-clamp-1">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-xl font-bold text-amber-600">₹{giftBox.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => addToCart(giftBox.id)}
                    className="flex-1"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(`/gift-box/${giftBox.slug}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
