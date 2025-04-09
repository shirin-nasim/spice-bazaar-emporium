import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCartCount } from '@/hooks/use-cart-count';
import { useIsAdmin } from '@/hooks/use-is-admin';
import { SearchBar } from '@/components/shared/SearchBar';
import { LanguageSelector } from '@/components/shared/LanguageSelector';
import { CurrencySelector } from '@/components/shared/CurrencySelector';
import { Button } from "@/components/ui/button"
import {
  Menu,
  ShoppingCart,
  User,
  PackageOpen,
  Heart,
  Settings,
  LogOut
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Header = () => {
  const { user, signOut } = useAuth();
  const cartCount = useCartCount();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await useIsAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">Spice Bazaar</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
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
          
          <div className="flex items-center space-x-4">
            <SearchBar />
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Currency Selector */}
            <CurrencySelector />
            
            {/* Cart */}
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-amber-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-amber-100 text-amber-800">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">
                        <PackageOpen className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-4">
                  <SheetTitle className="text-amber-600">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="text-lg" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-lg" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </Link>
                  <Link 
                    to="/gift-boxes" 
                    className="text-lg" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Gift Boxes
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {user && isAdmin && (
                    <Link 
                      to="/admin" 
                      className="text-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
