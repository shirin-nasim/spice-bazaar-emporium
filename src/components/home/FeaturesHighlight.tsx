
import { Gift, Users, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesHighlight = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Special Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium offerings designed to meet all your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Bulk Orders */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-5 group-hover:bg-blue-100 transition-colors">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Bulk Orders</h3>
            <p className="text-gray-600 mb-5">
              Get special pricing and custom packaging for large quantity orders. Perfect for businesses and events.
            </p>
            <Link 
              to="/products?filter=bulk_available" 
              className="inline-block text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Explore Bulk Products →
            </Link>
          </div>
          
          {/* Gift Options */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 mb-5 group-hover:bg-purple-100 transition-colors">
              <Gift className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Gift Options</h3>
            <p className="text-gray-600 mb-5">
              Premium gift packaging and personalized messages. Send directly to your loved ones.
            </p>
            <Link 
              to="/products?filter=gift_suitable" 
              className="inline-block text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              Discover Gift Ideas →
            </Link>
          </div>
          
          {/* Fast Delivery */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-5 group-hover:bg-green-100 transition-colors">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Fast Delivery</h3>
            <p className="text-gray-600 mb-5">
              Quick and reliable shipping options to ensure your products arrive on time, every time.
            </p>
            <Link 
              to="/shipping" 
              className="inline-block text-green-600 font-medium hover:text-green-800 transition-colors"
            >
              Shipping Details →
            </Link>
          </div>
          
          {/* Premium Quality */}
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-5 group-hover:bg-amber-100 transition-colors">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Premium Quality</h3>
            <p className="text-gray-600 mb-5">
              We source only the highest quality products, with rigorous quality control standards.
            </p>
            <Link 
              to="/about" 
              className="inline-block text-amber-600 font-medium hover:text-amber-800 transition-colors"
            >
              Our Quality Promise →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesHighlight;
