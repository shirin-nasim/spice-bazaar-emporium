import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCartItems } from '@/api/cartApi';
import { SearchBar } from '../search/SearchBar';
import { Button } from '../ui/button';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import { 
  ShoppingCart, 
  User, 
  LogIn, 
  Menu, 
  X, 
  Heart, 
  Package, 
  Gift,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isAdmin = user?.role === 'admin'; // Fallback implementation for isAdmin
  
  useEffect(() => {
    if (user) {
      const loadCartItems = async () => {
        try {
          const items = await getCartItems();
          const itemCount = items.reduce((total, item) => total + item.quantity, 0);
          setCartCount(itemCount);
        } catch (error) {
          console.error('Error loading cart items:', error);
        }
      };
      
      loadCartItems();
    } else {
      setCartCount(0);
    }
  }, [user]);
  
  const handleLogout = async () => {
    try {
      // Use the logout function from context if available, otherwise implement fallback
      if (logout) {
        await logout();
      } else {
        // Fallback implementation (should be replaced with actual implementation)
        console.warn('Logout function not provided in AuthContext');
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      }
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-amber-600">
            DryFruits & Nuts
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-amber-600 transition-colors">
              Products
            </Link>
            <Link to="/gift-boxes" className="text-gray-700 hover:text-amber-600 transition-colors">
              Gift Boxes
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-amber-600 transition-colors">
              Special Services
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-amber-600 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">
              Contact
            </Link>
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {!isMobile && <SearchBar />}
            
            {/* Language & Currency */}
            <div className="hidden lg:flex items-center space-x-2">
              <LanguageSelector value="EN" onValueChange={() => {}} />
              <CurrencySelector value="USD" onValueChange={() => {}} />
            </div>
            
            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="text-gray-700 hover:text-amber-600 transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                >
                  <User size={20} />
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-amber-600 transition-colors"
                  >
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-amber-600 transition-colors md:block hidden"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        {isMobile && (
          <div className="pb-2">
            <SearchBar />
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              <Link 
                to="/gift-boxes" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                <Gift className="inline-block mr-2 h-4 w-4" />
                Gift Boxes
              </Link>
              <Link 
                to="/services" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                <Package className="inline-block mr-2 h-4 w-4" />
                Special Services
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              
              {/* Language & Currency for Mobile */}
              <div className="flex flex-col space-y-4 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Language:</span>
                  <LanguageSelector value="EN" onValueChange={() => {}} />
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Currency:</span>
                  <CurrencySelector value="USD" onValueChange={() => {}} />
                </div>
              </div>
              
              {/* User Actions for Mobile */}
              {user ? (
                <div className="flex flex-col space-y-4 pt-2 border-t border-gray-100">
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    <User className="inline-block mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                  <Link 
                    to="/cart" 
                    className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    <ShoppingCart className="inline-block mr-2 h-4 w-4" />
                    Cart ({cartCount})
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    <Heart className="inline-block mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-amber-600 transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      <LayoutDashboard className="inline-block mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-amber-600 transition-colors py-2 text-left"
                  >
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-100">
                  <Link 
                    to="/login" 
                    className="bg-amber-600 text-white px-4 py-2 rounded inline-block hover:bg-amber-700 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="inline-block mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
