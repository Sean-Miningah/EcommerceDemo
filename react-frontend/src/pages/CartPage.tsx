import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/api/useCart";
import { Link } from "react-router";
import { ShoppingCart, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemData } from "@/types/api";

const CartPage = () => {
  const { cartItems, totalItems, loading, error, getCartItems } = useCart();


  useEffect(() => {
    getCartItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 py-4 border-b">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-gray-50 rounded-lg p-6">
                <Skeleton className="h-6 w-36 mb-4" />
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="pt-3 mt-3 flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-red-500 mb-4">
              <p className="text-xl font-medium mb-2">Error loading your cart</p>
              <p className="text-gray-600 mb-6">{error}</p>
            </div>
            <Button onClick={() => getCartItems()} className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Empty cart state
  if (totalItems === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 max-w-md mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Cart with items
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="divide-y">
                {cartItems.map((item: CartItemData) => (
                  <CartItem
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <CartSummary />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CartPage;