
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getAllOrders, getOrderItems, updateOrderStatus, updatePaymentStatus } from '@/api/orderApi';
import { Order, OrderItem } from '@/types/database.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  RefreshCw, 
  Eye, 
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  CreditCard,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const OrdersTab = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to load orders',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [refreshTrigger, toast]);
  
  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
    setLoadingItems(true);
    
    try {
      const items = await getOrderItems(order.id);
      setOrderItems(items);
    } catch (error) {
      console.error('Error fetching order items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order items',
        variant: 'destructive',
      });
    } finally {
      setLoadingItems(false);
    }
  };
  
  const handleStatusChange = async (orderId: number, status: string) => {
    setUpdatingStatus(true);
    
    try {
      const result = await updateOrderStatus(orderId, status);
      
      if (result) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        );
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
        
        toast({
          title: 'Status Updated',
          description: `Order status changed to ${status}`,
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const handlePaymentStatusChange = async (orderId: number, paymentStatus: string) => {
    setUpdatingPayment(true);
    
    try {
      const result = await updatePaymentStatus(orderId, paymentStatus);
      
      if (result) {
        setOrders(prev => 
          prev.map(order => 
            order.id === orderId ? { ...order, payment_status: paymentStatus } : order
          )
        );
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, payment_status: paymentStatus });
        }
        
        toast({
          title: 'Payment Status Updated',
          description: `Payment status changed to ${paymentStatus}`,
        });
      } else {
        throw new Error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingPayment(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
          <Package className="mr-1 h-3 w-3" /> Processing
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
          <Truck className="mr-1 h-3 w-3" /> Shipped
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Delivered
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <XCircle className="mr-1 h-3 w-3" /> Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
          <DollarSign className="mr-1 h-3 w-3" /> Paid
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <XCircle className="mr-1 h-3 w-3" /> Failed
        </Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
          <CreditCard className="mr-1 h-3 w-3" /> Refunded
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRefreshTrigger(prev => prev + 1)}
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{format(new Date(order.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    {order.shipping_address?.name || 'Guest User'}
                  </TableCell>
                  <TableCell>₹{order.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.payment_status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Order #{selectedOrder?.id}</span>
              {getStatusBadge(selectedOrder?.status || 'pending')}
            </DialogTitle>
            <DialogDescription>
              Placed on {selectedOrder ? format(new Date(selectedOrder.created_at), 'MMMM d, yyyy, h:mm a') : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Order Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Order Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order Status</label>
                    <div className="mt-1 flex items-center">
                      <Select
                        value={selectedOrder?.status || 'pending'}
                        onValueChange={(status) => {
                          if (selectedOrder) handleStatusChange(selectedOrder.id, status);
                        }}
                        disabled={updatingStatus}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <div className="mt-1">
                      <Select
                        value={selectedOrder?.payment_status || 'pending'}
                        onValueChange={(status) => {
                          if (selectedOrder) handlePaymentStatusChange(selectedOrder.id, status);
                        }}
                        disabled={updatingPayment}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-sm mt-1">{selectedOrder?.payment_method || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Customer Information</h3>
                
                {selectedOrder?.shipping_address ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-sm mt-1">{selectedOrder.shipping_address.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm mt-1">{selectedOrder.shipping_address.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-sm mt-1">{selectedOrder.shipping_address.phone}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Shipping Address</label>
                      <p className="text-sm mt-1">
                        {selectedOrder.shipping_address.address1}<br />
                        {selectedOrder.shipping_address.address2 && `${selectedOrder.shipping_address.address2}<br />`}
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}<br />
                        {selectedOrder.shipping_address.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No customer information available</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Order Items */}
          <div className="mt-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            
            {loadingItems ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded self-start"></div>
                  </div>
                ))}
              </div>
            ) : orderItems.length === 0 ? (
              <p className="text-sm text-gray-500">No items in this order</p>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.product_name}</TableCell>
                        <TableCell>{item.pack_size || '-'}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Order Summary */}
            {selectedOrder && (
              <div className="flex justify-end mt-4">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>₹{selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTab;
