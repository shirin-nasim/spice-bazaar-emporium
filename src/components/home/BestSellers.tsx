
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Product, getFeaturedProducts } from "@/lib/search";
import { useToast } from "@/hooks/use-toast";

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await getFeaturedProducts();
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const addToCart = (product: Product, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-amber-900">Best Sellers</h2>
          <Link to="/products" className="text-amber-700 hover:text-amber-900 font-medium">
            View All Products →
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="relative">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.sale_price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Sale
                    </span>
                  )}
                  {product.tags && product.tags.includes("organic") && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Organic
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-amber-600 font-medium uppercase mb-1">
                    {product.category.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                    {product.subcategory && ` • ${product.subcategory}`}
                  </div>
                  <h3 className="font-medium text-lg text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.origin && (
                    <div className="text-xs text-gray-500 mb-2">Origin: {product.origin}</div>
                  )}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">({Math.floor(product.rating * 20)} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline">
                      {product.sale_price ? (
                        <>
                          <span className="font-bold text-amber-900">${product.sale_price.toFixed(2)}</span>
                          <span className="text-xs text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-amber-900">${product.price.toFixed(2)}</span>
                      )}
                      {product.weight && (
                        <span className="text-xs text-gray-500 ml-1">/{product.weight}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => addToCart(product, e)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center px-3 py-1 rounded text-sm"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
