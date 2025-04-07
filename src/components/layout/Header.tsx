
import { ShoppingCart, User, Search, Menu, Phone, Mail, X, ChevronDown, Heart, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPromoBarVisible, setIsPromoBarVisible] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-white">
      {/* Summer BBQ Special Promo */}
      {isPromoBarVisible && (
        <div className="bg-amber-50 py-2 px-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/735f0ea8-5995-4cf6-810d-0763087415f9.png" 
                alt="Summer BBQ" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-amber-800 font-semibold text-lg">Summer BBQ Special</h3>
                <p className="text-amber-700 text-sm">
                  Get 15% off our BBQ spice blends and nut mixes for your summer gatherings!
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 sm:mt-0">
              <div className="text-right">
                <p className="text-amber-700 text-sm">Offer ends in:</p>
                <div className="flex gap-2">
                  <span className="bg-amber-700 text-white px-2 py-1 rounded text-xs">147d</span>
                  <span className="bg-amber-700 text-white px-2 py-1 rounded text-xs">15h</span>
                  <span className="bg-amber-700 text-white px-2 py-1 rounded text-xs">33m</span>
                  <span className="bg-amber-700 text-white px-2 py-1 rounded text-xs">25s</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" className="border-amber-800 text-amber-800 hover:bg-amber-100">
                  SUMMER15 <span className="ml-1">📋</span>
                </Button>
                <Button className="bg-amber-800 text-white hover:bg-amber-700">
                  Explore
                </Button>
                <button 
                  onClick={() => setIsPromoBarVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Bar */}
      <div className="bg-amber-600 text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">(555) 123-4567</span>
            </div>
            <div className="hidden md:flex items-center">
              <Mail size={16} className="mr-2" />
              <span className="text-sm">info@spicenutemprium.com</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-sm mr-2">🎁 Free shipping on orders over $50!</span>
              <button 
                onClick={() => {}}
                className="text-white hover:text-amber-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200 py-4 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xl font-bold">⊙</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                  Spice & Nut
                </h1>
              </div>
              <span className="text-amber-600 text-xs font-semibold tracking-wider">PREMIUM EMPORIUM</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex relative w-1/3">
            <input
              type="text"
              placeholder="Search products, spices, recipes..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-800 hover:text-amber-600 font-medium">
              Home
            </Link>
            <div className="relative group">
              <Link to="/products" className="text-gray-800 hover:text-amber-600 font-medium flex items-center">
                Products <ChevronDown size={16} className="ml-1" />
              </Link>
            </div>
            <Link to="/about" className="text-gray-800 hover:text-amber-600 font-medium">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-800 hover:text-amber-600 font-medium">
              Contact Us
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <span className="text-gray-800 font-medium flex items-center">
                INR <ChevronDown size={16} className="ml-1" />
              </span>
            </div>
            <button className="text-gray-800 hidden md:block">
              <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-amber-800">☀</span>
              </div>
            </button>
            <div className="hidden md:flex items-center">
              <span className="text-gray-800 font-medium flex items-center">
                <span className="mr-1">🇺🇸</span> EN <ChevronDown size={16} className="ml-1" />
              </span>
            </div>
            <Link to="/wishlist" className="text-gray-800 hover:text-amber-600 hidden md:block">
              <Heart size={22} />
            </Link>
            <Link to="/cart" className="text-gray-800 hover:text-amber-600">
              <ShoppingCart size={22} />
            </Link>
            
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center text-amber-600 font-medium">
                  <User size={22} className="mr-1" />
                  <span className="hidden lg:inline">Account</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">My Orders</Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-amber-50 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-amber-600 font-medium hidden md:block">
                Sign In
              </Link>
            )}
            
            <button 
              className="md:hidden text-gray-800 hover:text-amber-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <div className="flex justify-center mb-4">
              <div className="relative w-full px-4">
                <input
                  type="text"
                  placeholder="Search products, spices, recipes..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            <nav className="flex flex-col space-y-3 px-4">
              <Link 
                to="/" 
                className="text-gray-800 hover:text-amber-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-800 hover:text-amber-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="text-gray-800 hover:text-amber-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-800 hover:text-amber-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-gray-800 hover:text-amber-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="text-gray-800 hover:text-amber-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-800 hover:text-amber-600 font-medium flex items-center"
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-gray-800 hover:text-amber-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-gray-800 font-medium flex items-center">
                    <span className="mr-1">🇺🇸</span> EN <ChevronDown size={16} className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-800 font-medium flex items-center">
                    INR <ChevronDown size={16} className="ml-1" />
                  </span>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
