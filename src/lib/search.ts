
import { supabase } from "./supabase";

export type ProductCategory = 
  | "nuts" 
  | "dried-fruits" 
  | "seeds" 
  | "seed-spices" 
  | "fruit-spices"
  | "bark-spices"
  | "root-spices"
  | "flower-spices"
  | "leaf-spices" 
  | "spice-blends";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  category: ProductCategory;
  subcategory?: string;
  origin?: string;
  image_url: string;
  rating: number;
  stock: number;
  featured: boolean;
  weight?: string;
  tags?: string[];
};

// Comprehensive product database
const mockProducts: Product[] = [
  // NUTS
  {
    id: 1,
    name: "Premium California Almonds",
    description: "Premium quality California almonds with a sweet, buttery flavor and satisfying crunch. Rich in protein, fiber, and healthy fats.",
    price: 12.99,
    sale_price: null,
    category: "nuts",
    subcategory: "almonds",
    origin: "USA, California",
    image_url: "https://images.unsplash.com/photo-1536591168924-4eba31d6150f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 100,
    featured: true,
    weight: "250g",
    tags: ["raw", "unsalted", "premium"]
  },
  {
    id: 2,
    name: "Organic Marcona Almonds",
    description: "Spanish Marcona almonds with a distinctive sweet, delicate flavor and softer texture than regular almonds.",
    price: 15.99,
    sale_price: 13.99,
    category: "nuts",
    subcategory: "almonds",
    origin: "Spain",
    image_url: "https://images.unsplash.com/photo-1608797178993-a062e1517f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 80,
    featured: true,
    weight: "200g",
    tags: ["organic", "roasted", "salted", "gourmet"]
  },
  {
    id: 3,
    name: "Premium Whole Cashews",
    description: "Large, whole cashews with a creamy texture and buttery flavor. Perfect for snacking or adding to your favorite recipes.",
    price: 14.99,
    sale_price: null,
    category: "nuts",
    subcategory: "cashews",
    origin: "Vietnam",
    image_url: "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 120,
    featured: true,
    weight: "250g",
    tags: ["premium", "W240", "unsalted"]
  },
  {
    id: 4,
    name: "Roasted & Salted Pistachios",
    description: "Premium Kerman pistachios roasted to perfection and lightly salted. Crack open the shells to enjoy the vibrant green nuts inside.",
    price: 13.99,
    sale_price: 11.99,
    category: "nuts",
    subcategory: "pistachios",
    origin: "USA",
    image_url: "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 90,
    featured: true,
    weight: "200g",
    tags: ["roasted", "salted", "in-shell"]
  },
  {
    id: 5,
    name: "Raw Turkish Hazelnuts",
    description: "Premium raw hazelnuts from Turkey's Black Sea region, known for their rich, sweet flavor and distinctive aroma.",
    price: 16.99,
    sale_price: null,
    category: "nuts",
    subcategory: "hazelnuts",
    origin: "Turkey",
    image_url: "https://images.unsplash.com/photo-1623428435871-151e1dde8646?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    stock: 70,
    featured: false,
    weight: "200g",
    tags: ["raw", "premium"]
  },
  // DRIED FRUITS
  {
    id: 6,
    name: "Organic Medjool Dates",
    description: "Large, soft and sweet Medjool dates - nature's perfect caramel. Enjoy as a natural energy boost or in baking.",
    price: 10.99,
    sale_price: null,
    category: "dried-fruits",
    subcategory: "dates",
    origin: "Jordan",
    image_url: "https://images.unsplash.com/photo-1606050627722-3646950540ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 85,
    featured: true,
    weight: "250g",
    tags: ["organic", "premium", "pitted"]
  },
  {
    id: 7,
    name: "Jumbo Thompson Raisins",
    description: "Sweet and plump Thompson seedless raisins, sun-dried to perfection. Great for snacking or baking.",
    price: 6.49,
    sale_price: 5.49,
    category: "dried-fruits",
    subcategory: "raisins",
    origin: "USA, California",
    image_url: "https://images.unsplash.com/photo-1616684000067-36952fde56ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    stock: 150,
    featured: false,
    weight: "300g",
    tags: ["no-added-sugar", "seedless"]
  },
  {
    id: 8,
    name: "Turkish Dried Apricots",
    description: "Naturally sweet and tangy dried apricots with a soft, chewy texture. No added sugar or preservatives.",
    price: 8.99,
    sale_price: null,
    category: "dried-fruits",
    subcategory: "apricots",
    origin: "Turkey",
    image_url: "https://images.unsplash.com/photo-1595179241471-d41a2b513e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 95,
    featured: true,
    weight: "250g",
    tags: ["unsulfured", "organic"]
  },
  {
    id: 9,
    name: "Dried Goji Berries",
    description: "Nutrient-dense superfood with a sweet-tangy flavor. Add to smoothies, oatmeal, or enjoy as a snack.",
    price: 12.49,
    sale_price: null,
    category: "dried-fruits",
    subcategory: "berries",
    origin: "China, Ningxia",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    stock: 65,
    featured: false,
    weight: "200g",
    tags: ["superfood", "organic"]
  },
  {
    id: 10,
    name: "Dried Mango Slices",
    description: "Sweet and tangy dried mango slices with a soft, chewy texture. A tropical treat for any time of day.",
    price: 9.99,
    sale_price: 7.99,
    category: "dried-fruits",
    subcategory: "tropical",
    origin: "Thailand",
    image_url: "https://images.unsplash.com/photo-1586190848861-1fb2a8a8c7ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    stock: 100,
    featured: false,
    weight: "200g",
    tags: ["no-added-sugar"]
  },
  // SEEDS
  {
    id: 11,
    name: "Organic Pumpkin Seeds",
    description: "Hulled organic pumpkin seeds (pepitas) with a delicate, nutty flavor. Rich in nutrients and perfect for snacking or topping.",
    price: 7.99,
    sale_price: null,
    category: "seeds",
    subcategory: "pumpkin",
    origin: "Austria",
    image_url: "https://images.unsplash.com/photo-1589927986374-ff3501ea0895?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 110,
    featured: false,
    weight: "200g",
    tags: ["organic", "raw", "hulled"]
  },
  {
    id: 12,
    name: "Black & White Sesame Seed Mix",
    description: "A balanced mix of nutty black and white sesame seeds, perfect for baking, cooking, and garnishing.",
    price: 5.99,
    sale_price: null,
    category: "seeds",
    subcategory: "sesame",
    origin: "Ethiopia & India",
    image_url: "https://images.unsplash.com/photo-1590868987731-2f31cc9f3283?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    stock: 130,
    featured: false,
    weight: "150g",
    tags: ["raw", "unhulled"]
  },
  // SPICES
  {
    id: 13,
    name: "Himalayan Pink Salt",
    description: "Pure Himalayan pink salt with 84+ minerals. Adds a rich, complex flavor to any dish with less sodium than table salt.",
    price: 6.99,
    sale_price: null,
    category: "fruit-spices",
    subcategory: "salt",
    origin: "Pakistan",
    image_url: "https://images.unsplash.com/photo-1623407787622-efe01a2de7cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 80,
    featured: false,
    weight: "250g",
    tags: ["mineral-rich", "coarse"]
  },
  {
    id: 14,
    name: "Premium Saffron Threads",
    description: "Highest quality Spanish saffron threads with intense aroma and flavor. The world's most precious spice.",
    price: 24.99,
    sale_price: null,
    category: "flower-spices",
    subcategory: "saffron",
    origin: "Spain",
    image_url: "https://images.unsplash.com/photo-1600880191579-1b85b1df9db4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 30,
    featured: true,
    weight: "1g",
    tags: ["premium", "grade-1"]
  },
  {
    id: 15,
    name: "Whole Tellicherry Black Peppercorns",
    description: "Premium grade Tellicherry peppercorns from India with complex flavor and aroma. The king of black peppers.",
    price: 8.49,
    sale_price: null,
    category: "fruit-spices",
    subcategory: "pepper",
    origin: "India",
    image_url: "https://images.unsplash.com/photo-1599901400532-b38539221d5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 100,
    featured: false,
    weight: "100g",
    tags: ["premium", "whole"]
  },
  {
    id: 16,
    name: "Ceylon Cinnamon Sticks",
    description: "True Ceylon cinnamon sticks with a delicate, sweet flavor and aroma. Less pungent than cassia cinnamon.",
    price: 9.99,
    sale_price: 8.49,
    category: "bark-spices",
    subcategory: "cinnamon",
    origin: "Sri Lanka",
    image_url: "https://images.unsplash.com/photo-1531236099403-f1a09f481334?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 75,
    featured: false,
    weight: "50g",
    tags: ["true-cinnamon", "premium"]
  },
  {
    id: 17,
    name: "Kashmiri Chili Powder",
    description: "Vibrant red Kashmiri chili powder, known for adding rich color with moderate heat. Essential for authentic Indian cuisine.",
    price: 6.99,
    sale_price: null,
    category: "fruit-spices",
    subcategory: "chili",
    origin: "India",
    image_url: "https://images.unsplash.com/photo-1635179205819-5f30b1c8eff0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 110,
    featured: false,
    weight: "100g",
    tags: ["mild", "vibrant-color"]
  },
  {
    id: 18,
    name: "Organic Turmeric Root Powder",
    description: "Vibrant, aromatic turmeric powder with high curcumin content. Add to curries, smoothies, or golden milk.",
    price: 7.49,
    sale_price: 5.99,
    category: "root-spices",
    subcategory: "turmeric",
    origin: "India",
    image_url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 120,
    featured: true,
    weight: "100g",
    tags: ["organic", "high-curcumin"]
  },
  {
    id: 19,
    name: "Premium Green Cardamom Pods",
    description: "Aromatic green cardamom pods with complex sweet and floral notes. Essential for Middle Eastern and Indian cuisines.",
    price: 11.99,
    sale_price: null,
    category: "seed-spices",
    subcategory: "cardamom",
    origin: "Guatemala",
    image_url: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 65,
    featured: false,
    weight: "50g",
    tags: ["whole", "premium"]
  },
  {
    id: 20,
    name: "Whole Cloves",
    description: "Intensely aromatic whole cloves with warm, sweet flavor. Perfect for both sweet and savory dishes.",
    price: 5.99,
    sale_price: null,
    category: "flower-spices",
    subcategory: "cloves",
    origin: "Indonesia",
    image_url: "https://images.unsplash.com/photo-1599309329925-c456fda2f5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    stock: 90,
    featured: false,
    weight: "50g",
    tags: ["whole", "aromatic"]
  },
  {
    id: 21,
    name: "Garam Masala Spice Blend",
    description: "Traditional North Indian spice blend with warming notes of cardamom, cinnamon, cloves, and more. Perfect finishing spice.",
    price: 8.99,
    sale_price: 7.49,
    category: "spice-blends",
    subcategory: "indian",
    origin: "India",
    image_url: "https://images.unsplash.com/photo-1604935371400-3905055fcc9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 85,
    featured: true,
    weight: "80g",
    tags: ["authentic", "premium-blend"]
  },
  {
    id: 22,
    name: "Za'atar Spice Blend",
    description: "Traditional Middle Eastern blend of thyme, sumac, sesame seeds and salt. Perfect for dipping oils, meats, and vegetables.",
    price: 9.49,
    sale_price: null,
    category: "spice-blends",
    subcategory: "middle-eastern",
    origin: "Lebanon",
    image_url: "https://images.unsplash.com/photo-1599909137637-f13829fc0f3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 70,
    featured: false,
    weight: "80g",
    tags: ["authentic", "traditional"]
  },
  {
    id: 23,
    name: "Dried Bay Leaves",
    description: "Aromatic dried bay leaves for adding depth to soups, stews, and sauces. Remove before serving.",
    price: 4.99,
    sale_price: null,
    category: "leaf-spices",
    subcategory: "bay",
    origin: "Turkey",
    image_url: "https://images.unsplash.com/photo-1599909033615-3a1310fda0b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.5,
    stock: 100,
    featured: false,
    weight: "20g",
    tags: ["whole", "premium"]
  },
  {
    id: 24,
    name: "Dried Fenugreek Leaves (Kasuri Methi)",
    description: "Aromatic dried fenugreek leaves with a distinctive maple-like aroma. Essential for authentic Indian dishes.",
    price: 5.99,
    sale_price: null,
    category: "leaf-spices",
    subcategory: "fenugreek",
    origin: "India",
    image_url: "https://images.unsplash.com/photo-1599909139290-36fc722377e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    stock: 75,
    featured: false,
    weight: "30g",
    tags: ["dried", "aromatic"]
  }
];

