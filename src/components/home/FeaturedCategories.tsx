
import { useEffect, useState } from 'react';
import { Category } from '@/types/database.types';
import { getCategories } from '@/api/productApi';
import { Link } from 'react-router-dom';
import { Gift, Package } from 'lucide-react';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-md mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Add our special categories
  const specialCategories = [
    {
      id: 'gift-boxes',
      name: 'Gift Boxes',
      slug: 'products?filter=gift_suitable',
      image_url: '/placeholder.svg',
      icon: <Gift className="h-12 w-12 text-amber-500 mb-3" />
    },
    {
      id: 'bulk-orders',
      name: 'Bulk Orders',
      slug: 'products?filter=bulk_available',
      image_url: '/placeholder.svg',
      icon: <Package className="h-12 w-12 text-amber-600 mb-3" />
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our wide range of premium quality dry fruits, nuts, seeds, and spices from around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Special Categories */}
          {specialCategories.map((category) => (
            <Link 
              key={category.id} 
              to={`/${category.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md bg-white p-6 text-center h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  {category.icon}
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Regular Categories */}
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/category/${category.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md">
                <div 
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${category.image_url || '/placeholder.svg'})` }}
                >
                  <div className="h-full w-full bg-black bg-opacity-30 flex items-center justify-center transition-all group-hover:bg-opacity-20">
                    <h3 className="text-2xl font-bold text-white text-center px-4">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
