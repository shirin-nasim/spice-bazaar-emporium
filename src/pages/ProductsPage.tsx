import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Filter, ChevronDown, ShoppingCart, Heart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/search/SearchBar";
import { Product, searchProducts } from "@/lib/search";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let fetchedProducts: Product[] = [];
        
        if (searchQuery) {
          fetchedProducts = await searchProducts(searchQuery);
        } else {
          fetchedProducts = await searchProducts("");
        }
        
        let filteredProducts = [...fetchedProducts];
        
        if (filter !== "all") {
          filteredProducts = filteredProducts.filter(product => product.category === filter);
        }
        
        switch (sort) {
          case "price-low":
            filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
            break;
          case "price-high":
            filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
            break;
          case "name":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          default: // popularity (rating)
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        }
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, sort, searchQuery, toast]);

  const addToCart = (product: Product) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const addToWishlist = (product: Product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  const categories = [
    { value: "all", label: "All Products" },
    { value: "nuts", label: "Nuts" },
    { value: "spices", label: "Spices" },
    { value: "dried-fruits", label: "Dried Fruits" },
    { value: "mixes", label: "Mixes" },
  ];

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Our Products"}
          </h1>
          <p className="text-gray-600 mt-2">
            {searchQuery 
              ? `Showing ${products.length} results for "${searchQuery}"`
              : "Discover our curated selection of premium spices, nuts, and dried fruits"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <Button 
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter size={16} /> Filters <ChevronDown size={16} className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-auto`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full md:w-44 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full md:w-44 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="relative w-full md:w-64">
            <SearchBar
              className="w-full"
              placeholder="Search products..."
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 group">
                    <div className="relative">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      
                      {product.sale_price && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Sale
                        </div>
                      )}
                      
                      <button
                        onClick={() => addToWishlist(product)}
                        className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart size={18} className="text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="mb-1 text-sm text-amber-600 font-medium uppercase">
                        {product.category}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-1">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.floor(product.rating) ? "★" : (i < product.rating ? "★" : "☆")}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-baseline">
                          {product.sale_price ? (
                            <>
                              <span className="text-lg font-bold text-gray-900">${product.sale_price.toFixed(2)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <ShoppingCart size={16} className="mr-1" /> Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
