
import { supabase } from '@/lib/supabase';
import { Category, Product, Review, Subcategory } from '@/types/database.types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  
  return data || [];
}

export async function getSubcategories(): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
  
  return data || [];
}

export async function getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', categoryId)
    .order('name');
  
  if (error) {
    console.error(`Error fetching subcategories for category ${categoryId}:`, error);
    return [];
  }
  
  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('name');
  
  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  
  return data || [];
}

export async function getProducts(
  category?: string, 
  subcategory?: string, 
  search?: string,
  minPrice?: number,
  maxPrice?: number,
  origin?: string,
  sort?: string
): Promise<Product[]> {
  let query = supabase.from('products').select('*');
  
  // Apply filters
  if (category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id);
    }
  }
  
  if (subcategory) {
    const { data: subcategoryData } = await supabase
      .from('subcategories')
      .select('id')
      .eq('slug', subcategory)
      .single();
    
    if (subcategoryData) {
      query = query.eq('subcategory_id', subcategoryData.id);
    }
  }
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  
  if (minPrice !== undefined) {
    query = query.gte('price', minPrice);
  }
  
  if (maxPrice !== undefined) {
    query = query.lte('price', maxPrice);
  }
  
  if (origin) {
    query = query.eq('origin', origin);
  }
  
  // Apply sorting
  if (sort) {
    switch (sort) {
      case 'price-low-high':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high-low':
        query = query.order('price', { ascending: false });
        break;
      case 'name-a-z':
        query = query.order('name', { ascending: true });
        break;
      case 'name-z-a':
        query = query.order('name', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating-high-low':
        query = query.order('rating', { ascending: false });
        break;
      default:
        query = query.order('name', { ascending: true });
    }
  } else {
    query = query.order('name', { ascending: true });
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
  
  return data;
}

export async function getProductById(id: number): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
  
  return data;
}

export async function getProductReviews(productId: number): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
  
  return data || [];
}

export async function getRelatedProducts(
  categoryId: number, 
  currentProductId: number, 
  limit: number = 4
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .neq('id', currentProductId)
    .limit(limit);
  
  if (error) {
    console.error(`Error fetching related products for category ${categoryId}:`, error);
    return [];
  }
  
  return data || [];
}

export async function createReview(
  productId: number,
  userId: string,
  rating: number,
  comment: string
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        product_id: productId,
        user_id: userId,
        rating,
        comment
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating review:', error);
    return null;
  }
  
  return data;
}

export async function getOrigins(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('origin')
    .not('origin', 'is', null);
  
  if (error) {
    console.error('Error fetching origins:', error);
    return [];
  }
  
  // Get unique origins
  const origins = [...new Set(data.map(item => item.origin))];
  return origins as string[];
}
