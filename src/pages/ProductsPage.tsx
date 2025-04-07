
import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Filter, ChevronDown, ShoppingCart, Heart, X, Check } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "@/components/search/SearchBar";
import { 
  Product, 
  searchProducts, 
  ProductCategory,
  getProductCategories,
  CategoryCount 
} from "@/lib/search";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [sort, setSort] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { toast } = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products based on search query
        let fetchedProducts: Product[] = await searchProducts(searchQuery);
        
        // Extract all unique tags from products
        const allTags = new Set<string>();
        fetchedProducts.forEach(product => {
          if (product.tags) {
            product.tags.forEach(tag => allTags.add(tag));
          }
        });
        setAvailableTags(Array.from(allTags).sort());
        
        // Get categories with counts
        const categoriesWithCount = await getProductCategories();
        setCategories(categoriesWithCount);
        
        // Apply category filter
        if (categoryFilter !== "all") {
          fetchedProducts = fetchedProducts.filter(product => product.category === categoryFilter);
        }
        
        // Apply tag filters
        if (selectedTags.length > 0) {
          fetchedProducts = fetchedProducts.filter(product => 
            product.tags && selectedTags.every(tag => product.tags.includes(tag))
          );
        }
        
        // Apply price range filter
        fetchedProducts = fetchedProducts.filter(product => {
          const price = product.sale_price !== null ? product.sale_price : product.price;
          return price >= priceRange[0] && price <= priceRange[1];
        });
        
        // Apply sorting
        switch (sort) {
          case "price-low":
            fetchedProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
            break;
          case "price-high":
            fetchedProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
            break;
          case "name":
            fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "newest":
            // In a real app, you would sort by date added
            // Here we'll use ID as a proxy for "newest"
            fetchedProducts.sort((a, b) => b.id - a.id);
            break;
          default: // popularity (rating)
            fetchedProducts.sort((a, b) => b.rating - a.rating);
            break;
        }
        
        setProducts(fetchedProducts);
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
  }, [categoryFilter, sort, searchQuery, priceRange, selectedTags, toast]);

  // Find the price range in the data
  useEffect(() => {
    const loadPriceRange = async () => {
      const allProducts = await searchProducts("");
      if (allProducts.length > 0) {
        const prices = allProducts.map(p => p.sale_price !== null ? p.sale_price : p.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);
      }
    };
    
    loadPriceRange();
  }, []);

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setCategoryFilter("all");
    setSelectedTags([]);
    // Reset price range to the max range
    const allPrices = products.map(p => p.sale_price !== null ? p.sale_price : p.price);
    if (allPrices.length) {
      const minPrice = Math.floor(Math.min(...allPrices));
      const maxPrice = Math.ceil(Math.max(...allPrices));
      setPriceRange([minPrice, maxPrice]);
    }
  };

  const sortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
    { value: "newest", label: "Newest" },
  ];

  // Function to format category name for display
  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                {(categoryFilter !== "all" || selectedTags.length > 0) && (
                  <button 
                    onClick={resetFilters}
                    className="text-amber-600 text-sm hover:text-amber-800"
                  >
                    Reset all
                  </button>
                )}
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-sm mb-3 text-gray-700">Categories</h4>
                <div className="space-y-2">
                  <div 
                    className={`flex items-center justify-between cursor-pointer hover:text-amber-600 ${
                      categoryFilter === "all" ? "text-amber-600 font-medium" : "text-gray-700"
                    }`}
                    onClick={() => setCategoryFilter("all")}
                  >
                    <span>All Products</span>
                    <span className="text-xs text-gray-500">{products.length}</span>
                  </div>
                  
                  {categories.map((category) => (
                    <div 
                      key={category.category}
                      className={`flex items-center justify-between cursor-pointer hover:text-amber-600 ${
                        categoryFilter === category.category ? "text-amber-600 font-medium" : "text-gray-700"
                      }`}
                      onClick={() => setCategoryFilter(category.category)}
                    >
                      <span>{category.label}</span>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3 text-gray-700">Product Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2 py-1 rounded-full border ${
                          selectedTags.includes(tag)
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {selectedTags.includes(tag) && (
                          <Check className="w-3 h-3 inline mr-1" />
                        )}
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              {/* Mobile Filter Button */}
              <Button 
                variant="outline"
                className="md:hidden flex items-center gap-2 w-full md:w-auto"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <Filter size={16} /> Filters <ChevronDown size={16} className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {/* Mobile Filters */}
              {mobileFiltersOpen && (
                <div className="md:hidden w-full bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">Filters</h3>
                    <button 
                      onClick={() => setMobileFiltersOpen(false)}
                      className="text-gray-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Category Filter Mobile */}
                  <div className="mb-6">
                    <h4 className="font-medium text-sm mb-3 text-gray-700">Categories</h4>
                    <div className="space-y-2">
                      <div 
                        className={`flex items-center justify-between cursor-pointer hover:text-amber-600 ${
                          categoryFilter === "all" ? "text-amber-600 font-medium" : "text-gray-700"
                        }`}
                        onClick={() => {
                          setCategoryFilter("all");
                          setMobileFiltersOpen(false);
                        }}
                      >
                        <span>All Products</span>
                        <span className="text-xs text-gray-500">{products.length}</span>
                      </div>
                      
                      {categories.map((category) => (
                        <div 
                          key={category.category}
                          className={`flex items-center justify-between cursor-pointer hover:text-amber-600 ${
                            categoryFilter === category.category ? "text-amber-600 font-medium" : "text-gray-700"
                          }`}
                          onClick={() => {
                            setCategoryFilter(category.category);
                            setMobileFiltersOpen(false);
                          }}
                        >
                          <span>{category.label}</span>
                          <span className="text-xs text-gray-500">{category.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tags Filter Mobile */}
                  {availableTags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-3 text-gray-700">Product Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`text-xs px-2 py-1 rounded-full border ${
                              selectedTags.includes(tag)
                                ? 'bg-amber-100 border-amber-300 text-amber-800'
                                : 'border-gray-200 hover:border-amber-300'
                            }`}
                          >
                            {selectedTags.includes(tag) && (
                              <Check className="w-3 h-3 inline mr-1" />
                            )}
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reset Filters Button - Mobile */}
                  {(categoryFilter !== "all" || selectedTags.length > 0) && (
                    <Button 
                      onClick={() => {
                        resetFilters();
                        setMobileFiltersOpen(false);
                      }}
                      variant="outline"
                      className="w-full text-amber-600 border-amber-300 hover:bg-amber-50"
                    >
                      Reset all filters
                    </Button>
                  )}
                </div>
              )}
              
              {/* Sort and Search Controls */}
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="relative w-full md:w-64">
                  <SearchBar
                    className="w-full"
                    placeholder="Search products..."
                  />
                </div>
              </div>
            </div>

            {/* Active Filter Pills */}
            {(categoryFilter !== "all" || selectedTags.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryFilter !== "all" && (
                  <div className="flex items-center bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full">
                    Category: {formatCategoryName(categoryFilter)}
                    <button 
                      onClick={() => setCategoryFilter("all")}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {selectedTags.map(tag => (
                  <div key={tag} className="flex items-center bg-amber-50 text-amber-800 text-xs px-3 py-1 rounded-full">
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)}
                      className="ml-1 text-amber-600 hover:text-amber-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {(categoryFilter !== "all" || selectedTags.length > 0) && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-gray-600 hover:text-amber-600 px-2 py-1"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                      We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Button 
                      onClick={resetFilters}
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
                          
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            {product.sale_price && (
                              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Sale
                              </div>
                            )}
                            
                            {product.tags?.includes("organic") && (
                              <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Organic
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => addToWishlist(product)}
                            className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Heart size={18} className="text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-1 text-xs text-amber-600 font-medium uppercase flex items-center">
                            <span>{formatCategoryName(product.category)}</span>
                            {product.subcategory && (
                              <>
                                <span className="mx-1">•</span>
                                <span>{product.subcategory}</span>
                              </>
                            )}
                          </div>
                          
                          <Link to={`/products/${product.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors mb-1">
                              {product.name}
                            </h3>
                          </Link>

                          {product.origin && (
                            <div className="text-xs text-gray-500 mb-1">Origin: {product.origin}</div>
                          )}
                          
                          <div className="flex items-center mb-2">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>
                                  {i < Math.floor(product.rating) ? "★" : (i < product.rating ? "★" : "☆")}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">({product.rating.toFixed(1)})</span>
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
                              
                              {product.weight && (
                                <span className="text-xs text-gray-500 ml-1">/{product.weight}</span>
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

                          {/* Tags Display */}
                          {product.tags && product.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {product.tags.map(tag => (
                                <span 
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
