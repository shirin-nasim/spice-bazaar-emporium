
import { supabase } from "./supabase";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: string;
  image_url: string;
  rating: number;
  stock: number;
  featured: boolean;
};

// This function would normally connect to Supabase
// For now, we'll search through mock data
export const searchProducts = async (query: string): Promise<Product[]> => {
  // Mock products data (same as in ProductsPage)
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Cashews",
      description: "Roasted and lightly salted premium cashews",
      price: 12.99,
      sale_price: null,
      category: "nuts",
      image_url: "https://images.unsplash.com/photo-1536591168924-4eba31d6150f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      stock: 100,
      featured: true
    },
    {
      id: 2,
      name: "Organic Almonds",
      description: "Raw organic almonds sourced from California",
      price: 9.99,
      sale_price: 7.99,
      category: "nuts",
      image_url: "https://images.unsplash.com/photo-1608797178993-a062e1517f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      stock: 150,
      featured: true
    },
    {
      id: 3,
      name: "Himalayan Pink Salt",
      description: "Pure Himalayan pink salt with 84+ minerals",
      price: 6.99,
      sale_price: null,
      category: "spices",
      image_url: "https://images.unsplash.com/photo-1623407787622-efe01a2de7cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      stock: 80,
      featured: false
    },
    {
      id: 4,
      name: "Garam Masala",
      description: "Traditional Indian spice blend",
      price: 8.49,
      sale_price: null,
      category: "spices",
      image_url: "https://images.unsplash.com/photo-1604935371400-3905055fcc9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      stock: 60,
      featured: true
    },
    {
      id: 5,
      name: "Dried Apricots",
      description: "Naturally sweet dried apricots with no added sugar",
      price: 7.99,
      sale_price: 6.49,
      category: "dried-fruits",
      image_url: "https://images.unsplash.com/photo-1595479856935-e4439b0aee69?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      stock: 90,
      featured: false
    },
    {
      id: 6,
      name: "Mixed Dried Berries",
      description: "A mix of cranberries, blueberries, and strawberries",
      price: 10.99,
      sale_price: null,
      category: "dried-fruits",
      image_url: "https://images.unsplash.com/photo-1517780234333-1471176dca43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.4,
      stock: 70,
      featured: true
    },
    {
      id: 7,
      name: "Smoked Paprika",
      description: "Spanish smoked paprika with rich flavor",
      price: 5.99,
      sale_price: 4.99,
      category: "spices",
      image_url: "https://images.unsplash.com/photo-1635179205819-5f30b1c8eff0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      stock: 110,
      featured: false
    },
    {
      id: 8,
      name: "Pistachio Nuts",
      description: "Roasted and salted pistachio nuts",
      price: 14.99,
      sale_price: null,
      category: "nuts",
      image_url: "https://images.unsplash.com/photo-1600623052101-aa70e5b1e543?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      stock: 85,
      featured: true
    },
    {
      id: 9,
      name: "Cinnamon Sticks",
      description: "Premium Ceylon cinnamon sticks",
      price: 6.49,
      sale_price: null,
      category: "spices",
      image_url: "https://images.unsplash.com/photo-1531236099403-f1a09f481334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      stock: 75,
      featured: false
    },
    {
      id: 10,
      name: "Trail Mix Supreme",
      description: "A mix of nuts, seeds, and dried fruits",
      price: 11.99,
      sale_price: 9.99,
      category: "mixes",
      image_url: "https://images.unsplash.com/photo-1627485937980-221c88ac04a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      stock: 120,
      featured: true
    },
    {
      id: 11,
      name: "BBQ Spice Rub",
      description: "Perfect blend for grilling and barbecues",
      price: 7.99,
      sale_price: 6.99,
      category: "spices",
      image_url: "https://images.unsplash.com/photo-1576038740062-4af196d56a51?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.7,
      stock: 95,
      featured: true
    },
    {
      id: 12,
      name: "Dried Mango Slices",
      description: "Sweet and tangy dried mango slices",
      price: 8.99,
      sale_price: null,
      category: "dried-fruits",
      image_url: "https://images.unsplash.com/photo-1586190848861-1fb2a8a8c7ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      rating: 4.5,
      stock: 100,
      featured: false
    }
  ];

  if (!query || query.trim() === "") {
    return mockProducts;
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  return mockProducts.filter(
    product => 
      product.name.toLowerCase().includes(normalizedQuery) || 
      product.description.toLowerCase().includes(normalizedQuery) || 
      product.category.toLowerCase().includes(normalizedQuery)
  );
};
