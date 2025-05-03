import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useProducts } from "@/contexts/ProductContext";
import { useAdminPanel } from "@/hooks/api/useAdminPanel";
import { ProductData, OrderData } from "@/types/api";
import { ProductForm } from "@/components/admin/ProductForm";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPage = () => {
  const { user } = useAuthContext();
  const { products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Get admin functions from our hook
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    isLoading: adminActionLoading,
    error: adminActionError
  } = useAdminPanel();

  // If user is not admin, redirect to home
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Fetch all orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        setOrdersError(null);
      } catch (err: any) {
        setOrdersError(err.message || 'Failed to fetch orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [getAllOrders]);

  // Handle product operations
  const handleAddProduct = async (productData: Omit<ProductData, 'id' | 'created_at'>) => {
    try {
      await createProduct(productData);
      setIsAddDialogOpen(false);
      refetchProducts();
      toast.success("Product added successfully");
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  const handleUpdateProduct = async (productData: Partial<ProductData>) => {
    if (!selectedProduct) return;

    try {
      await updateProduct(selectedProduct.id, productData);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      refetchProducts();
      toast.success("Product updated successfully");
    } catch (err) {
      toast.error("Failed to update product");
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      refetchProducts();
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderData['status']) => {
    try {
      await updateOrderStatus(orderId, status);

      // Update orders state after status change
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));

      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update order status");
      console.error(err);
    }
  };

  // Mock user data (for the Users tab)
  const users = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      registered: "2023-01-15"
    },
    {
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      registered: "2023-03-22"
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      registered: "2023-05-10"
    }
  ];

  // Render loading states for products tab
  const renderProductsLoading = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-8" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render error state for products tab
  const renderProductsError = () => (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{productsError}</p>
      <Button onClick={refetchProducts} variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );

  // Render loading states for orders tab
  const renderOrdersLoading = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-12" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead><Skeleton className="h-4 w-16" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Render error state for orders tab
  const renderOrdersError = () => (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">{ordersError}</p>
      <Button onClick={() => getAllOrders()} variant="outline">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {productsLoading ? (
                renderProductsLoading()
              ) : productsError ? (
                renderProductsError()
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Product Management</h2>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm
                          onSubmit={handleAddProduct}
                          isLoading={adminActionLoading}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell className="flex items-center gap-2">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                  No image
                                </div>
                              )}
                              {product.name}
                            </TableCell>
                            <TableCell>{product.category_name}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={(open) => {
                                  setIsEditDialogOpen(open);
                                  if (!open) setSelectedProduct(null);
                                }}>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedProduct(product)}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Edit Product</DialogTitle>
                                    </DialogHeader>
                                    {selectedProduct && (
                                      <ProductForm
                                        product={selectedProduct}
                                        onSubmit={handleUpdateProduct}
                                        isLoading={adminActionLoading}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive">
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure you want to delete this product?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the product
                                        and remove the data from the server.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={() => handleDeleteProduct(product.id)}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {ordersLoading ? (
                renderOrdersLoading()
              ) : ordersError ? (
                renderOrdersError()
              ) : (
                <>
                  <h2 className="text-xl font-medium mb-6">Order Management</h2>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.user}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{order.items.length}</TableCell>
                            <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === 'delivered' ? 'default' :
                                  order.status === 'shipped' ? 'secondary' :
                                  order.status === 'processing' ? 'outline' :
                                  'destructive'
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle>Order Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-3 gap-4">
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Order ID</p>
                                          <p>{order.id}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Date</p>
                                          <p>{new Date(order.created_at).toLocaleString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Status</p>
                                          <div className="flex items-center gap-2">
                                            <select
                                              value={order.status}
                                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderData['status'])}
                                              className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                              disabled={adminActionLoading}
                                            >
                                              <option value="pending">Pending</option>
                                              <option value="processing">Processing</option>
                                              <option value="shipped">Shipped</option>
                                              <option value="delivered">Delivered</option>
                                              <option value="cancelled">Cancelled</option>
                                            </select>
                                            {adminActionLoading && <span className="animate-spin">⏳</span>}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-4">
                                        <h3 className="font-medium mb-2">Order Items</h3>
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Product</TableHead>
                                              <TableHead>Price</TableHead>
                                              <TableHead>Quantity</TableHead>
                                              <TableHead>Total</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {order.items.map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell>
                                                  <div className="flex items-center gap-2">
                                                    {item.product_detail.image && (
                                                      <img
                                                        src={item.product_detail.image}
                                                        alt={item.product_detail.name}
                                                        className="w-8 h-8 object-cover rounded"
                                                      />
                                                    )}
                                                    {item.product_detail.name}
                                                  </div>
                                                </TableCell>
                                                <TableCell>${item.price.toFixed(2)}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>${item.total_price.toFixed(2)}</TableCell>
                                              </TableRow>
                                            ))}
                                            <TableRow>
                                              <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                                              <TableCell className="font-bold">${order.total_amount.toFixed(2)}</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-medium mb-6">User Management</h2>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.registered}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminPage;