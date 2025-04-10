
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '@/services/productData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { ShoppingBag, MapPin, Clock, Share2, Check, Info } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(parseInt(id || '0'));
  const [selectedSize, setSelectedSize] = useState(product?.packSizes[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    // Here you would add the product to cart
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) added to your cart`,
    });
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on our store!`,
        url: window.location.href,
      });
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the share functionality",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
            {product.productImage ? (
              <img 
                src={product.productImage} 
                alt={product.name}
                className="w-full h-full object-contain" 
              />
            ) : (
              <div className="text-gray-400 text-xl">{product.name}</div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500 mr-4">{product.category} / {product.subcategory}</span>
                  {product.isGift && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Gift</span>
                  )}
                </div>
              </div>
              <button 
                onClick={handleShare}
                className="text-gray-500 hover:text-gray-700"
              >
                <Share2 size={20} />
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-6">
                <MapPin size={20} className="text-gray-500 mr-2" />
                <span className="text-sm">{product.origin}</span>
              </div>
              
              <div className="flex items-center">
                <Clock size={20} className="text-gray-500 mr-2" />
                <span className="text-sm">Shelf Life: {product.shelfLife}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-medium mb-2">Description</h2>
              <p className="text-gray-600">
                {product.description || `Premium quality ${product.name} from ${product.origin}, perfect for ${product.useCase.toLowerCase()}.`}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="font-medium mb-2">Pack Size</h2>
              <div className="flex flex-wrap gap-3">
                {product.packSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-sm text-gray-500 mb-1">Price</h2>
                <div className="text-3xl font-bold">₹{product.prices.INR}</div>
                <div className="text-sm text-gray-500">
                  ${product.prices.USD} | £{product.prices.GBP} | AED {product.prices.AED}
                </div>
              </div>

              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <Button 
              onClick={handleAddToCart} 
              className="w-full py-6 text-lg"
            >
              <ShoppingBag className="mr-2" size={20} />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="details" className="flex-1">Product Details</TabsTrigger>
            <TabsTrigger value="shipping" className="flex-1">Shipping Info</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6 border rounded-md">
            <h2 className="text-xl font-medium mb-4">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b pb-2">
                <span className="font-medium">Category:</span> {product.category}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Subcategory:</span> {product.subcategory}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Origin:</span> {product.origin}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Use Case:</span> {product.useCase}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Shelf Life:</span> {product.shelfLife}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Sourcing:</span> {product.sourcing}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">HS Code:</span> {product.hsCode}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Gift Option:</span> {product.isGift ? 'Yes' : 'No'}
              </div>
              <div className="border-b pb-2">
                <span className="font-medium">Bulk Order:</span> {product.isBulk ? 'Available' : 'Not Available'}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="p-6 border rounded-md">
            <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Delivery Options</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Standard Delivery</p>
                    <p className="text-sm text-gray-600">3-5 business days</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Express Delivery</p>
                    <p className="text-sm text-gray-600">1-2 business days</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Important Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Info size={18} className="text-blue-500 mr-2 mt-1" />
                  <p className="text-sm text-gray-600">Free shipping on orders above ₹1000.</p>
                </li>
                <li className="flex items-start">
                  <Info size={18} className="text-blue-500 mr-2 mt-1" />
                  <p className="text-sm text-gray-600">International shipping available for select countries.</p>
                </li>
                <li className="flex items-start">
                  <Info size={18} className="text-blue-500 mr-2 mt-1" />
                  <p className="text-sm text-gray-600">Products are shipped in moisture-proof packaging to maintain freshness.</p>
                </li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="p-6 border rounded-md">
            <h2 className="text-xl font-medium mb-4">Customer Reviews</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No reviews yet for this product.</p>
              <Button variant="outline">Write a Review</Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
