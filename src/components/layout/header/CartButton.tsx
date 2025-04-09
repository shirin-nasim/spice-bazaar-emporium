
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from "lucide-react";
import { useCartCount } from '@/hooks/use-cart-count';

const CartButton: React.FC = () => {
  const cartCount = useCartCount();

  return (
    <Link to="/cart" className="relative p-2">
      <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-amber-600 transition-colors" />
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-600 rounded-full">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
