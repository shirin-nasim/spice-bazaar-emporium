import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getCategories
} from '@/api/admin';
import { Category } from '@/types/database.types';
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

const categorySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoriesTab = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
    }
  });
  
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image_url: '',
    }
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
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
  
  useEffect(() => {
    const fetchFilteredCategories = async () => {
      setLoading(true);
      
      try {
        const categoriesData = await getCategories();
        
        const filteredCategories = debouncedSearch
          ? categoriesData.filter(cat => 
              cat.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              cat.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
          : categoriesData;
        
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error searching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilteredCategories();
  }, [debouncedSearch]);
  
  const onCreateSubmit = async (data: CategoryFormValues) => {
    try {
      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image_url: data.image_url || null
      };
      
      const result = await createCategory(categoryData);
      
      if (result) {
        toast({
          title: 'Category Created',
          description: `Successfully created ${result.name}`,
        });
        
        setIsCreateDialogOpen(false);
        createForm.reset();
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
  
  const onEditSubmit = async (data: CategoryFormValues) => {
    if (!currentCategory) return;
    
    try {
      const result = await updateCategory(currentCategory.id, data);
      
      if (result) {
        toast({
          title: 'Category Updated',
          description: `Successfully updated ${result.name}`,
        });
        
        setIsEditDialogOpen(false);
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
  
  const handleDelete = async () => {
    if (!currentCategory) return;
    
    try {
      const result = await deleteCategory(currentCategory.id);
      
      if (result) {
        toast({
          title: 'Category Deleted',
          description: `Successfully deleted ${currentCategory.name}`,
        });
        
        setIsDeleteDialogOpen(false);
        setCurrentCategory(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };
  
  useEffect(() => {
    if (currentCategory && isEditDialogOpen) {
      editForm.reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        description: currentCategory.description || '',
        image_url: currentCategory.image_url || '',
      });
    }
  }, [currentCategory, isEditDialogOpen, editForm]);
  
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
            placeholder="Search categories..."
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
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new category.
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
                            <Input placeholder="Category name" {...field} />
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
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={createForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder="Category description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
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
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
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
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
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
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Dialog open={isEditDialogOpen && currentCategory?.id === category.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (open) setCurrentCategory(category);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                          <DialogDescription>
                            Make changes to the category details.
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
                                      <Input placeholder="Category name" {...field} />
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
                              
                              <div className="md:col-span-2">
                                <FormField
                                  control={editForm.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Description</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Category description" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
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
                    
                    <Dialog open={isDeleteDialogOpen && currentCategory?.id === category.id} onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
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
                            Are you sure you want to delete "{category.name}"? This action cannot be undone.
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

export default CategoriesTab;
