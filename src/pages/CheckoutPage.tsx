
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, Truck, Lock } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State must be at least 2 characters."),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters."),
  paymentMethod: z.enum(["credit", "paypal", "apple"]),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "credit",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    
    if (step === "shipping") {
      setStep("payment");
      window.scrollTo(0, 0);
    } else if (step === "payment") {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep("confirmation");
        window.scrollTo(0, 0);
      }, 1500);
    } else {
      // Handle order completion
      toast({
        title: "Order Completed",
        description: "Your order has been successfully placed!",
      });
      navigate("/");
    }
  };

  const orderSummary = [
    { name: "Premium Cashews", quantity: 2, price: 12.99 },
    { name: "Organic Almonds", quantity: 1, price: 9.99 },
  ];

  const calculateSubtotal = () => {
    return orderSummary.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center max-w-2xl w-full">
            <div className={`flex flex-col items-center flex-1 ${step === 'shipping' ? 'text-amber-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-amber-100 text-amber-600 border-2 border-amber-600' : 'bg-green-600 text-white'}`}>
                {step === 'shipping' ? "1" : <Check size={16} />}
              </div>
              <p className="mt-2 text-sm font-medium">Shipping</p>
            </div>
            
            <div className={`flex-1 h-0.5 ${step === 'shipping' ? 'bg-gray-200' : 'bg-green-600'}`} />
            
            <div className={`flex flex-col items-center flex-1 ${step === 'payment' ? 'text-amber-600' : step === 'confirmation' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step === 'payment' ? 'bg-amber-100 text-amber-600 border-2 border-amber-600' : 
                  step === 'confirmation' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                {step === 'confirmation' ? <Check size={16} /> : "2"}
              </div>
              <p className="mt-2 text-sm font-medium">Payment</p>
            </div>
            
            <div className={`flex-1 h-0.5 ${step === 'confirmation' ? 'bg-green-600' : 'bg-gray-200'}`} />
            
            <div className={`flex flex-col items-center flex-1 ${step === 'confirmation' ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step === 'confirmation' ? 'bg-amber-100 text-amber-600 border-2 border-amber-600' : 'bg-gray-200'}`}>
                3
              </div>
              <p className="mt-2 text-sm font-medium">Confirmation</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Enter your shipping details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="example@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Special delivery instructions or notes"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        Continue to Payment
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Choose how you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-2"
                              >
                                <div className="flex items-center space-x-2 border rounded-md p-4">
                                  <RadioGroupItem value="credit" id="credit" />
                                  <label htmlFor="credit" className="flex-grow cursor-pointer">
                                    <div className="font-medium">Credit / Debit Card</div>
                                    <div className="text-sm text-gray-500">Pay with Visa, Mastercard, or American Express</div>
                                  </label>
                                  <div className="flex space-x-2">
                                    <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                    <div className="w-8 h-5 bg-red-500 rounded"></div>
                                    <div className="w-8 h-5 bg-gray-800 rounded"></div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 border rounded-md p-4">
                                  <RadioGroupItem value="paypal" id="paypal" />
                                  <label htmlFor="paypal" className="flex-grow cursor-pointer">
                                    <div className="font-medium">PayPal</div>
                                    <div className="text-sm text-gray-500">Pay with your PayPal account</div>
                                  </label>
                                  <div className="w-12 h-5 bg-blue-700 rounded"></div>
                                </div>
                                
                                <div className="flex items-center space-x-2 border rounded-md p-4">
                                  <RadioGroupItem value="apple" id="apple" />
                                  <label htmlFor="apple" className="flex-grow cursor-pointer">
                                    <div className="font-medium">Apple Pay</div>
                                    <div className="text-sm text-gray-500">Pay with Apple Pay</div>
                                  </label>
                                  <div className="w-8 h-5 bg-black rounded"></div>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("paymentMethod") === "credit" && (
                        <div className="space-y-4 border-t pt-4">
                          <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name on Card</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="**** **** **** ****" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="expiryDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input placeholder="MM/YY" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="cvv"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CVV</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
                        <Lock size={16} />
                        <span>Your payment information is secure and encrypted</span>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        disabled={isProcessing}
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {step === 'confirmation' && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                  <CardDescription>
                    Your order has been placed successfully. An email confirmation has been sent to your email address.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">
                        {form.getValues("paymentMethod") === "credit" ? "Credit Card" : 
                         form.getValues("paymentMethod") === "paypal" ? "PayPal" : "Apple Pay"}
                      </span>
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <div className="text-sm">
                      <p className="font-medium">{form.getValues("firstName")} {form.getValues("lastName")}</p>
                      <p>{form.getValues("address")}</p>
                      <p>{form.getValues("city")}, {form.getValues("state")} {form.getValues("zipCode")}</p>
                      <p>{form.getValues("email")}</p>
                      <p>{form.getValues("phone")}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Return to Home
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderSummary.map((item, index) => (
                  <div key={index} className="flex justify-between pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
