
import { Product } from '@/types/database.types';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addToCart, getUserCart } from '@/api/cartApi';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/api/wishlistApi';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard = ({ product, featured = false }: ProductCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Check if product is in wishlist
  const checkWishlist = async () => {
    if (user) {
      const result = await isInWishlist(user.id, product.id);
      setInWishlist(result);
    }
  };

  // Call checkWishlist on mount
  useState(() => {
    checkWishlist();
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const cart = await getUserCart(user.id);
      if (!cart) {
        throw new Error('Could not retrieve your cart');
      }
      
      const result = await addToCart(cart.id, product.id, 1);
      if (result) {
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart`,
        });
      } else {
        throw new Error('Could not add to cart');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your wishlist',
        variant: 'destructive',
      });
      return;
    }

    setWishlistLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(user.id, product.id);
        setInWishlist(false);
        toast({
          title: 'Removed from wishlist',
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(user.id, product.id);
        setInWishlist(true);
        toast({
          title: 'Added to wishlist',
          description: `${product.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md group">
      <div className="relative">
        <Link to={`/products/${product.slug}`} className="block aspect-square overflow-hidden bg-gray-100">
          <img 
            src={product.image_url || '/placeholder.svg'} 
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {product.sale_price && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Sale
          </Badge>
        )}
        {featured && (
          <Badge className="absolute top-2 left-2 bg-amber-500">
            Featured
          </Badge>
        )}
        <Button 
          variant="outline" 
          size="icon" 
          className={`absolute bottom-2 right-2 rounded-full ${inWishlist ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600' : 'bg-white hover:bg-gray-100'}`}
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart className={inWishlist ? 'fill-red-500' : ''} size={18} />
        </Button>
      </div>
      <CardContent className="pt-4 flex-grow">
        <Link to={`/products/${product.slug}`} className="no-underline">
          <h3 className="font-medium text-gray-900 mb-1 transition-colors hover:text-amber-600">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-sm text-amber-500 mb-2">
          {'★'.repeat(Math.round(product.rating))}
          <span className="text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
        <div className="flex gap-2 flex-wrap">
          {product.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-gray-50">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex flex-col items-stretch gap-2">
        <div className="flex items-baseline mb-2">
          {product.sale_price ? (
            <>
              <span className="text-xl font-semibold text-amber-600">₹{product.sale_price}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
            </>
          ) : (
            <span className="text-xl font-semibold text-gray-900">₹{product.price}</span>
          )}
        </div>
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
