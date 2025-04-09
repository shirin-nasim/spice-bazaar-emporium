
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GiftBox } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash, Plus, ImagePlus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const GiftBoxesTab = () => {
  const { toast } = useToast();
  const [giftBoxes, setGiftBoxes] = useState<GiftBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGiftBox, setCurrentGiftBox] = useState<GiftBox | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [itemsText, setItemsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetchGiftBoxes();
  }, []);

  const fetchGiftBoxes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('gift_boxes').select('*');
      
      if (error) throw error;
      
      setGiftBoxes(data || []);
    } catch (error) {
      console.error('Error fetching gift boxes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load gift boxes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGiftBox = () => {
    setIsEditing(false);
    setCurrentGiftBox(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleEditGiftBox = (giftBox: GiftBox) => {
    setIsEditing(true);
    setCurrentGiftBox(giftBox);
    
    setName(giftBox.name);
    setSlug(giftBox.slug);
    setDescription(giftBox.description);
    setPrice(giftBox.price.toString());
    
    // Fix: Convert items to array if needed
    const itemsArray = Array.isArray(giftBox.items) ? giftBox.items : [giftBox.items];
    setItems(itemsArray);
    setItemsText(itemsArray.join('\n'));
    
    setImageUrl(giftBox.image_url || '');
    setFeatured(giftBox.featured || false);
    
    setDialogOpen(true);
  };

  const handleDeleteGiftBox = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this gift box?')) return;
    
    try {
      const { error } = await supabase.from('gift_boxes').delete().eq('id', id);
      
      if (error) throw error;
      
      setGiftBoxes(giftBoxes.filter(box => box.id !== id));
      
      toast({
        title: 'Success',
        description: 'Gift box deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting gift box:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete gift box',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Parse items from text area, one item per line
      const parsedItems: string[] = itemsText.split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      const giftBoxData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        items: parsedItems,
        image_url: imageUrl,
        featured,
      };
      
      if (isEditing && currentGiftBox) {
        const { error } = await supabase
          .from('gift_boxes')
          .update(giftBoxData)
          .eq('id', currentGiftBox.id);
        
        if (error) throw error;
        
        setGiftBoxes(giftBoxes.map(box => 
          box.id === currentGiftBox.id ? { ...box, ...giftBoxData } : box
        ));
        
        toast({
          title: 'Success',
          description: 'Gift box updated successfully',
        });
      } else {
        const { data, error } = await supabase
          .from('gift_boxes')
          .insert([giftBoxData])
          .select();
        
        if (error) throw error;
        
        setGiftBoxes([...giftBoxes, data[0]]);
        
        toast({
          title: 'Success',
          description: 'Gift box created successfully',
        });
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving gift box:', error);
      toast({
        title: 'Error',
        description: 'Failed to save gift box',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setDescription('');
    setPrice('');
    setItems([]);
    setItemsText('');
    setImageUrl('');
    setFeatured(false);
  };

  const handleSlugify = () => {
    setSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gift Boxes</h2>
        <Button onClick={handleAddGiftBox} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="mr-2 h-4 w-4" /> Add Gift Box
        </Button>
      </div>
      
      {loading ? (
        <div className="py-10 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gift boxes...</p>
        </div>
      ) : giftBoxes.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-600">No gift boxes found. Add a new gift box to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giftBoxes.map((giftBox) => (
              <TableRow key={giftBox.id}>
                <TableCell className="font-medium">{giftBox.name}</TableCell>
                <TableCell>₹{giftBox.price}</TableCell>
                <TableCell>
                  {Array.isArray(giftBox.items) ? giftBox.items.length : 0} items
                </TableCell>
                <TableCell>
                  {giftBox.featured ? (
                    <Badge className="bg-green-600">Featured</Badge>
                  ) : (
                    <Badge variant="outline">Standard</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEditGiftBox(giftBox)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteGiftBox(giftBox.id)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Gift Box' : 'Add New Gift Box'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSlugify}
                  placeholder="Premium Dry Fruit Box"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1299"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="premium-dry-fruit-box"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A premium gift box with assorted dry fruits..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Items (one per line)</label>
              <Textarea
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                placeholder="200g Premium Cashews
150g California Almonds
100g Pistachios"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="featured" 
                checked={featured}
                onCheckedChange={(checked) => setFeatured(!!checked)}
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured gift box
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-amber-600 hover:bg-amber-700">
              {isEditing ? 'Update' : 'Create'} Gift Box
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftBoxesTab;
