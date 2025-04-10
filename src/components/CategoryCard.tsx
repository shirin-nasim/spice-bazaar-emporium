
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Category } from '@/types/models';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/category/${category.name}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
      onClick={handleClick}
    >
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        {category.image ? (
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">{category.name.charAt(0)}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-center">{category.name}</h3>
        <p className="text-xs text-gray-500 text-center mt-1">
          {category.subcategories.length} subcategories
        </p>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
