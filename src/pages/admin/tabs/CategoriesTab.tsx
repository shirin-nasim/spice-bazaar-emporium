import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory,
  getCategories,
  getSubcategories
} from '@/api/adminApi';
import { Category, Subcategory } from '@/types/database.types';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Category form schema
const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional(),
});

// Subcategory form schema
const subcategorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  category_id: z.number().min(1, 'Category is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

const CategoriesTab = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('categories');
  
  // Dialog states
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  const [isCreateSubcategoryDialogOpen, setIsCreateSubcategoryDialogOpen] = useState(false);
  const [isEditSubcategoryDialogOpen, setIsEditSubcategoryDialogOpen] = useState(false);
  const [isDeleteSubcategoryDialogOpen, setIsDeleteSubcategoryDialogOpen] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  
  // Open states for collapsible categories
  const [openCategories, setOpenCategories] = useState<number[]>([]);
  
  // Forms
  const createCategoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
    }
  });
  
  const editCategoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
    }
  });
  
  const createSubcategoryForm = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      category_id: 0,
    }
  });
  
  const editSubcategoryForm = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      category_id: 0,
    }
  });
  
  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          getCategories(),
          getSubcategories()
        ]);
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching categories data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [refreshTrigger, toast]);
  
  // Generate slug from name for category forms
  useEffect(() => {
    const createSubscription = createCategoryForm.watch((value, { name }) => {
      if (name === 'name') {
        const slug = value.name
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        createCategoryForm.setValue('slug', slug || '');
      }
    });
    
    return () => createSubscription.unsubscribe();
  }, [createCategoryForm]);
  
  // Generate slug from name for subcategory forms
  useEffect(() => {
    const createSubscription = createSubcategoryForm.watch((value, { name }) => {
      if (name === 'name') {
        const slug = value.name
          ?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        
        createSubcategoryForm.setValue('slug', slug || '');
      }
    });
    
    return () => createSubscription.unsubscribe();
  }, [createSubcategoryForm]);
  
  // Set up edit forms when current item changes
  useEffect(() => {
    if (currentCategory && isEditCategoryDialogOpen) {
      editCategoryForm.reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        description: currentCategory.description || '',
        image_url: currentCategory.image_url || '',
      });
    }
    
    if (currentSubcategory && isEditSubcategoryDialogOpen) {
      editSubcategoryForm.reset({
        name: currentSubcategory.name,
        slug: currentSubcategory.slug,
        description: currentSubcategory.description || '',
        category_id: currentSubcategory.category_id,
      });
    }
  }, [currentCategory, currentSubcategory, isEditCategoryDialogOpen, isEditSubcategoryDialogOpen, editCategoryForm, editSubcategoryForm]);
  
  // Toggle a category's open state in the collapsible view
  const toggleCategory = (categoryId: number) => {
    setOpenCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  // Category CRUD operations
  const onCreateCategorySubmit = async (data: CategoryFormValues) => {
    const categoryData: Omit<Category, 'id' | 'created_at'> = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      image_url: data.image_url || null
    };
    
    try {
      const result = await createCategory(categoryData);
      
      if (result) {
        toast({
          title: 'Category Created',
          description: `Successfully created ${result.name}`,
        });
        
        setIsCreateCategoryDialogOpen(false);
        createCategoryForm.reset();
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    }
  };
  
  const onEditCategorySubmit = async (data: CategoryFormValues) => {
    if (!currentCategory) return;
    
    const categoryData: Partial<Omit<Category, 'id' | 'created_at'>> = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url
    };
    
    try {
      const result = await updateCategory(currentCategory.id, categoryData);
      
      if (result) {
        toast({
          title: 'Category Updated',
          description: `Successfully updated ${result.name}`,
        });
        
        setIsEditCategoryDialogOpen(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;
    
    try {
      const result = await deleteCategory(currentCategory.id);
      
      if (result) {
        toast({
          title: 'Category Deleted',
          description: `Successfully deleted ${currentCategory.name}`,
        });
        
        setIsDeleteCategoryDialogOpen(false);
        setCurrentCategory(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category. It may have associated products or subcategories.',
        variant: 'destructive',
      });
    }
  };
  
  // Subcategory CRUD operations
  const onCreateSubcategorySubmit = async (data: SubcategoryFormValues) => {
    const subcategoryData: Omit<Subcategory, 'id' | 'created_at'> = {
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      category_id: data.category_id
    };
    
    try {
      const result = await createSubcategory(subcategoryData);
      
      if (result) {
        toast({
          title: 'Subcategory Created',
          description: `Successfully created ${result.name}`,
        });
        
        setIsCreateSubcategoryDialogOpen(false);
        createSubcategoryForm.reset();
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to create subcategory');
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast({
        title: 'Error',
        description: 'Failed to create subcategory',
        variant: 'destructive',
      });
    }
  };
  
  const onEditSubcategorySubmit = async (data: SubcategoryFormValues) => {
    if (!currentSubcategory) return;
    
    try {
      const result = await updateSubcategory(currentSubcategory.id, data);
      
      if (result) {
        toast({
          title: 'Subcategory Updated',
          description: `Successfully updated ${result.name}`,
        });
        
        setIsEditSubcategoryDialogOpen(false);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to update subcategory');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subcategory',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteSubcategory = async () => {
    if (!currentSubcategory) return;
    
    try {
      const result = await deleteSubcategory(currentSubcategory.id);
      
      if (result) {
        toast({
          title: 'Subcategory Deleted',
          description: `Successfully deleted ${currentSubcategory.name}`,
        });
        
        setIsDeleteSubcategoryDialogOpen(false);
        setCurrentSubcategory(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subcategory. It may have associated products.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            <TabsTrigger value="tree">Category Tree</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            
            {activeTab === 'categories' && (
              <Dialog open={isCreateCategoryDialogOpen} onOpenChange={setIsCreateCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new category.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...createCategoryForm}>
                    <form onSubmit={createCategoryForm.handleSubmit(onCreateCategorySubmit)} className="space-y-4">
                      <FormField
                        control={createCategoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Category name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createCategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="category-slug" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL-friendly version of name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createCategoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Category description"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createCategoryForm.control}
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
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateCategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                          Create Category
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            
            {activeTab === 'subcategories' && (
              <Dialog open={isCreateSubcategoryDialogOpen} onOpenChange={setIsCreateSubcategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Subcategory
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Subcategory</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new subcategory.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...createSubcategoryForm}>
                    <form onSubmit={createSubcategoryForm.handleSubmit(onCreateSubcategorySubmit)} className="space-y-4">
                      <FormField
                        control={createSubcategoryForm.control}
                        name="category_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Category</FormLabel>
                            <Select
                              value={field.value ? field.value.toString() : ''}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
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
                        control={createSubcategoryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Subcategory name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createSubcategoryForm.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="subcategory-slug" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL-friendly version of name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={createSubcategoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Subcategory description"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsCreateSubcategoryDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                          Create Subcategory
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
        
        <TabsContent value="categories" className="pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="w-12 h-12 rounded bg-gray-200 animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <img 
                          src={category.image_url || '/placeholder.svg'} 
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {subcategories.filter(s => s.category_id === category.id).length}
                      </TableCell>
                      <TableCell className="text-right flex justify-end space-x-2">
                        <Dialog open={isEditCategoryDialogOpen && currentCategory?.id === category.id} onOpenChange={(open) => {
                          setIsEditCategoryDialogOpen(open);
                          if (open) setCurrentCategory(category);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>
                                Make changes to the category details.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <Form {...editCategoryForm}>
                              <form onSubmit={editCategoryForm.handleSubmit(onEditCategorySubmit)} className="space-y-4">
                                <FormField
                                  control={editCategoryForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Name</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Category name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={editCategoryForm.control}
                                  name="slug"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Slug</FormLabel>
                                      <FormControl>
                                        <Input placeholder="category-slug" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        URL-friendly version of name
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={editCategoryForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder="Category description"
                                          className="resize-none"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={editCategoryForm.control}
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
                                
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
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
                        
                        <Dialog open={isDeleteCategoryDialogOpen && currentCategory?.id === category.id} onOpenChange={(open) => {
                          setIsDeleteCategoryDialogOpen(open);
                          if (open) setCurrentCategory(category);
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Category</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete "{category.name}"? This will also delete all subcategories. This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button variant="destructive" onClick={handleDeleteCategory}>
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
        </TabsContent>
        
        <TabsContent value="subcategories" className="pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : subcategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No subcategories found
                    </TableCell>
                  </TableRow>
                ) : (
                  subcategories.map((subcategory) => {
                    const parentCategory = categories.find(c => c.id === subcategory.category_id);
                    
                    return (
                      <TableRow key={subcategory.id}>
                        <TableCell className="font-medium">{subcategory.name}</TableCell>
                        <TableCell>{subcategory.slug}</TableCell>
                        <TableCell>
                          {parentCategory ? parentCategory.name : 'Unknown'}
                        </TableCell>
                        <TableCell className="text-right flex justify-end space-x-2">
                          <Dialog open={isEditSubcategoryDialogOpen && currentSubcategory?.id === subcategory.id} onOpenChange={(open) => {
                            setIsEditSubcategoryDialogOpen(open);
                            if (open) setCurrentSubcategory(subcategory);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Subcategory</DialogTitle>
                                <DialogDescription>
                                  Make changes to the subcategory details.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Form {...editSubcategoryForm}>
                                <form onSubmit={editSubcategoryForm.handleSubmit(onEditSubcategorySubmit)} className="space-y-4">
                                  <FormField
                                    control={editSubcategoryForm.control}
                                    name="category_id"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Parent Category</FormLabel>
                                        <Select
                                          value={field.value ? field.value.toString() : ''}
                                          onValueChange={(value) => field.onChange(parseInt(value))}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
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
                                    control={editSubcategoryForm.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input placeholder="Subcategory name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={editSubcategoryForm.control}
                                    name="slug"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                          <Input placeholder="subcategory-slug" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          URL-friendly version of name
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <FormField
                                    control={editSubcategoryForm.control}
                                    name="description"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                          <Textarea
                                            placeholder="Subcategory description"
                                            className="resize-none"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsEditSubcategoryDialogOpen(false)}>
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
                          
                          <Dialog open={isDeleteSubcategoryDialogOpen && currentSubcategory?.id === subcategory.id} onOpenChange={(open) => {
                            setIsDeleteSubcategoryDialogOpen(open);
                            if (open) setCurrentSubcategory(subcategory);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Subcategory</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{subcategory.name}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteSubcategoryDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteSubcategory}>
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="tree" className="pt-4">
          <div className="border rounded-md p-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6 ml-4 mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5 ml-4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6 ml-4 mb-1"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No categories found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => {
                  const categorySubcategories = subcategories.filter(s => s.category_id === category.id);
                  const isOpen = openCategories.includes(category.id);
                  
                  return (
                    <div key={category.id} className="rounded-md border">
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => toggleCategory(category.id)}
                        className="w-full"
                      >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={category.image_url || '/placeholder.svg'} 
                              alt={category.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="font-medium">{category.name}</span>
                            <span className="text-sm text-gray-500">({categorySubcategories.length} subcategories)</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-8 pb-4">
                          {categorySubcategories.length === 0 ? (
                            <p className="text-sm text-gray-500 pl-4">No subcategories</p>
                          ) : (
                            <ul className="space-y-2">
                              {categorySubcategories.map((subcategory) => (
                                <li key={subcategory.id} className="p-2 border-l-2 border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <span>{subcategory.name}</span>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setCurrentSubcategory(subcategory);
                                          setIsEditSubcategoryDialogOpen(true);
                                        }}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50"
                                        onClick={() => {
                                          setCurrentSubcategory(subcategory);
                                          setIsDeleteSubcategoryDialogOpen(true);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              createSubcategoryForm.setValue('category_id', category.id);
                              setIsCreateSubcategoryDialogOpen(true);
                            }}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Subcategory
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoriesTab;