// This function would normally connect to Supabase
// For now, we're using mock data for the products
export const searchProducts = async (query: string): Promise<Product[]> => {
  // In a real application, we would use Supabase here
  // For example:
  // if (query) {
  //   const { data, error } = await supabase
  //     .from('products')
  //     .select('*')
  //     .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
  //   
  //   if (error) {
  //     console.error('Error searching products:', error);
  //     return [];
  //   }
  //   
  //   return data as Product[];
  // } else {
  //   const { data, error } = await supabase.from('products').select('*');
  //   if (error) {
  //     console.error('Error fetching all products:', error);
  //     return [];
  //   }
  //   
  //   return data as Product[];
  // }

  if (!query || query.trim() === "") {
    return mockProducts;
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  return mockProducts.filter(
    product => 
      product.name.toLowerCase().includes(normalizedQuery) || 
      product.description.toLowerCase().includes(normalizedQuery) || 
      product.category.toLowerCase().includes(normalizedQuery) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(normalizedQuery)) ||
      (product.origin && product.origin.toLowerCase().includes(normalizedQuery)) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
  );
};

// Function to get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  // In a real application with Supabase:
  // const { data, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('featured', true)
  //   .limit(8);
  //
  // if (error) {
  //   console.error('Error fetching featured products:', error);
  //   return [];
  // }
  // 
  // return data as Product[];
  
  return mockProducts.filter(product => product.featured).slice(0, 8);
};

