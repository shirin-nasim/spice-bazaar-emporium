
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw,
  Gift
} from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface GiftBox {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  items: string[];
  featured: boolean;
  created_at: string;
}

const giftBoxSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  image_url: z.string().url('Must be a valid URL'),
  items: z.string().transform(value => value.split('\n').filter(item => item.trim() !== '')),
  featured: z.boolean().default(false)
});

type GiftBoxFormValues = z.infer<typeof giftBoxSchema>;

const GiftBoxesTab = () => {
  const { toast } = useToast();
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentGiftBox, setCurrentGiftBox] = useState<GiftBox | null>(null);
  
  const createForm = useForm<GiftBoxFormValues>({
    resolver: zodResolver(giftBoxSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      items: '',
      featured: false
    }
  });
  
  const editForm = useForm<GiftBoxFormValues>({
    resolver: zodResolver(giftBoxSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      price: 0,
      image_url: '',
      items: '',
      featured: false
    }
  });
  
  useEffect(() => {
    const fetchGiftBoxes = async () => {
      setLoading(true);
      
      let query = supabase
        .from('gift_boxes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (debouncedSearch) {
        query = query.ilike('name', `%${debouncedSearch}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching gift boxes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load gift boxes',
          variant: 'destructive',
        });
      } else {
        setGiftBoxes(data || []);
      }
      
      setLoading(false);
    };
    
    fetchGiftBoxes();
  }, [debouncedSearch, refreshTrigger, toast]);
  
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
  
  useEffect(() => {
    if (currentGiftBox && isEditDialogOpen) {
      editForm.reset({
        name: currentGiftBox.name,
        slug: currentGiftBox.slug,
        description: currentGiftBox.description,
        price: currentGiftBox.price,
        image_url: currentGiftBox.image_url,
        items: currentGiftBox.items.join('\n'),
        featured: currentGiftBox.featured
      });
    }
  }, [currentGiftBox, isEditDialogOpen, editForm]);
  
  const onCreateSubmit = async (data: GiftBoxFormValues) => {
    try {
      const { error } = await supabase
        .from('gift_boxes')
        .insert([{
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          image_url: data.image_url,
          items: data.items,
          featured: data.featured
        }]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Gift Box Created',
        description: `Successfully created ${data.name}`,
      });
      
      setIsCreateDialogOpen(false);
      createForm.reset();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error creating gift box:', error);
      toast({
        title: 'Error',
        description: 'Failed to create gift box',
        variant: 'destructive',
      });
    }
  };
  
  const onEditSubmit = async (data: GiftBoxFormValues) => {
    if (!currentGiftBox) return;
    
    try {
      const { error } = await supabase
        .from('gift_boxes')
        .update({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          image_url: data.image_url,
          items: data.items,
          featured: data.featured
        })
        .eq('id', currentGiftBox.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Gift Box Updated',
        description: `Successfully updated ${data.name}`,
      });
      
      setIsEditDialogOpen(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error updating gift box:', error);
      toast({
        title: 'Error',
        description: 'Failed to update gift box',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    if (!currentGiftBox) return;
    
    try {
      const { error } = await supabase
        .from('gift_boxes')
        .delete()
        .eq('id', currentGiftBox.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Gift Box Deleted',
        description: `Successfully deleted ${currentGiftBox.name}`,
      });
      
      setIsDeleteDialogOpen(false);
      setCurrentGiftBox(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting gift box:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete gift box',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search gift boxes..."
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
                Add Gift Box
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Gift Box</DialogTitle>
                <DialogDescription>
                  Create a new gift box package for your customers.
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
                            <Input placeholder="Premium Gift Box" {...field} />
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
                            <Input placeholder="premium-gift-box" {...field} />
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
                  </div>
                  
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A beautiful gift box containing premium dry fruits and nuts..."
                            className="resize-none min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="items"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Items Included</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="200g Premium Cashews
100g California Almonds
100g Medjool Dates
50g Pistachios"
                            className="resize-none min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add each item on a new line
                        </FormDescription>
                        <FormMessage />
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
                        <FormLabel className="cursor-pointer">Featured Gift Box</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                      Create Gift Box
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
              <TableHead>Items Count</TableHead>
              <TableHead>Featured</TableHead>
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
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : giftBoxes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex flex-col items-center">
                    <Gift className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">No gift boxes found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              giftBoxes.map((giftBox) => (
                <TableRow key={giftBox.id}>
                  <TableCell>
                    <img 
                      src={giftBox.image_url || '/placeholder.svg'} 
                      alt={giftBox.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{giftBox.name}</TableCell>
                  <TableCell>₹{giftBox.price}</TableCell>
                  <TableCell>{giftBox.items.length} items</TableCell>
                  <TableCell>
                    {giftBox.featured ? (
                      <span className="inline-flex items-center text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Dialog open={isEditDialogOpen && currentGiftBox?.id === giftBox.id} onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (open) setCurrentGiftBox(giftBox);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Gift Box</DialogTitle>
                            <DialogDescription>
                              Update the gift box details.
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
                                        <Input placeholder="Premium Gift Box" {...field} />
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
                                        <Input placeholder="premium-gift-box" {...field} />
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
                              </div>
                              
                              <FormField
                                control={editForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="A beautiful gift box containing premium dry fruits and nuts..."
                                        className="resize-none min-h-24"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={editForm.control}
                                name="items"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Items Included</FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="200g Premium Cashews
100g California Almonds
100g Medjool Dates
50g Pistachios"
                                        className="resize-none min-h-32"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Add each item on a new line
                                    </FormDescription>
                                    <FormMessage />
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
                                    <FormLabel className="cursor-pointer">Featured Gift Box</FormLabel>
                                  </FormItem>
                                )}
                              />
                              
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
                      
                      <Dialog open={isDeleteDialogOpen && currentGiftBox?.id === giftBox.id} onOpenChange={(open) => {
                        setIsDeleteDialogOpen(open);
                        if (open) setCurrentGiftBox(giftBox);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Gift Box</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{giftBox.name}"? This action cannot be undone.
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
                    </div>
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

export default GiftBoxesTab;
