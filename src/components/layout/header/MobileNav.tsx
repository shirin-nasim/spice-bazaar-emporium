
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavProps {
  isAdmin: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className="text-lg" 
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link 
            to="/gift-boxes" 
            className="text-lg" 
            onClick={() => setIsOpen(false)}
          >
            Gift Boxes
          </Link>
          <Link 
            to="/about" 
            className="text-lg"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-lg"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-lg"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