// Function to get products by category
export const getProductsByCategory = async (category: ProductCategory): Promise<Product[]> => {
  // In a real application with Supabase:
  // const { data, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('category', category);
  //
  // if (error) {
  //   console.error(`Error fetching ${category} products:`, error);
  //   return [];
  // }
  // 
  // return data as Product[];
  
  return mockProducts.filter(product => product.category === category);
};

// Function to get a single product by ID
export const getProductById = async (id: number): Promise<Product | null> => {
  // In a real application with Supabase:
  // const { data, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  //
  // if (error) {
  //   console.error(`Error fetching product with ID ${id}:`, error);
  //   return null;
  // }
  // 
  // return data as Product;
  
  const product = mockProducts.find(product => product.id === id);
  return product || null;
};

// Function to get product categories with counts
export interface CategoryCount {
  category: ProductCategory;
  label: string;
  count: number;
}

export const getProductCategories = async (): Promise<CategoryCount[]> => {
  // In a real application with Supabase, you might use a more complex query
  // For now, we'll count from our mock data
  
  const categories: CategoryCount[] = [
    { category: "nuts", label: "Nuts", count: 0 },
    { category: "dried-fruits", label: "Dried Fruits", count: 0 },
    { category: "seeds", label: "Seeds", count: 0 },
    { category: "seed-spices", label: "Seed Spices", count: 0 },
    { category: "fruit-spices", label: "Fruit Spices", count: 0 },
    { category: "bark-spices", label: "Bark Spices", count: 0 },
    { category: "root-spices", label: "Root Spices", count: 0 },
    { category: "flower-spices", label: "Flower Spices", count: 0 },
    { category: "leaf-spices", label: "Leaf Spices", count: 0 },
    { category: "spice-blends", label: "Spice Blends", count: 0 }
  ];
  
  mockProducts.forEach(product => {
    const category = categories.find(c => c.category === product.category);
    if (category) {
      category.count++;
    }
  });
  
  return categories.filter(category => category.count > 0);
};
