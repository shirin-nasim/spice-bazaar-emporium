
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
  Check,
  Gift,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(500)
});

const bulkOrderSchema = z.object({
  quantity: z.number().min(10, "Bulk orders must be at least 10 units"),
  packSize: z.string().min(1, "Please select a pack size"),
  companyName: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional()
});

const giftSchema = z.object({
  quantity: z.number().min(1, "Please select at least 1 unit"),
  packSize: z.string().min(1, "Please select a pack size"),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientEmail: z.string().email("Please enter a valid email"),
  message: z.string().optional(),
  giftWrap: z.boolean().default(true)
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
  const [isBulkOrderOpen, setIsBulkOrderOpen] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      comment: ""
    }
  });

  const bulkOrderForm = useForm<z.infer<typeof bulkOrderSchema>>({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      quantity: 10,
      packSize: '',
      companyName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const giftForm = useForm<z.infer<typeof giftSchema>>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      quantity: 1,
      packSize: '',
      recipientName: '',
      recipientEmail: '',
      message: '',
      giftWrap: true
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
        
        // Set initial calculated price
        const initialPrice = productData.sale_price || productData.price;
        setCalculatedPrice(initialPrice);
        
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
  
  // Calculate price based on quantity and apply any volume discounts
  useEffect(() => {
    if (!product) return;
    
    let basePrice = product.sale_price || product.price;
    let finalPrice = basePrice * quantity;
    
    // Apply volume discounts if quantity >= 5
    if (quantity >= 20) {
      finalPrice = finalPrice * 0.85; // 15% discount for 20+ items
    } else if (quantity >= 10) {
      finalPrice = finalPrice * 0.9; // 10% discount for 10+ items
    } else if (quantity >= 5) {
      finalPrice = finalPrice * 0.95; // 5% discount for 5+ items
    }
    
    setCalculatedPrice(finalPrice);
  }, [quantity, product]);
  
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

  const onBulkOrderSubmit = async (data: z.infer<typeof bulkOrderSchema>) => {
    if (!product) return;
    
    try {
      // Here you would integrate with your backend to process the bulk order
      console.log('Bulk order submitted:', data);
      
      toast({
        title: 'Bulk Order Requested',
        description: 'Your bulk order request has been submitted. Our team will contact you shortly.',
      });
      
      bulkOrderForm.reset();
      setIsBulkOrderOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bulk order request',
        variant: 'destructive',
      });
    }
  };

  const onGiftSubmit = async (data: z.infer<typeof giftSchema>) => {
    if (!product) return;
    
    try {
      // Here you would integrate with your backend to process the gift order
      console.log('Gift order submitted:', data);
      
      toast({
        title: 'Gift Order Placed',
        description: 'Your gift order has been placed successfully!',
      });
      
      giftForm.reset();
      setIsGiftOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit gift order',
        variant: 'destructive',
      });
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
        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="relative">
              <img 
                src={product.image_url || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-sm object-cover aspect-square"
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
                <span className="text-2xl font-bold text-amber-600">₹{calculatedPrice.toFixed(2)}</span>
                {quantity > 4 && (
                  <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                    Volume Discount Applied
                  </Badge>
                )}
              </div>
              
              {/* Original Price Info */}
              {product.sale_price ? (
                <div className="text-sm text-gray-500">
                  Regular price: <span className="line-through">₹{product.price}</span>
                  <span className="ml-2 text-green-600">Save {Math.round((1 - product.sale_price/product.price) * 100)}%</span>
                </div>
              ) : null}
              
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

              {/* Bulk & Gift options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {product.is_bulk_available && (
                  <Dialog open={isBulkOrderOpen} onOpenChange={setIsBulkOrderOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Users className="mr-2 h-4 w-4" />
                        Bulk Order Inquiry
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Bulk Order</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to request pricing for bulk orders of {product.name}.
                        </DialogDescription>
                      </DialogHeader>

                      <Form {...bulkOrderForm}>
                        <form onSubmit={bulkOrderForm.handleSubmit(onBulkOrderSubmit)} className="space-y-4">
                          <FormField
                            control={bulkOrderForm.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="10"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bulkOrderForm.control}
                            name="packSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pack Size</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a pack size" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {product.pack_sizes?.map((size) => (
                                      <SelectItem key={size} value={size}>
                                        {size}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bulkOrderForm.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              control={bulkOrderForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={bulkOrderForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={bulkOrderForm.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Requirements (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                              Submit Inquiry
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}

                {product.is_gift_suitable && (
                  <Dialog open={isGiftOpen} onOpenChange={setIsGiftOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full text-purple-600 border-purple-200 hover:bg-purple-50">
                        <Gift className="mr-2 h-4 w-4" />
                        Send as Gift
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send {product.name} as a Gift</DialogTitle>
                        <DialogDescription>
                          Fill out the details below to send this product as a gift.
                        </DialogDescription>
                      </DialogHeader>

                      <Form {...giftForm}>
                        <form onSubmit={giftForm.handleSubmit(onGiftSubmit)} className="space-y-4">
                          <FormField
                            control={giftForm.control}
                            name="quantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={giftForm.control}
                            name="packSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pack Size</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a pack size" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {product.pack_sizes?.map((size) => (
                                      <SelectItem key={size} value={size}>
                                        {size}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={giftForm.control}
                            name="recipientName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recipient's Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={giftForm.control}
                            name="recipientEmail"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Recipient's Email</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={giftForm.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gift Message (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={giftForm.control}
                            name="giftWrap"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Include Gift Wrapping</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />

                          <DialogFooter>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                              Send Gift
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-sm border-t border-gray-100 mt-6 pt-6">
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
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
          <Tabs defaultValue="description" className="p-6">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="additional">Additional Info</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
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
            <TabsContent value="additional">
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
            <TabsContent value="recipes">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Delicious Recipes Using {product.name}</h3>
                    
                    {/* Recipe 1 */}
                    <div className="mb-8 border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-amber-700">Traditional {product.name} Recipe</h4>
                      <div className="flex flex-col md:flex-row md:gap-8 mt-4">
                        <div className="md:w-1/3">
                          <img 
                            src={`https://source.unsplash.com/random/300x200/?${product.name.split(' ')[0]},food`} 
                            alt="Recipe" 
                            className="rounded-lg w-full h-48 object-cover mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>Prep: 15 mins</span>
                            <span>Cook: 30 mins</span>
                            <span>Serves: 4</span>
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <h5 className="font-medium mb-2">Ingredients:</h5>
                          <ul className="list-disc pl-5 mb-4 text-gray-700">
                            <li>{product.name} - {product.pack_sizes?.[0] || '100g'}</li>
                            <li>Onions - 2 medium, finely chopped</li>
                            <li>Tomatoes - 3, chopped</li>
                            <li>Vegetable oil - 2 tbsp</li>
                            <li>Salt and pepper to taste</li>
                            <li>Fresh herbs for garnish</li>
                          </ul>
                          
                          <h5 className="font-medium mb-2">Instructions:</h5>
                          <ol className="list-decimal pl-5 text-gray-700">
                            <li>Heat oil in a large pan over medium heat</li>
                            <li>Add onions and sauté until translucent</li>
                            <li>Add {product.name} and cook for 5-7 minutes</li>
                            <li>Stir in chopped tomatoes and cook for another 5 minutes</li>
                            <li>Season with salt and pepper</li>
                            <li>Garnish with fresh herbs before serving</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recipe 2 */}
                    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-amber-700">Modern Fusion with {product.name}</h4>
                      <div className="flex flex-col md:flex-row md:gap-8 mt-4">
                        <div className="md:w-1/3">
                          <img 
                            src={`https://source.unsplash.com/random/300x200/?${product.name.split(' ')[0]},cooking`} 
                            alt="Recipe" 
                            className="rounded-lg w-full h-48 object-cover mb-4"
                          />
                          <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>Prep: 20 mins</span>
                            <span>Cook: 25 mins</span>
                            <span>Serves: 2</span>
                          </div>
                        </div>
                        <div className="md:w-2/3">
                          <h5 className="font-medium mb-2">Ingredients:</h5>
                          <ul className="list-disc pl-5 mb-4 text-gray-700">
                            <li>{product.name} - {product.pack_sizes?.[0] || '100g'}</li>
                            <li>Olive oil - 3 tbsp</li>
                            <li>Garlic - 3 cloves, minced</li>
                            <li>Fresh vegetables - 2 cups, mixed</li>
                            <li>Lemon juice - 1 tbsp</li>
                            <li>Mixed herbs - 1 tsp</li>
                          </ul>
                          
                          <h5 className="font-medium mb-2">Instructions:</h5>
                          <ol className="list-decimal pl-5 text-gray-700">
                            <li>Heat olive oil in a pan over medium heat</li>
                            <li>Add garlic and sauté for 1 minute</li>
                            <li>Add mixed vegetables and cook until tender</li>
                            <li>Incorporate {product.name} and cook for another 3-5 minutes</li>
                            <li>Sprinkle with mixed herbs and a squeeze of lemon juice</li>
                            <li>Serve hot as a side dish or main course</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
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
