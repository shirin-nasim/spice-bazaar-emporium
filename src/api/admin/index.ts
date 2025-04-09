
import { isAdmin } from './authAdmin';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getSubcategories
} from './categoryAdmin';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getProductBySlug
} from './productAdmin';

export { 
  isAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getProductBySlug
};
