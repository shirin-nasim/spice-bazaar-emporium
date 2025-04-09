
import React from 'react';
import { Link } from 'react-router-dom';

const DesktopNav: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link to="/" className="text-gray-600 hover:text-amber-600 transition-colors">
        Home
      </Link>
      <Link 
        to="/products" 
        className="text-gray-600 hover:text-amber-600 transition-colors"
      >
        Products
      </Link>
      <Link to="/gift-boxes" className="text-gray-600 hover:text-amber-600 transition-colors">
        Gift Boxes
      </Link>
      <Link to="/about" className="text-gray-600 hover:text-amber-600 transition-colors">
        About
      </Link>
      <Link to="/contact" className="text-gray-600 hover:text-amber-600 transition-colors">
        Contact
      </Link>
    </nav>
  );
};

export default DesktopNav;
