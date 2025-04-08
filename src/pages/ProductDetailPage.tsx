
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { 
  getProductBySlug, 
  getProductReviews, 
  getRelatedProducts, 
  createReview 
} from '@/api/productApi';
import { addToCart, getUserCart } from '@/api/cartApi';
import { addToWishlist, isInWishlist, removeFromWishlist } from '@/api/wishlistApi';
import { Product, Review } from '@/types/database.types';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, 
  Heart, 
  Minus, 
  Plus, 
  ShoppingCart, 
  PackageCheck, 
  Truck, 
  RefreshCw, 
  Check 
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(500)
});

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackSize, setSelectedPackSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addingReview, setAddingReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: ""
    }
  });
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        const productData = await getProductBySlug(slug);
        
        if (!productData) {
          setLoading(false);
          return;
        }
        
        setProduct(productData);
        setSelectedPackSize(productData.pack_sizes?.[0] || '');
        
        // Fetch reviews
        const reviewsData = await getProductReviews(productData.id);
        setReviews(reviewsData);
        
        // Fetch related products if we have a category
        if (productData.category_id) {
          const related = await getRelatedProducts(productData.category_id, productData.id, 4);
          setRelatedProducts(related);
        }
        
        // Check if in wishlist
        if (user) {
          const wishlistStatus = await isInWishlist(user.id, productData.id);
          setInWishlist(wishlistStatus);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [slug, user]);
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 20) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }
    
    if (!product) return;
    
    setAddingToCart(true);
    
    try {
      const cart = await getUserCart(user.id);
      
      if (!cart) {
        throw new Error('Could not retrieve cart');
      }
      
      const result = await addToCart(cart.id, product.id, quantity, selectedPackSize);
      
      if (result) {
        toast({
          title: 'Added to cart',
          description: `${product.name} (${selectedPackSize}) has been added to your cart`,
        });
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive',
      });
    } finally {
      setAddingToCart(false);
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
    
    if (!product) return;
    
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
  
  const onReviewSubmit = async (data: z.infer<typeof reviewSchema>) => {
    if (!user || !product) return;
    
    setAddingReview(true);
    
    try {
      const result = await createReview(product.id, user.id, data.rating, data.comment);
      
      if (result) {
        // Add the new review to the current reviews
        setReviews(prev => [result, ...prev]);
        
        toast({
          title: 'Review submitted',
          description: 'Thank you for your feedback!',
        });
        
        form.reset();
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setAddingReview(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.image_url || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-sm"
            />
            {product.sale_price && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1">
                Sale
              </Badge>
            )}
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Link to="/" className="hover:text-amber-600">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-amber-600">Products</Link>
              {product.category_id && (
                <>
                  <span className="mx-2">/</span>
                  <span>{product.category_id}</span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
                {'☆'.repeat(5 - Math.round(product.rating))}
              </div>
              <span className="text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-gray-500">{reviews.length} reviews</span>
            </div>
            
            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-bold text-amber-600">₹{product.sale_price}</span>
                  <span className="text-lg text-gray-500 line-through">₹{product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600">{product.description}</p>
            
            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.origin && (
                <div>
                  <span className="font-medium text-gray-700">Origin:</span> {product.origin}
                </div>
              )}
              {product.shelf_life && (
                <div>
                  <span className="font-medium text-gray-700">Shelf Life:</span> {product.shelf_life}
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span> {product.weight}
                </div>
              )}
              {product.use_case && (
                <div>
                  <span className="font-medium text-gray-700">Use Case:</span> {product.use_case}
                </div>
              )}
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Pack Size */}
            {product.pack_sizes && product.pack_sizes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pack Size</label>
                <Select
                  value={selectedPackSize}
                  onValueChange={setSelectedPackSize}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.pack_sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 20}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                className="bg-amber-600 hover:bg-amber-700 flex-grow"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                className={`flex-grow ${inWishlist ? 'text-red-500 border-red-500 hover:bg-red-50' : ''}`}
                onClick={toggleWishlist}
                disabled={wishlistLoading}
              >
                <Heart className={`mr-2 h-4 w-4 ${inWishlist ? 'fill-red-500' : ''}`} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-sm">
              <div className="flex items-center">
                <PackageCheck className="mr-2 h-5 w-5 text-amber-600" />
                <span className="text-gray-700">Premium Quality</span>
              </div>
              <div className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-amber-600" />
                <span className="text-gray-700">Fast Delivery</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5 text-amber-600" />
                <span className="text-gray-700">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                    <p>{product.description}</p>
                    
                    {product.use_case && (
                      <>
                        <h4 className="text-lg font-semibold mt-4 mb-2">Uses</h4>
                        <p>{product.use_case}</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="additional" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-4">
                      {product.weight && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Weight</span>
                          <span>{product.weight}</span>
                        </div>
                      )}
                      {product.origin && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Origin</span>
                          <span>{product.origin}</span>
                        </div>
                      )}
                      {product.shelf_life && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Shelf Life</span>
                          <span>{product.shelf_life}</span>
                        </div>
                      )}
                      {product.is_gift_suitable !== undefined && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Gift Suitable</span>
                          <span>{product.is_gift_suitable ? 'Yes' : 'No'}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-4">
                      {product.is_bulk_available !== undefined && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Bulk Available</span>
                          <span>{product.is_bulk_available ? 'Yes' : 'No'}</span>
                        </div>
                      )}
                      {product.pack_sizes && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Available Sizes</span>
                          <span>{product.pack_sizes.join(', ')}</span>
                        </div>
                      )}
                      {product.hs_code && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">HS Code</span>
                          <span>{product.hs_code}</span>
                        </div>
                      )}
                      {product.sourcing && (
                        <div className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">Sourcing</span>
                          <span>{product.sourcing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  
                  {/* Write a Review */}
                  {user ? (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-medium mb-4">Write a Review</h4>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <FormControl>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        type="button"
                                        onClick={() => {
                                          setSelectedRating(rating);
                                          field.onChange(rating);
                                        }}
                                        className="text-2xl focus:outline-none"
                                      >
                                        <Star 
                                          className={`w-8 h-8 ${rating <= selectedRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Review</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Share your experience with this product..."
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="bg-amber-600 hover:bg-amber-700"
                            disabled={addingReview}
                          >
                            Submit Review
                          </Button>
                        </form>
                      </Form>
                    </div>
                  ) : (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                      <p className="mb-4">Please sign in to leave a review</p>
                      <Button asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                    </div>
                  )}
                  
                  {/* Reviews List */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 mb-4 last:border-0">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center gap-1 text-amber-500">
                              {'★'.repeat(review.rating)}
                              {'☆'.repeat(5 - review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">
                              {format(new Date(review.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
