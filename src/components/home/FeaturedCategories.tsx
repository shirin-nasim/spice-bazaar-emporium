
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CategoryCount, getProductCategories } from "@/lib/search";

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getProductCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Function to format category name for display
  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get background image based on category
  const getCategoryImage = (category: string): string => {
    const images: Record<string, string> = {
      "nuts": "https://images.unsplash.com/photo-1606050627722-3646950540ca?ixlib=rb-4.0.3&auto=format&fit=crop",
      "dried-fruits": "https://images.unsplash.com/photo-1599901400532-b38539221d5a?ixlib=rb-4.0.3&auto=format&fit=crop",
      "seeds": "https://images.unsplash.com/photo-1589927986374-ff3501ea0895?ixlib=rb-4.0.3&auto=format&fit=crop",
      "seed-spices": "https://images.unsplash.com/photo-1604935371400-3905055fcc9c?ixlib=rb-4.0.3&auto=format&fit=crop",
      "fruit-spices": "https://images.unsplash.com/photo-1599899837456-4ce81e35d3b1?ixlib=rb-4.0.3&auto=format&fit=crop",
      "bark-spices": "https://images.unsplash.com/photo-1531236099403-f1a09f481334?ixlib=rb-4.0.3&auto=format&fit=crop",
      "root-spices": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop",
      "flower-spices": "https://images.unsplash.com/photo-1600880191579-1b85b1df9db4?ixlib=rb-4.0.3&auto=format&fit=crop",
      "leaf-spices": "https://images.unsplash.com/photo-1599909139290-36fc722377e6?ixlib=rb-4.0.3&auto=format&fit=crop",
      "spice-blends": "https://images.unsplash.com/photo-1599909033615-3a1310fda0b1?ixlib=rb-4.0.3&auto=format&fit=crop",
    };

    return images[category] || "https://images.unsplash.com/photo-1604935371400-3905055fcc9c?ixlib=rb-4.0.3&auto=format&fit=crop";
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Our Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive range of premium dried fruits, nuts, and exotic spices from around the world.
            Each product is carefully sourced for quality and freshness.
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg overflow-hidden h-48 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.category}
                to={`/products?category=${category.category}`}
                className="group relative overflow-hidden rounded-lg shadow-md h-48"
              >
                <img
                  src={getCategoryImage(category.category)}
                  alt={category.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold group-hover:text-amber-300 transition-colors">
                    {category.label}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {category.count} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link 
            to="/products" 
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
