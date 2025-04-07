
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Premium Dry Fruits",
    description: "Handpicked selection of the finest nuts and dried fruits",
    image: "https://images.unsplash.com/photo-1563292769-4e05b1223fa1?ixlib=rb-4.0.3",
    slug: "dry-fruits"
  },
  {
    id: 2,
    name: "Exotic Spices",
    description: "Aromatic spices from the finest growing regions",
    image: "https://images.unsplash.com/photo-1532336414690-d9bfbf5c8b7f?ixlib=rb-4.0.3",
    slug: "spices"
  },
  {
    id: 3,
    name: "Luxury Gift Boxes",
    description: "Curated gift collections for every occasion",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?ixlib=rb-4.0.3",
    slug: "gift-boxes"
  }
];

const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-amber-900">Explore Our Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.slug}`}
              className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-amber-100 mb-4">{category.description}</p>
                  <span className="inline-block bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Discover
                  </span>
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
