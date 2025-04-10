
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/types/models';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative pt-[100%] bg-gray-100">
        {product.productImage ? (
          <img 
            src={product.productImage} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <span className="text-xs">{product.name}</span>
          </div>
        )}
        {product.isGift && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Gift
          </span>
        )}
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.origin}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">₹{product.prices.INR}</p>
            <p className="text-xs text-gray-500">{product.packSizes[0]}</p>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleClick}
          variant="outline" 
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
