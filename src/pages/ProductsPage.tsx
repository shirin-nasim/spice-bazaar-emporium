
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Product } from '@/types/database.types';
import { getProducts } from '@/api/productApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, Search, X } from 'lucide-react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const subcategory = searchParams.get('subcategory') || undefined;
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'name-a-z';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(search, 500);
  
  const [filters, setFilters] = useState({
    categories: category ? [category] : [],
    subcategories: subcategory ? [subcategory] : [],
    priceRange: [0, 2000] as [number, number],
    origins: [] as string[]
  });
  
  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams(searchParams);
    
    if (filters.categories.length === 1) {
      params.set('category', filters.categories[0]);
    } else {
      params.delete('category');
    }
    
    if (filters.subcategories.length === 1) {
      params.set('subcategory', filters.subcategories[0]);
    } else {
      params.delete('subcategory');
    }
    
    if (debouncedSearch) {
      params.set('q', debouncedSearch);
    } else {
      params.delete('q');
    }
    
    setSearchParams(params);
  }, [filters, debouncedSearch, setSearchParams, searchParams]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      let categoryFilter = undefined;
      let subcategoryFilter = undefined;
      
      if (filters.categories.length === 1) {
        categoryFilter = filters.categories[0];
      }
      
      if (filters.subcategories.length === 1) {
        subcategoryFilter = filters.subcategories[0];
      }
      
      const origin = filters.origins.length === 1 ? filters.origins[0] : undefined;
      
      const data = await getProducts(
        categoryFilter,
        subcategoryFilter,
        debouncedSearch,
        filters.priceRange[0],
        filters.priceRange[1],
        origin,
        sortBy
      );
      
      setProducts(data);
      setLoading(false);
    };
    
    fetchProducts();
  }, [filters, debouncedSearch, sortBy]);
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };
  
  const clearSearch = () => {
    setSearch('');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl font-bold text-gray-900">
              {category ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') : 'All Products'}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-10"
                />
                {search && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={clearSearch}
                  >
                    <X size={18} />
                  </Button>
                )}
              </div>
              
              <Select 
                value={sortBy} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="rating-high-low">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-64 flex-shrink-0">
              {/* Desktop filters */}
              <div className="hidden lg:block">
                <ProductFilters 
                  onFilterChange={handleFilterChange} 
                  selectedCategory={category || undefined}
                />
              </div>
              
              {/* Mobile filters */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                    <div className="py-4">
                      <ProductFilters 
                        onFilterChange={handleFilterChange}
                        selectedCategory={category || undefined}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="flex-grow">
              <ProductGrid products={products} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
