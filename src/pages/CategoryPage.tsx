
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductGrid from '@/components/product/ProductGrid';
import { getCategories, getProducts, getSubcategoriesByCategory } from '@/api/productApi';
import { Category, Product, Subcategory } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        // Get all categories
        const categories = await getCategories();
        const categoryData = categories.find(c => c.slug === slug) || null;
        setCategory(categoryData);
        
        if (categoryData) {
          // Get subcategories for this category
          const subcats = await getSubcategoriesByCategory(categoryData.id);
          setSubcategories(subcats);
          
          // Get products for this category
          const productsData = await getProducts(slug);
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [slug]);
  
  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    setLoading(true);
    
    try {
      if (value === 'all') {
        const productsData = await getProducts(slug);
        setProducts(productsData);
      } else {
        const subcategory = subcategories.find(s => s.slug === value);
        if (subcategory) {
          const productsData = await getProducts(slug, value);
          setProducts(productsData);
        }
      }
    } catch (error) {
      console.error('Error fetching products for tab:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="h-12 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index}>
                  <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
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
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-amber-600">Products</Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600 max-w-3xl">{category.description}</p>
          )}
        </div>
        
        {subcategories.length > 0 ? (
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="w-full flex flex-wrap justify-start h-auto bg-transparent border-b border-gray-200">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 border-b-2 border-transparent rounded-none px-4 py-2 font-medium"
              >
                All
              </TabsTrigger>
              {subcategories.map((subcategory) => (
                <TabsTrigger
                  key={subcategory.id}
                  value={subcategory.slug}
                  className="data-[state=active]:border-amber-600 data-[state=active]:text-amber-600 border-b-2 border-transparent rounded-none px-4 py-2 font-medium"
                >
                  {subcategory.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <ProductGrid products={products} loading={loading} />
            </TabsContent>
          </Tabs>
        ) : (
          <ProductGrid products={products} loading={loading} />
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
