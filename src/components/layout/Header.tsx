
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-amber-50 border-b border-amber-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-amber-800">
              Global Spice & Nut Bazaar
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/category/dry-fruits" className="text-amber-900 hover:text-amber-700 font-medium">
              Dry Fruits
            </Link>
            <Link to="/category/spices" className="text-amber-900 hover:text-amber-700 font-medium">
              Spices
            </Link>
            <Link to="/category/gift-boxes" className="text-amber-900 hover:text-amber-700 font-medium">
              Gift Boxes
            </Link>
            <Link to="/bulk-orders" className="text-amber-900 hover:text-amber-700 font-medium">
              Bulk Orders
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-amber-900 hover:text-amber-700">
              <Search size={20} />
            </button>
            <Link to="/cart" className="text-amber-900 hover:text-amber-700">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/account" className="text-amber-900 hover:text-amber-700">
              <User size={20} />
            </Link>
            <button 
              className="md:hidden text-amber-900 hover:text-amber-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/category/dry-fruits" 
                className="text-amber-900 hover:text-amber-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dry Fruits
              </Link>
              <Link 
                to="/category/spices" 
                className="text-amber-900 hover:text-amber-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Spices
              </Link>
              <Link 
                to="/category/gift-boxes" 
                className="text-amber-900 hover:text-amber-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Gift Boxes
              </Link>
              <Link 
                to="/bulk-orders" 
                className="text-amber-900 hover:text-amber-700 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Bulk Orders
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
