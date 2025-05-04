import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
// import { useAuth } from "@/hooks/api/useAuth";
import { useOrders } from "@/hooks/api/useOrder";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OrderData } from "@/types/api";

const OrdersPage = () => {
  // const { user } = useAuth();
  const { orders, loading, error, getOrders } = useOrders();

  useEffect(() => {
    getOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getStatusBadgeVariant = (status: string) => {
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

  if (loading) {
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

  // Display error if there is one
  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Orders</h1>
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
            <div className="mt-4">
              <Button onClick={() => getOrders()}>Try Again</Button>
            </div>
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
            {/* <TabsList className="mb-8">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList> */}

            <TabsContent value="all" className="space-y-6">
              {orders.map((order: OrderData) => (
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
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span className="font-bold text-lg">${order.total_amount}</span>
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
                          <span>{item.quantity} × {item.product_detail.name}</span>
                          <span>${item.total_price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className="border-t pt-4 mt-4 flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div> */}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-6">
              {orders
                .filter((order: OrderData) => order.status === "processing")
                .map((order: OrderData) => (
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
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="font-bold text-lg">${order.total_amount}</span>
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
                            <span>{item.quantity} × {item.product_detail.name}</span>
                            <span>${item.total_price}</span>
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

            {/* Similar TabsContent for shipped status */}
            <TabsContent value="shipped" className="space-y-6">
              {orders
                .filter((order: OrderData) => order.status === "shipped")
                .map((order:OrderData) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Same content structure as above */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-lg mr-3">Order #{order.id}</h3>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="font-bold text-lg">${order.total_amount}</span>
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
                            <span>{item.quantity} × {item.product_detail.name}</span>
                            <span>${item.total_price}</span>
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

            {/* TabsContent for delivered status */}
            <TabsContent value="delivered" className="space-y-6">
              {orders
                .filter((order: OrderData) => order.status === "delivered")
                .map((order: OrderData) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                    {/* Same content structure as above */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-lg mr-3">Order #{order.id}</h3>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-gray-500 text-sm">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <span className="font-bold text-lg">${order.total_amount}</span>
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
                            <span>{item.quantity} × {item.product_detail.name}</span>
                            <span>${item.total_price}</span>
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
          </Tabs>
        )}
      </div>
    </PageLayout>
  );
};

export default OrdersPage;