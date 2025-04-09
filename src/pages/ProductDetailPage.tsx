import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Star, Heart, ShoppingCart, Package, Gift as GiftIcon } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackSize, setSelectedPackSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getSelectedPackPrice = (): number => {
    if (!product) return 0;
    
    if (product.pack_prices && selectedPackSize) {
      const selectedPack = product.pack_prices.find(p => p.pack_size === selectedPackSize);
      return selectedPack ? (selectedPack.sale_price || selectedPack.price) : product.sale_price || product.price;
    }
    
    return product.sale_price || product.price;
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (productError) throw productError;
        if (!productData) throw new Error('Product not found');

        setProduct(productData);
        
        if (productData.pack_sizes && productData.pack_sizes.length > 0) {
          setSelectedPackSize(productData.pack_sizes[0]);
        }

        if (productData.category_id) {
          const { data: categoryData } = await supabase
            .from('categories')
            .select('*')
            .eq('id', productData.category_id)
            .single();
          
          setCategory(categoryData || null);
        }

        if (productData.subcategory_id) {
          const { data: subcategoryData } = await supabase
            .from('subcategories')
            .select('*')
            .eq('id', productData.subcategory_id)
            .single();
          
          setSubcategory(subcategoryData || null);
        }

        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productData.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);

        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .limit(4);

        setRelatedProducts(relatedData || []);

        if (user) {
          const { data: wishlistData } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', productData.id)
            .single();

          setIsWishlisted(!!wishlistData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load product details',
        });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug, toast, user]);

  const addToCart = async () => {
    try {
      if (!product) return;

      if (user) {
        const { data: cartData, error: cartError } = await supabase
          .from('carts')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let cartId;
        
        if (cartError || !cartData) {
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

        const { data: existingItems } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', cartId)
          .eq('product_id', product.id)
          .eq('pack_size', selectedPackSize);

        if (existingItems && existingItems.length > 0) {
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existingItems[0].quantity + quantity })
            .eq('id', existingItems[0].id);

          if (updateError) throw updateError;
        } else {
          const { error: itemError } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cartId,
              product_id: product.id,
              quantity: quantity,
              pack_size: selectedPackSize
            });

          if (itemError) throw itemError;
        }
      } else {
        const existingCart = localStorage.getItem('guestCart');
        const cart = existingCart ? JSON.parse(existingCart) : { items: [] };
        
        const existingItem = cart.items.find((item: any) => 
          item.product_id === product.id && item.pack_size === selectedPackSize
        );
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            product_id: product.id,
            pack_size: selectedPackSize,
            quantity: quantity,
            id: Date.now()
          });
        }
        
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }

      toast({
        title: 'Success',
        description: 'Product added to cart',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add product to cart',
      });
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please login to add items to your wishlist',
      });
      return;
    }

    try {
      if (!product) return;

      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;
        
        setIsWishlisted(false);
        toast({
          title: 'Removed from Wishlist',
          description: 'Product removed from your wishlist',
        });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            product_id: product.id
          });

        if (error) throw error;
        
        setIsWishlisted(true);
        toast({
          title: 'Added to Wishlist',
          description: 'Product added to your wishlist',
        });
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update wishlist',
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex items-center space-x-2 text-gray-500">
            <li><Link to="/" className="hover:text-amber-600">Home</Link></li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-amber-600">Products</Link>
            </li>
            {category && (
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <Link to={`/category/${category.slug}`} className="hover:text-amber-600">{category.name}</Link>
              </li>
            )}
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center h-[400px] md:h-[500px]">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Package className="h-24 w-24 text-gray-300" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-2xl font-bold text-amber-600">
                ₹{getSelectedPackPrice().toFixed(2)}
              </span>
              {product.sale_price && (
                <span className="ml-2 text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {product.pack_sizes && product.pack_sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pack Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.pack_sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedPackSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm ${
                        selectedPackSize === size
                          ? 'border-amber-600 bg-amber-50 text-amber-600'
                          : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="h-10 w-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-16 border-y border-gray-300 text-center"
                />
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="h-10 w-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={addToCart}
                className="flex-1 md:flex-none"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button 
                onClick={toggleWishlist}
                variant={isWishlisted ? "default" : "outline"} 
                size="lg"
                className={isWishlisted ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.origin && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Origin:</span> {product.origin}
                  </span>
                </div>
              )}
              {product.shelf_life && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Shelf Life:</span> {product.shelf_life}
                  </span>
                </div>
              )}
              {product.is_gift_suitable && (
                <div className="flex items-center">
                  <GiftIcon className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Gift Suitable:</span> Yes
                  </span>
                </div>
              )}
              {product.is_bulk_available && (
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium">Bulk Available:</span> Yes
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipe Ideas</h2>
          <div className="bg-amber-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Traditional Masala Chai</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-2">Ingredients:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>2 cups water</li>
                  <li>1 inch fresh ginger, crushed</li>
                  <li>4 cardamom pods, crushed</li>
                  <li>2 cloves</li>
                  <li>1 cinnamon stick</li>
                  <li>1 star anise</li>
                  <li>2 cups milk</li>
                  <li>2 tbsp sugar (or to taste)</li>
                  <li>2 tbsp loose black tea leaves</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Bring water to a boil in a saucepan</li>
                  <li>Add ginger, cardamom, cloves, cinnamon and star anise. Simmer for 2 minutes</li>
                  <li>Add milk and sugar, bring to a simmer</li>
                  <li>Add tea leaves, simmer for 2 minutes</li>
                  <li>Strain and serve hot</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="w-full border-b border-gray-200 mb-6">
            <TabsTrigger value="details" className="py-3 px-5">Product Details</TabsTrigger>
            <TabsTrigger value="reviews" className="py-3 px-5">Customer Reviews</TabsTrigger>
            <TabsTrigger value="shipping" className="py-3 px-5">Shipping Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-4">
              <p>{product.description}</p>
              
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.use_case && (
                <div>
                  <h4 className="font-medium mb-2">Use Cases:</h4>
                  <p className="text-gray-700">{product.use_case}</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-sm">
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shipping" className="p-6 bg-white rounded-lg shadow-sm">
            <div className="space-y-4">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-gray-600">On orders over ₹500</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Shipping Time</h4>
                  <p className="text-gray-600">3-5 business days for standard shipping</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Packaging</h4>
                  <p className="text-gray-600">All products are carefully packaged to ensure they arrive in perfect condition</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
