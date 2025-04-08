
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { Gift, Users, Package, Calendar, Clock, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bulkOrderSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  companyName: z.string().min(2, "Company name is required"),
  productType: z.string().min(1, "Please select a product type"),
  quantity: z.string().min(1, "Please provide estimated quantity"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  details: z.string().optional(),
});

const giftSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  giftType: z.string().min(1, "Please select a gift type"),
  budget: z.string().min(1, "Budget range is required"),
  occasion: z.string().min(1, "Please select an occasion"),
  message: z.string().optional(),
  recipients: z.string().min(1, "Please provide number of recipients"),
});

const SpecialServicesPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bulk");
  
  const bulkOrderForm = useForm<z.infer<typeof bulkOrderSchema>>({
    resolver: zodResolver(bulkOrderSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      productType: "",
      quantity: "",
      deliveryDate: "",
      details: "",
    },
  });
  
  const giftForm = useForm<z.infer<typeof giftSchema>>({
    resolver: zodResolver(giftSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      giftType: "",
      budget: "",
      occasion: "",
      message: "",
      recipients: "",
    },
  });
  
  const onBulkOrderSubmit = (data: z.infer<typeof bulkOrderSchema>) => {
    console.log("Bulk order inquiry submitted:", data);
    toast({
      title: "Inquiry Submitted",
      description: "We'll contact you shortly to discuss your bulk order requirements.",
    });
    bulkOrderForm.reset();
  };
  
  const onGiftSubmit = (data: z.infer<typeof giftSchema>) => {
    console.log("Gift inquiry submitted:", data);
    toast({
      title: "Gift Inquiry Received",
      description: "Our gift specialists will be in touch with personalized recommendations.",
    });
    giftForm.reset();
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Special Services</h1>
            <p className="text-xl text-gray-600">
              Customized solutions for business needs and special occasions
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="bulk" className="py-3 text-base">
                <Users className="mr-2 h-5 w-5" />
                Bulk Orders
              </TabsTrigger>
              <TabsTrigger value="gift" className="py-3 text-base">
                <Gift className="mr-2 h-5 w-5" />
                Gift Services
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bulk" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Order Service</h2>
                  <p className="text-gray-600 mb-6">
                    We offer special pricing for bulk orders perfect for businesses, events, and organizations. Get in touch with our team for customized solutions.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Competitive Pricing</h3>
                        <p className="text-gray-600">Volume discounts that scale with order size</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Custom Packaging</h3>
                        <p className="text-gray-600">Branded packaging options available</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Flexible Delivery</h3>
                        <p className="text-gray-600">Schedule deliveries according to your needs</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Request a Quote</h3>
                  <Form {...bulkOrderForm}>
                    <form onSubmit={bulkOrderForm.handleSubmit(onBulkOrderSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={bulkOrderForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bulkOrderForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={bulkOrderForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bulkOrderForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={bulkOrderForm.control}
                        name="productType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select product type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dry_fruits">Dry Fruits & Nuts</SelectItem>
                                <SelectItem value="spices">Spices</SelectItem>
                                <SelectItem value="superfoods">Superfoods</SelectItem>
                                <SelectItem value="gift_hampers">Gift Hampers</SelectItem>
                                <SelectItem value="mixed">Mixed Products</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={bulkOrderForm.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Quantity</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 100 units, 50kg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bulkOrderForm.control}
                          name="deliveryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Desired Delivery Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/DD/YYYY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={bulkOrderForm.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Details</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific requirements or questions" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                        Submit Inquiry
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4">Popular Bulk Order Options</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Corporate Gifting</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Premium gift hampers for employees or clients with custom branding options.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link to="/products?filter=gift_suitable">
                        <Button variant="outline" size="sm">Explore</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Event Supplies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Large quantities of nuts, dry fruits, and snacks for events and conferences.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link to="/products?filter=bulk_available">
                        <Button variant="outline" size="sm">Explore</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Restaurant Supply</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Premium quality ingredients for restaurants and catering services.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Link to="/products?category=spices">
                        <Button variant="outline" size="sm">Explore</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gift" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Gift Services</h2>
                  <p className="text-gray-600 mb-6">
                    Make every occasion special with our curated gift options. From individual gifts to corporate hampers, we provide personalized gifting solutions.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Premium Packaging</h3>
                        <p className="text-gray-600">Elegant gift boxes and presentation options</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Personalization</h3>
                        <p className="text-gray-600">Custom messages and gift cards included</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Direct Shipping</h3>
                        <p className="text-gray-600">Send gifts directly to recipients</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">Gift Inquiry</h3>
                  <Form {...giftForm}>
                    <form onSubmit={giftForm.handleSubmit(onGiftSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={giftForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={giftForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={giftForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={giftForm.control}
                          name="giftType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gift Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gift type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="individual">Individual Gift</SelectItem>
                                  <SelectItem value="corporate">Corporate Gifting</SelectItem>
                                  <SelectItem value="festive">Festive Hampers</SelectItem>
                                  <SelectItem value="wedding">Wedding Favors</SelectItem>
                                  <SelectItem value="custom">Custom Arrangement</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={giftForm.control}
                          name="occasion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Occasion</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select occasion" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="birthday">Birthday</SelectItem>
                                  <SelectItem value="anniversary">Anniversary</SelectItem>
                                  <SelectItem value="wedding">Wedding</SelectItem>
                                  <SelectItem value="diwali">Diwali</SelectItem>
                                  <SelectItem value="christmas">Christmas</SelectItem>
                                  <SelectItem value="corporate">Corporate Event</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={giftForm.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget Range</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select budget range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="under_500">Under ₹500</SelectItem>
                                  <SelectItem value="500_1000">₹500 - ₹1,000</SelectItem>
                                  <SelectItem value="1000_2000">₹1,000 - ₹2,000</SelectItem>
                                  <SelectItem value="2000_5000">₹2,000 - ₹5,000</SelectItem>
                                  <SelectItem value="above_5000">Above ₹5,000</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={giftForm.control}
                          name="recipients"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Recipients</FormLabel>
                              <FormControl>
                                <Input placeholder="How many gifts needed?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={giftForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific preferences or requirements for your gifts" 
                                className="resize-none h-24"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                        Submit Gift Inquiry
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-0">
                  <CardHeader className="pb-2">
                    <Package className="h-10 w-10 text-amber-600 mb-2" />
                    <CardTitle>Featured Gift Boxes</CardTitle>
                    <CardDescription>
                      Premium curated gift boxes for all occasions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Festive Gift Hampers
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Dry Fruit Assortments
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Premium Spice Collections
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                      <Link to="/products?filter=gift_suitable" className="flex items-center justify-center w-full">
                        Explore Gifts
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                  <CardHeader className="pb-2">
                    <Users className="h-10 w-10 text-blue-600 mb-2" />
                    <CardTitle>Corporate Gifting</CardTitle>
                    <CardDescription>
                      Impress clients and reward employees
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Customized Packaging
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Bulk Discounts Available
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Logo Branding Options
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link to="#" className="flex items-center justify-center w-full" onClick={() => setActiveTab("bulk")}>
                        Corporate Solutions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                  <CardHeader className="pb-2">
                    <Calendar className="h-10 w-10 text-purple-600 mb-2" />
                    <CardTitle>Festive Specials</CardTitle>
                    <CardDescription>
                      Celebrate occasions with themed gifts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Diwali & Christmas Hampers
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Wedding & Anniversary Gifts
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Festival-Themed Packaging
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link to="/products?category=gifting" className="flex items-center justify-center w-full">
                        Browse Collections
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SpecialServicesPage;
