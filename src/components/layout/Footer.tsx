
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-amber-900 text-amber-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Global Spice & Nut Bazaar</h3>
            <p className="text-amber-200 mb-4">
              Premium spices, dry fruits, and gift boxes from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-amber-50 hover:text-amber-200">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-amber-50 hover:text-amber-200">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-amber-50 hover:text-amber-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/dry-fruits" className="text-amber-200 hover:text-white">
                  Dry Fruits
                </Link>
              </li>
              <li>
                <Link to="/category/spices" className="text-amber-200 hover:text-white">
                  Spices
                </Link>
              </li>
              <li>
                <Link to="/category/gift-boxes" className="text-amber-200 hover:text-white">
                  Gift Boxes
                </Link>
              </li>
              <li>
                <Link to="/bulk-orders" className="text-amber-200 hover:text-white">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-amber-200 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-amber-200 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-amber-200 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-amber-200 hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-amber-200 mb-2">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <form className="mt-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-amber-800 border border-amber-700 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-amber-300"
                />
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 rounded-r"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-amber-300 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Global Spice & Nut Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
