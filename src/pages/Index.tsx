
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoriesSection from '@/components/CategoriesSection';

const Hero = () => (
  <section className="bg-gray-100 py-16">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Premium Quality Dry Fruits & Spices</h1>
          <p className="text-lg text-gray-600 mb-6">
            Explore our wide range of premium quality dry fruits, nuts, spices, and superfoods.
            Sourced from the best regions around the world.
          </p>
          <div className="flex space-x-4">
            <a 
              href="#featured-products" 
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition"
            >
              Shop Now
            </a>
            <a 
              href="#categories" 
              className="border border-primary text-primary px-6 py-2 rounded-md hover:bg-gray-50 transition"
            >
              Browse Categories
            </a>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">Premium Nuts</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">Exotic Dates</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">Aromatic Spices</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-32 bg-gray-200 rounded-md mb-2"></div>
              <h3 className="font-medium">Superfoods</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
          <p className="text-gray-600">
            Our products are sourced from the best regions known for their quality.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">Worldwide Shipping</h3>
          <p className="text-gray-600">
            We deliver our products to customers all around the world.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg mb-2">Best Prices</h3>
          <p className="text-gray-600">
            Competitive pricing with bulk purchase discounts available.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <div id="featured-products">
          <FeaturedProducts />
        </div>
        <div id="categories">
          <CategoriesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
