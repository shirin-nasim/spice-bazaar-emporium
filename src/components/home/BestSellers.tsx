
import { useEffect, useState } from 'react';
import { Product } from '@/types/database.types';
import { getFeaturedProducts } from '@/api/productApi';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      const data = await getFeaturedProducts();
      setProducts(data.slice(0, 8)); // Get first 8 products
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Best Sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our most popular premium quality dry fruits, nuts, and spices handpicked from around the world.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} featured={true} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
