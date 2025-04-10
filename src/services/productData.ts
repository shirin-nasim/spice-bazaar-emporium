
import { Product, Category, Subcategory } from '../types/models';

// Sample product data from the custom instructions
export const products: Product[] = [
  {
    id: 1,
    name: "Almonds",
    category: "Dry Fruits",
    subcategory: "Nuts",
    origin: "India",
    useCase: "Snacking",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 600,
      AED: 27,
      USD: 7.2,
      GBP: 5.6
    },
    hsCode: "802.11",
    sourcing: "India",
    description: "Premium quality almonds perfect for snacking and cooking."
  },
  {
    id: 2,
    name: "Cashews",
    category: "Dry Fruits",
    subcategory: "Nuts",
    origin: "India",
    useCase: "Cooking",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 700,
      AED: 32,
      USD: 8.4,
      GBP: 6.5
    },
    hsCode: "801.32",
    sourcing: "India",
    description: "Creamy and delicious cashews, perfect for cooking or as a nutritious snack."
  },
  {
    id: 3,
    name: "Walnuts",
    category: "Dry Fruits",
    subcategory: "Nuts",
    origin: "USA",
    useCase: "Baking",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 900,
      AED: 41,
      USD: 10.8,
      GBP: 8.2
    },
    hsCode: "802.31",
    sourcing: "USA",
    description: "Premium walnuts with a rich, earthy flavor, ideal for baking and cooking."
  },
  {
    id: 4,
    name: "Pistachios",
    category: "Dry Fruits",
    subcategory: "Nuts",
    origin: "Iran",
    useCase: "Gifting",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 850,
      AED: 39,
      USD: 10.2,
      GBP: 7.9
    },
    hsCode: "802.5",
    sourcing: "Iran",
    description: "Vibrant green pistachios with a distinctive flavor, perfect for gifting and snacking."
  },
  {
    id: 5,
    name: "Dates (Ajwa)",
    category: "Dry Fruits",
    subcategory: "Dried Fruits",
    origin: "Saudi Arabia",
    useCase: "Energy Boost",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 500,
      AED: 23,
      USD: 6,
      GBP: 4.7
    },
    hsCode: "804.1",
    sourcing: "Saudi Arabia",
    description: "Premium Ajwa dates from Saudi Arabia, known for their rich flavor and health benefits."
  },
  {
    id: 6,
    name: "Dates (Medjool)",
    category: "Dry Fruits",
    subcategory: "Dried Fruits",
    origin: "Jordan",
    useCase: "Premium Gift",
    packSizes: ["250g", "500g", "1kg"],
    shelfLife: "6 mo",
    isGift: true,
    isBulk: true,
    prices: {
      INR: 650,
      AED: 30,
      USD: 7.8,
      GBP: 6.1
    },
    hsCode: "804.1",
    sourcing: "Jordan",
    description: "Medjool dates are known as the 'king of dates' for their large size and caramel-like taste."
  },
  // Add more products as needed
];

// Extract unique categories and subcategories
export const categories: Category[] = Array.from(
  new Set(products.map(product => product.category))
).map((categoryName, index) => {
  const subcategories = Array.from(
    new Set(
      products
        .filter(product => product.category === categoryName)
        .map(product => product.subcategory)
    )
  ).map((subcategoryName, subIndex) => ({
    id: subIndex + 1,
    name: subcategoryName,
    categoryId: index + 1
  }));

  return {
    id: index + 1,
    name: categoryName,
    subcategories
  };
});

// Helper functions to get products
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryName: string): Product[] => {
  return products.filter(product => product.category === categoryName);
};

export const getProductsBySubcategory = (subcategoryName: string): Product[] => {
  return products.filter(product => product.subcategory === subcategoryName);
};

export const getFeaturedProducts = (count: number = 8): Product[] => {
  // For now, just return the first 'count' products as featured
  return products.slice(0, count);
};
