
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, ChevronDown, Search, ShoppingCart, Heart } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
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
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popularity");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // For now, we'll use mock data until the database is set up
        const mockProducts: Product[] = [
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
          },
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
            id: 3,
            name: "Himalayan Pink Salt",
            description: "Pure Himalayan pink salt with 84+ minerals",
            price: 6.99,
            sale_price: null,
            category: "spices",
            image_url: "https://images.unsplash.com/photo-1623407787622-efe01a2de7cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            stock: 80,
            featured: false
          },
          {
            id: 4,
            name: "Garam Masala",
            description: "Traditional Indian spice blend",
            price: 8.49,
            sale_price: null,
            category: "spices",
            image_url: "https://images.unsplash.com/photo-1604935371400-3905055fcc9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.6,
            stock: 60,
            featured: true
          },
          {
            id: 5,
            name: "Dried Apricots",
            description: "Naturally sweet dried apricots with no added sugar",
            price: 7.99,
            sale_price: 6.49,
            category: "dried-fruits",
            image_url: "https://images.unsplash.com/photo-1595479856935-e4439b0aee69?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.5,
            stock: 90,
            featured: false
          },
          {
            id: 6,
            name: "Mixed Dried Berries",
            description: "A mix of cranberries, blueberries, and strawberries",
            price: 10.99,
            sale_price: null,
            category: "dried-fruits",
            image_url: "https://images.unsplash.com/photo-1517780234333-1471176dca43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.4,
            stock: 70,
            featured: true
          },
          {
            id: 7,
            name: "Smoked Paprika",
            description: "Spanish smoked paprika with rich flavor",
            price: 5.99,
            sale_price: 4.99,
            category: "spices",
            image_url: "https://images.unsplash.com/photo-1635179205819-5f30b1c8eff0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8,
            stock: 110,
            featured: false
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
            id: 9,
            name: "Cinnamon Sticks",
            description: "Premium Ceylon cinnamon sticks",
            price: 6.49,
            sale_price: null,
            category: "spices",
            image_url: "https://images.unsplash.com/photo-1531236099403-f1a09f481334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9,
            stock: 75,
            featured: false
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
            id: 11,
            name: "BBQ Spice Rub",
            description: "Perfect blend for grilling and barbecues",
            price: 7.99,
            sale_price: 6.99,
            category: "spices",
            image_url: "https://images.unsplash.com/photo-1576038740062-4af196d56a51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7,
            stock: 95,
            featured: true
          },
          {
            id: 12,
            name: "Dried Mango Slices",
            description: "Sweet and tangy dried mango slices",
            price: 8.99,
            sale_price: null,
            category: "dried-fruits",
            image_url: "https://images.unsplash.com/photo-1586190848861-1fb2a8a8c7ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.5,
            stock: 100,
            featured: false
          }
        ];
        
        // Filter and sort products based on user selection
        let filteredProducts = [...mockProducts];
        
        if (filter !== "all") {
          filteredProducts = filteredProducts.filter(product => product.category === filter);
        }
        
        // Sort products
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
  }, [filter, sort, toast]);

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
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="text-gray-600 mt-2">
            Discover our curated selection of premium spices, nuts, and dried fruits
          </p>
        </div>

        {/* Filters and Sort */}
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
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Product Grid */}
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
