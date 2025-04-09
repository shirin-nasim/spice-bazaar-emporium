
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/use-admin-check';
import { SearchBar } from '@/components/shared/SearchBar';
import UserMenu from './header/UserMenu';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';
import CartButton from './header/CartButton';
import { LanguageSelector } from '@/components/shared/LanguageSelector';
import { CurrencySelector } from '@/components/shared/CurrencySelector';

const Header = () => {
  const { isAdmin } = useAdminCheck();

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
          <DesktopNav />
          
          <div className="flex items-center space-x-4">
            <SearchBar />
            
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Currency Selector */}
            <CurrencySelector />
            
            {/* Cart */}
            <CartButton />
            
            {/* User Menu */}
            <UserMenu isAdmin={isAdmin} />
            
            {/* Mobile Menu Button */}
            <MobileNav isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
