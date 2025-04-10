
import React from 'react';
import { getFeaturedProducts } from '@/services/productData';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  const featuredProducts = getFeaturedProducts(8);
  
  return (
    <section className="py-10">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
