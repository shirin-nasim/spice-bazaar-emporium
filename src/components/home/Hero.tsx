
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?ixlib=rb-4.0.3')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Premium Spices & Dry Fruits from Around the World
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-amber-100">
            Discover the finest selection of handpicked spices, nuts, and exclusive gift boxes
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/category/spices" 
              className="bg-white text-amber-700 hover:bg-amber-100 px-6 py-3 rounded-lg font-medium text-center"
            >
              Explore Spices
            </Link>
            <Link 
              to="/category/dry-fruits" 
              className="bg-amber-800 text-white hover:bg-amber-900 px-6 py-3 rounded-lg font-medium text-center"
            >
              Shop Dry Fruits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
