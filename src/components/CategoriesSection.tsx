
import React from 'react';
import { categories } from '@/services/productData';
import CategoryCard from './CategoryCard';

const CategoriesSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
