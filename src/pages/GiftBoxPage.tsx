
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { addToCart } from '@/api/cartApi';

interface GiftBox {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  items: string[];
  featured: boolean;
}

const GiftBoxPage = () => {
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gift_boxes')
        .select('*')
        .order('price', { ascending: true });

      if (error) {
        console.error('Error fetching gift boxes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gift boxes',
          variant: 'destructive',
        });
      } else {
        setGiftBoxes(data || []);
      }
      setLoading(false);
    };

    fetchGiftBoxes();
  }, [toast]);

  const handleAddToCart = async (giftBox: GiftBox) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart',
        variant: 'default',
      });
      return;
    }

    try {
      await addToCart(giftBox.id, 1, null, true);
      toast({
        title: 'Added to cart',
        description: `${giftBox.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Gift Boxes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Perfectly curated gift boxes filled with premium dry fruits, nuts, and spices.
            The ideal present for any occasion.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : giftBoxes.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Gift Boxes Available</h2>
            <p className="text-gray-600">
              Check back soon! We're creating beautiful gift boxes for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftBoxes.map((giftBox) => (
              <Card key={giftBox.id} className="overflow-hidden border-gray-200 hover:shadow-md transition-shadow">
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${giftBox.image_url || '/placeholder.svg'})` }}
                ></div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {giftBox.name}
                  </CardTitle>
                  <CardDescription className="text-amber-600 font-semibold">
                    ₹{giftBox.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{giftBox.description}</p>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">What's Inside:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {giftBox.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleAddToCart(giftBox)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GiftBoxPage;
