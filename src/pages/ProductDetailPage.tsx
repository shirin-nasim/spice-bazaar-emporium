
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  image_url: string;
  rating: number;
  stock: number;
  featured: boolean;
  details?: string;
  ingredients?: string;
  usage?: string;
  reviews?: {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
  }[];
  related?: number[];
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Mock API call - this would be replaced with an actual API call
        // For demo purposes, we're manually creating the product data
        
        // This is placeholder data - in a real app, you'd fetch from Supabase
        const mockProduct: Product = {
          id: parseInt(id || "1"),
          name: "Premium Cashews",
          description: "Roasted and lightly salted premium cashews sourced from organic farms. Our cashews are carefully selected for quality and flavor, ensuring a delicious and nutritious snack experience.",
          price: 12.99,
          sale_price: null,
          category: "nuts",
          image_url: "https://images.unsplash.com/photo-1536591168924-4eba31d6150f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          rating: 4.8,
          stock: 100,
          featured: true,
          details: "Our Premium Cashews are sourced from organic farms in Vietnam and are carefully roasted to perfection. They are lightly salted to enhance their natural flavor without overwhelming it. These cashews are packed with proteins, healthy fats, and essential minerals, making them a perfect healthy snacking option.\n\nEach batch is tested for quality and freshness before packaging. Our vacuum-sealed packaging ensures the nuts stay fresh for longer.\n\nProduct of Vietnam. Packed in USA.",
          ingredients: "Organic cashews, sea salt, organic high-oleic sunflower oil.",
          usage: "Perfect for snacking, cooking, or adding to your favorite recipes. Store in a cool, dry place. Once opened, refrigerate for maximum freshness.",
          reviews: [
            {
              id: 1,
              user: "John D.",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
              rating: 5,
              date: "2023-10-15",
              comment: "These cashews are amazing! So fresh and the perfect amount of salt. Will definitely buy again."
            },
            {
              id: 2,
              user: "Sarah M.",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              rating: 4,
              date: "2023-09-28",
              comment: "Really good quality, but the package was a bit smaller than I expected. Taste is excellent though!"
            },
            {
              id: 3,
              user: "Robert J.",
              avatar: "https://randomuser.me/api/portraits/men/3.jpg",
              rating: 5,
              date: "2023-09-10",
              comment: "Best cashews I've ever had! The taste is perfect and they're very fresh."
            },
            {
              id: 4,
              user: "Emily L.",
              avatar: "https://randomuser.me/api/portraits/women/4.jpg",
              rating: 4,
              date: "2023-08-22",
              comment: "Great quality and taste. I use them in my morning oatmeal and they add the perfect crunch."
            }
          ],
          related: [2, 8, 10, 1]
        };

        // Mock related products
        const mockRelatedProducts: Product[] = [
          {
            id: 2,
            name: "Organic Almonds",
            description: "Raw organic almonds sourced from California",
            price: 9.99,
            sale_price: 7.99,
            category: "nuts",
            image_url: "https://images.unsplash.com/photo-1608797178993-a062e1517f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            stock: 150,
            featured: true
          },
          {
            id: 8,
            name: "Pistachio Nuts",
            description: "Roasted and salted pistachio nuts",
            price: 14.99,
            sale_price: null,
            category: "nuts",
            image_url: "https://images.unsplash.com/photo-1600623052101-aa70e5b1e543?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            stock: 85,
            featured: true
          },
          {
            id: 10,
            name: "Trail Mix Supreme",
            description: "A mix of nuts, seeds, and dried fruits",
            price: 11.99,
            sale_price: 9.99,
            category: "mixes",
            image_url: "https://images.unsplash.com/photo-1627485937980-221c88ac04a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.6,
            stock: 120,
            featured: true
          },
          {
            id: 1,
            name: "Premium Cashews",
            description: "Roasted and lightly salted premium cashews",
            price: 12.99,
            sale_price: null,
            category: "nuts",
            image_url: "https://images.unsplash.com/photo-1536591168924-4eba31d6150f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8,
            stock: 100,
            featured: true
          }
        ];
        
        setProduct(mockProduct);
        setRelatedProducts(mockRelatedProducts);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, toast]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = () => {
    if (product) {
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  const addToWishlist = () => {
    if (product) {
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
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
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you're looking for does not exist or has been removed.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="text-amber-600 hover:text-amber-800 inline-flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Main Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Product Image */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-auto rounded-md object-cover"
            />
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-1 text-sm text-amber-600 font-medium uppercase">
              {product.category}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">{product.rating} ({product.reviews?.length || 0} reviews)</span>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="flex items-baseline mb-6">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">${product.sale_price.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through ml-3">${product.price.toFixed(2)}</span>
                  <span className="ml-3 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                    Save ${(product.price - product.sale_price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quantity:</p>
              <div className="flex items-center border rounded-md w-36">
                <button
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-r"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0 && value <= (product.stock || 100)) {
                      setQuantity(value);
                    }
                  }}
                  className="w-full text-center border-none focus:ring-0 text-gray-700"
                  min="1"
                  max={product.stock}
                />
                <button
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 border-l"
                  disabled={quantity >= (product.stock || 100)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {product.stock > 0 ? (
                  <>
                    <span className="text-green-600 font-medium">In Stock</span>
                    {product.stock < 20 && ` - Only ${product.stock} left!`}
                  </>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={addToCart}
                className="bg-amber-600 hover:bg-amber-700 flex-1"
                size="lg"
                disabled={!product.stock}
              >
                <ShoppingCart className="mr-2" /> Add to Cart
              </Button>
              <Button
                onClick={addToWishlist}
                variant="outline"
                size="lg"
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <Heart className="mr-2" /> Wishlist
              </Button>
            </div>
            
            {/* Product Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <div className="mr-3 text-amber-600">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-amber-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Satisfaction Guaranteed</p>
                  <p className="text-xs text-gray-500">30-day money-back guarantee</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-amber-600">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">Hassle-free return policy</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-3 text-amber-600">
                  <Share2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Share Product</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button className="text-gray-600 hover:text-amber-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                    <button className="text-gray-600 hover:text-amber-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </button>
                    <button className="text-gray-600 hover:text-amber-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="details" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6 bg-white p-6 rounded-md shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{product.details}</p>
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-6 bg-white p-6 rounded-md shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
              <div className="prose max-w-none">
                <p>{product.ingredients}</p>
                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Usage Instructions</h4>
                  <p>{product.usage}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="bg-white p-6 rounded-md shadow-sm border mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button className="bg-amber-600 hover:bg-amber-700">Write a Review</Button>
                </div>
                
                <div className="mb-6 flex items-center">
                  <div className="mr-4">
                    <div className="text-3xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                          className={i < Math.floor(product.rating) ? "text-amber-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{product.reviews?.length || 0} reviews</div>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const reviewCount = product.reviews?.filter((r) => Math.floor(r.rating) === star).length || 0;
                      const percentage = product.reviews?.length ? (reviewCount / product.reviews.length) * 100 : 0;
                      
                      return (
                        <div key={star} className="flex items-center text-sm mb-1">
                          <div className="w-8 text-gray-700">{star} star</div>
                          <div className="w-full max-w-xs mx-3 bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="w-9 text-gray-500">{percentage.toFixed(0)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start mb-3">
                            <img
                              src={review.avatar}
                              alt={review.user}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{review.user}</div>
                              <div className="flex items-center mt-1">
                                <div className="flex text-amber-400 mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      fill={i < review.rating ? "currentColor" : "none"}
                                      className={i < review.rating ? "text-amber-400" : "text-gray-300"}
                                    />
                                  ))}
                                </div>
                                <div className="text-xs text-gray-500">{review.date}</div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 group">
                  <div className="relative">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {relatedProduct.sale_price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Sale
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/products/${relatedProduct.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-1">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(relatedProduct.rating) ? "★" : (i < relatedProduct.rating ? "★" : "☆")}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({relatedProduct.rating})</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline">
                        {relatedProduct.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-gray-900">${relatedProduct.sale_price.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through ml-2">${relatedProduct.price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">${relatedProduct.price.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
