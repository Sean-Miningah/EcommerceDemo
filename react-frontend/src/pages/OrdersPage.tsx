
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuthContext } from "@/contexts/AuthContext";
import { Order } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrdersPage = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from an API
        // For MVP, we'll create mock orders
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockOrders: Order[] = [
          {
            id: "ORD-123456",
            userId: "1",
            items: [
              {
                productId: "1",
                name: "Modern Desk Lamp",
                quantity: 1,
                price: 49.99,
              },
              {
                productId: "3",
                name: "Wireless Earbuds",
                quantity: 2,
                price: 129.99,
              },
            ],
            total: 309.97,
            status: "delivered",
            createdAt: "2023-10-15T10:30:00Z",
          },
          {
            id: "ORD-654321",
            userId: "1",
            items: [
              {
                productId: "2",
                name: "Ergonomic Office Chair",
                quantity: 1,
                price: 199.99,
              },
            ],
            total: 199.99,
            status: "shipped",
            createdAt: "2023-11-02T14:45:00Z",
          },
          {
            id: "ORD-789012",
            userId: "1",
            items: [
              {
                productId: "5",
                name: "Minimalist Watch",
                quantity: 1,
                price: 149.99,
              },
              {
                productId: "9",
                name: "Leather Notebook",
                quantity: 2,
                price: 24.99,
              },
            ],
            total: 199.97,
            status: "processing",
            createdAt: "2023-11-10T09:15:00Z",
          },
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Get status badge variant
  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "default";
      case "shipped":
        return "secondary";
      case "processing":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Orders</h1>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <Skeleton className="h-6 w-32 mb-2 sm:mb-0" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="border-t pt-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-medium mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to create your first order.
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-lg mr-3">Order #{order.id}</h3>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-500 text-sm">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-3">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order.id}-item-${index}`}
                          className="flex justify-between text-sm"
                        >
                          <span>{item.quantity} × {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-6">
              {orders
                .filter(order => order.status === "processing")
                .map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Same content as above, but filtered */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-lg mr-3">Order #{order.id}</h3>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={`${order.id}-item-${index}`}
                            className="flex justify-between text-sm"
                          >
                            <span>{item.quantity} × {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4 mt-4 flex justify-end">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/orders/${order.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </TabsContent>

            {/* Similar TabsContent for other statuses */}
          </Tabs>
        )}
      </div>
    </PageLayout>
  );
};

export default OrdersPage;
