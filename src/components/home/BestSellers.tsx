
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

// Mock product data - this would come from your API/database in a real app
const products = [
  {
    id: 1,
    name: "Premium Kashmiri Saffron",
    price: 24.99,
    rating: 4.9,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1600880191579-1b85b1df9db4?ixlib=rb-4.0.3",
    category: "spices",
    slug: "premium-kashmiri-saffron",
    badge: "Best Seller"
  },
  {
    id: 2,
    name: "Organic Mamra Almonds",
    price: 19.99,
    rating: 4.8,
    reviews: 97,
    image: "https://images.unsplash.com/photo-1574570068834-fb84c78633f1?ixlib=rb-4.0.3",
    category: "dry-fruits",
    slug: "organic-mamra-almonds",
    badge: "Organic"
  },
  {
    id: 3,
    name: "Persian Pistachios",
    price: 15.99,
    rating: 4.7,
    reviews: 86,
    image: "https://images.unsplash.com/photo-1551983144-f563199d3c90?ixlib=rb-4.0.3",
    category: "dry-fruits",
    slug: "persian-pistachios"
  },
  {
    id: 4,
    name: "Tellicherry Black Pepper",
    price: 12.99,
    rating: 4.6,
    reviews: 72,
    image: "https://images.unsplash.com/photo-1588514912908-8f5891714fca?ixlib=rb-4.0.3",
    category: "spices",
    slug: "tellicherry-black-pepper",
    badge: "Limited"
  }
];

const BestSellers = () => {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-amber-900">Best Sellers</h2>
          <Link to="/products" className="text-amber-700 hover:text-amber-900 font-medium">
            View All Products →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link 
              key={product.id}
              to={`/product/${product.category}/${product.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.badge && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg text-amber-900 mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">({product.reviews} reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900">${product.price.toFixed(2)}</span>
                  <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
