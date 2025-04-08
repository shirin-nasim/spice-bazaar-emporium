
import { useEffect, useState } from 'react';
import { 
  getProducts, 
} from '@/api/productApi';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getSubcategories
} from '@/api/admin';
import { Product, Category, Subcategory } from '@/types/database.types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  RefreshCw
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  category_id: z.coerce.number().optional(),
  subcategory_id: z.coerce.number().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  sale_price: z.coerce.number().positive('Sale price must be positive').optional().nullable(),
  origin: z.string().optional(),
  use_case: z.string().optional(),
  shelf_life: z.string().optional(),
  is_gift_suitable: z.boolean().default(false),
  is_bulk_available: z.boolean().default(false),
  weight: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional(),
  hs_code: z.string().optional(),
  sourcing: z.string().optional(),
  featured: z.boolean().default(false),
  in_stock: z.boolean().default(true)
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const createForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      sale_price: null,
      is_gift_suitable: false,
      is_bulk_available: false,
      featured: false,
      in_stock: true
    }
  });
  
  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      sale_price: null,
      is_gift_suitable: false,
      is_bulk_available: false,
      featured: false,
      in_stock: true
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [productsData, categoriesData, subcategoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
          getSubcategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [refreshTrigger, toast]);
  
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      
      try {
        const productsData = await getProducts(undefined, undefined, debouncedSearch);
        setProducts(productsData);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredProducts();
  }, [debouncedSearch]);
  
  const onCreateSubmit = async (data: ProductFormValues) => {
    try {
      const newProduct = {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        category_id: data.category_id,
        subcategory_id: data.subcategory_id,
        price: data.price,
        sale_price: data.sale_price,
        origin: data.origin || '',
        use_case: data.use_case || '',
        shelf_life: data.shelf_life || '',
        is_gift_suitable: data.is_gift_suitable || false,
        is_bulk_available: data.is_bulk_available || false,
        weight: data.weight || '',
        image_url: data.image_url || '',
        hs_code: data.hs_code || '',
        sourcing: data.sourcing || '',
        featured: data.featured || false,
        in_stock: data.in_stock || true,
        rating: 0,
        pack_sizes: null,
        tags: null,
        sourcing_city: null,
        supplier_details: null,
      };
      
      const result = await createProduct(newProduct);
      
      if (result) {
        toast({
          title: 'Product Created',
          description: `Successfully created ${result.name}`,
        });
        
        setIsCreateDialogOpen(false);
        createForm.reset();
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    }
  };
  
  const onEditSubmit = async (data: ProductFormValues) => {
    if (!currentProduct) return;
    
    try {
      const result = await updateProduct(currentProduct.id, data);
      
      if (result) {
        toast({
          title: 'Product Updated',
          description: `Successfully updated ${result.name}`,
        });
        
        setIsEditDialogOpen(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    if (!currentProduct) return;
    
    try {
      const result = await deleteProduct(currentProduct.id);
      
      if (result) {
        toast({
          title: 'Product Deleted',
          description: `Successfully deleted ${currentProduct.name}`,
        });
        
        setIsDeleteDialogOpen(false);
        setCurrentProduct(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    if (currentProduct && isEditDialogOpen) {
      editForm.reset({
        name: currentProduct.name,
        slug: currentProduct.slug,
        description: currentProduct.description || '',
        category_id: currentProduct.category_id || undefined,
        subcategory_id: currentProduct.subcategory_id || undefined,
        price: currentProduct.price,
        sale_price: currentProduct.sale_price,
        origin: currentProduct.origin || '',
        use_case: currentProduct.use_case || '',
        shelf_life: currentProduct.shelf_life || '',
        is_gift_suitable: currentProduct.is_gift_suitable,
        is_bulk_available: currentProduct.is_bulk_available,
        weight: currentProduct.weight || '',
        image_url: currentProduct.image_url || '',
        hs_code: currentProduct.hs_code || '',
        sourcing: currentProduct.sourcing || '',
        featured: currentProduct.featured,
        in_stock: currentProduct.in_stock
      });
    }
  }, [currentProduct, isEditDialogOpen, editForm]);
  
  useEffect(() => {
    const subscription = createForm.watch((value, { name }) => {
      if (name === 'name') {
        const slug = value.name
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        createForm.setValue('slug', slug || '');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [createForm]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new product.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={createForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="product-slug" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="sale_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              value={field.value === null ? '' : field.value}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value === '' ? null : parseFloat(value));
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(value) => field.onChange(parseInt(value) || undefined)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="subcategory_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory</FormLabel>
                          <Select
                            value={field.value?.toString() || ''}
                            onValueChange={(value) => field.onChange(parseInt(value) || undefined)}
                            disabled={!createForm.watch('category_id')}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subcategory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">None</SelectItem>
                              {subcategories
                                .filter(sub => sub.category_id === createForm.watch('category_id'))
                                .map((subcategory) => (
                                  <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                    {subcategory.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <FormControl>
                            <Input placeholder="Country of origin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={createForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Product description"
                                className="resize-none min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={createForm.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="500g" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="use_case"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Use Case</FormLabel>
                          <FormControl>
                            <Input placeholder="Snacking, Cooking, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="shelf_life"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shelf Life</FormLabel>
                          <FormControl>
                            <Input placeholder="6 months" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="hs_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HS Code</FormLabel>
                          <FormControl>
                            <Input placeholder="HS Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="sourcing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sourcing</FormLabel>
                          <FormControl>
                            <Input placeholder="Sourcing details" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={createForm.control}
                      name="is_gift_suitable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Gift Suitable</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="is_bulk_available"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Bulk Available</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">Featured</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={createForm.control}
                      name="in_stock"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">In Stock</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      Create Product
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-gray-200 animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.sale_price ? (
                      <div>
                        <span className="text-amber-600 font-medium">₹{product.sale_price}</span>
                        <span className="text-gray-500 text-sm line-through ml-2">₹{product.price}</span>
                      </div>
                    ) : (
                      <span>₹{product.price}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {categories.find(c => c.id === product.category_id)?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {product.in_stock ? (
                        <span className="inline-flex items-center text-sm text-green-700 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3 mr-1" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-sm text-red-700 bg-red-50 px-2 py-1 rounded-full">
                          <X className="w-3 h-3 mr-1" />
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Dialog open={isEditDialogOpen && currentProduct?.id === product.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (open) setCurrentProduct(product);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>
                            Make changes to the product details.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...editForm}>
                          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={editForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="slug"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                      <Input placeholder="product-slug" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      URL-friendly version of name
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="sale_price"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sale Price (Optional)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        step="0.01" 
                                        value={field.value === null ? '' : field.value}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          field.onChange(value === '' ? null : parseFloat(value));
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="category_id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                      value={field.value?.toString() || ''}
                                      onValueChange={(value) => field.onChange(parseInt(value) || undefined)}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {categories.map((category) => (
                                          <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="subcategory_id"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subcategory</FormLabel>
                                    <Select
                                      value={field.value?.toString() || ''}
                                      onValueChange={(value) => field.onChange(parseInt(value) || undefined)}
                                      disabled={!editForm.watch('category_id')}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select subcategory" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {subcategories
                                          .filter(sub => sub.category_id === editForm.watch('category_id'))
                                          .map((subcategory) => (
                                            <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                                              {subcategory.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="image_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="origin"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Origin</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Country of origin" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="md:col-span-2">
                                <FormField
                                  control={editForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Product description"
                                          className="resize-none min-h-24"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={editForm.control}
                                name="weight"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Weight</FormLabel>
                                    <FormControl>
                                      <Input placeholder="500g" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="use_case"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Use Case</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Snacking, Cooking, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="shelf_life"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Shelf Life</FormLabel>
                                    <FormControl>
                                      <Input placeholder="6 months" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="hs_code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>HS Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="HS Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="sourcing"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Sourcing</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Sourcing details" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                              <FormField
                                control={editForm.control}
                                name="is_gift_suitable"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer">Gift Suitable</FormLabel>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="is_bulk_available"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer">Bulk Available</FormLabel>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="featured"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer">Featured</FormLabel>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="in_stock"
                                render={({ field }) => (
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer">In Stock</FormLabel>
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isDeleteDialogOpen && currentProduct?.id === product.id} onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (open) setCurrentProduct(product);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Product</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsTab;
