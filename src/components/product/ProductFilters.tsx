
import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { getCategories, getOrigins, getSubcategories } from '@/api/productApi';
import { Category, Subcategory } from '@/types/database.types';

interface ProductFiltersProps {
  onFilterChange: (filters: {
    categories: string[];
    subcategories: string[];
    priceRange: [number, number];
    origins: string[];
  }) => void;
  selectedCategory?: string;
}

const ProductFilters = ({ 
  onFilterChange, 
  selectedCategory 
}: ProductFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true);
      const [categoriesData, subcategoriesData, originsData] = await Promise.all([
        getCategories(),
        getSubcategories(),
        getOrigins()
      ]);
      
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setOrigins(originsData);
      setLoading(false);
    };
    
    fetchFilterData();
  }, []);
  
  useEffect(() => {
    // If a category is pre-selected from props, initialize with it
    if (selectedCategory && categories.length > 0) {
      const category = categories.find(c => c.slug === selectedCategory);
      if (category) {
        setSelectedCategories([category.slug]);
      }
    }
  }, [selectedCategory, categories]);
  
  useEffect(() => {
    // Notify parent component when filters change
    onFilterChange({
      categories: selectedCategories,
      subcategories: selectedSubcategories,
      priceRange,
      origins: selectedOrigins
    });
  }, [selectedCategories, selectedSubcategories, priceRange, selectedOrigins, onFilterChange]);
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  const handleCategoryToggle = (slug: string, checked: boolean) => {
    setSelectedCategories(prev => 
      checked ? [...prev, slug] : prev.filter(c => c !== slug)
    );
  };
  
  const handleSubcategoryToggle = (slug: string, checked: boolean) => {
    setSelectedSubcategories(prev => 
      checked ? [...prev, slug] : prev.filter(s => s !== slug)
    );
  };
  
  const handleOriginToggle = (origin: string, checked: boolean) => {
    setSelectedOrigins(prev => 
      checked ? [...prev, origin] : prev.filter(o => o !== origin)
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedOrigins([]);
    setPriceRange([0, 2000]);
  };
  
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-5 bg-gray-200 rounded mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-5 bg-gray-200 rounded mb-4 mt-6 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
        >
          Reset All
        </Button>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                id={`category-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={(checked) => 
                  handleCategoryToggle(category.slug, checked === true)
                }
              />
              <label
                htmlFor={`category-${category.slug}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {selectedCategories.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Subcategories</h4>
          <div className="space-y-2">
            {subcategories
              .filter(sub => 
                categories
                  .filter(cat => selectedCategories.includes(cat.slug))
                  .map(cat => cat.id)
                  .includes(sub.category_id)
              )
              .map((subcategory) => (
                <div key={subcategory.id} className="flex items-center">
                  <Checkbox
                    id={`subcategory-${subcategory.slug}`}
                    checked={selectedSubcategories.includes(subcategory.slug)}
                    onCheckedChange={(checked) => 
                      handleSubcategoryToggle(subcategory.slug, checked === true)
                    }
                  />
                  <label
                    htmlFor={`subcategory-${subcategory.slug}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {subcategory.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="pt-2 px-2">
          <Slider
            defaultValue={[0, 2000]}
            max={2000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex items-center justify-between text-sm">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Origin</h4>
        <div className="space-y-2">
          {origins.map((origin, index) => (
            <div key={index} className="flex items-center">
              <Checkbox
                id={`origin-${origin}`}
                checked={selectedOrigins.includes(origin)}
                onCheckedChange={(checked) => 
                  handleOriginToggle(origin, checked === true)
                }
              />
              <label
                htmlFor={`origin-${origin}`}
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {origin}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
