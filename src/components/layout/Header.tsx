
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, ShoppingCart, User, Heart, Package, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import CurrencySelector from './CurrencySelector';
import LanguageSelector from './LanguageSelector';
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleLogout = async () => {
    // This is a placeholder - the actual logout will be imported from useAuth
    console.log("Logout");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Bulk Orders", href: "/products?filter=bulk_available", icon: <Package className="h-4 w-4 mr-2" /> },
    { name: "Gift Boxes", href: "/gift-boxes", icon: <Gift className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-gray-600 hidden sm:block">
            Free shipping on orders over ₹999
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector 
              value="EN"
              onValueChange={(value) => console.log('Language changed to', value)}
            />
            <CurrencySelector 
              value="INR"
              onValueChange={(value) => console.log('Currency changed to', value)}
            />
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="py-6">
                  <Link to="/" className="text-2xl font-bold text-gray-800">
                    DryFruits
                  </Link>
                </div>
                
                <nav className="flex flex-col space-y-4 mb-8">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `px-2 py-2 text-gray-700 ${
                          isActive ? "text-amber-700 font-medium" : "hover:text-amber-600"
                        } flex items-center`
                      }
                    >
                      {item.icon && item.icon}
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
                
                <div className="mt-auto space-y-4 py-6 border-t border-gray-200">
                  {user ? (
                    <>
                      <div className="px-2 py-2 text-gray-700">
                        Signed in as: <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="space-y-2">
                        <NavLink
                          to="/profile"
                          className={({ isActive }) =>
                            `px-2 py-2 text-gray-700 ${
                              isActive ? "text-amber-700 font-medium" : "hover:text-amber-600"
                            } block`
                          }
                        >
                          My Profile
                        </NavLink>
                        {isAdmin && (
                          <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                              `px-2 py-2 text-gray-700 ${
                                isActive ? "text-amber-700 font-medium" : "hover:text-amber-600"
                              } block`
                            }
                          >
                            Admin Dashboard
                          </NavLink>
                        )}
                        <button
                          onClick={handleLogout}
                          className="px-2 py-2 text-gray-700 hover:text-amber-600 block w-full text-left"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <NavLink
                        to="/login"
                        className="px-2 py-2 text-gray-700 hover:text-amber-600 block"
                      >
                        Sign In
                      </NavLink>
                      <NavLink
                        to="/register"
                        className="px-2 py-2 text-gray-700 hover:text-amber-600 block"
                      >
                        Create Account
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            DryFruits
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.slice(0, 4).map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `text-gray-700 ${
                    isActive ? "text-amber-700 font-medium" : "hover:text-amber-600"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {!isMobile && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `p-2 text-gray-700 ${
                      isActive ? "text-amber-700" : "hover:text-amber-600"
                    } transition-colors relative`
                  }
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </NavLink>
                
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `p-2 text-gray-700 ${
                      isActive ? "text-amber-700" : "hover:text-amber-600"
                    } transition-colors`
                  }
                  aria-label="Profile"
                >
                  <User className="h-5 w-5" />
                </NavLink>
              </>
            )}
            
            {isMobile && (
              <>
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `p-2 text-gray-700 ${
                      isActive ? "text-amber-700" : "hover:text-amber-600"
                    } transition-colors relative`
                  }
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="container mx-auto px-4 py-4 border-t border-gray-200">
          <form onSubmit={handleSearch} className="flex justify-between items-center gap-2">
            <Input
              type="search"
              placeholder="Search for products..."
              className="flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
      
      {/* Main Navigation - Mobile only */}
      {isMobile && (
        <div className="container mx-auto px-4 pb-3 flex justify-between overflow-x-auto hide-scrollbar">
          <NavLink
            to="/products?filter=bulk_available"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-3 ${
                isActive ? "text-amber-700 font-medium" : "text-gray-700"
              }`
            }
          >
            <Package className="h-5 w-5 mb-1" />
            <span>Bulk</span>
          </NavLink>
          
          <NavLink
            to="/gift-boxes"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs px-3 ${
                isActive ? "text-amber-700 font-medium" : "text-gray-700"
              }`
            }
          >
            <Gift className="h-5 w-5 mb-1" />
            <span>Gifts</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Header;
