import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/api/useCart";
import { useAuth } from "@/hooks/api/useAuth";
import { useOrders } from "@/hooks/api/useOrder";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CartItemData } from "@/types/api";

export function CartSummary() {
  const { cartItems, cartTotal, totalItems, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { checkout } = useOrders();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);


  const subtotal = parseInt(cartTotal) || cartItems.reduce((sum: number, item: CartItemData) => {
    return sum + item.total_price;
  }, 0);

  const shipping = totalItems > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to checkout", {
        description: "You need to be signed in to complete your purchase.",
        action: {
          label: "Sign in",
          onClick: () => navigate("/login?redirect=checkout"),
        },
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const success = await checkout();
      if (success) {
        toast.success("Order placed successfully!");
        navigate(`/orders`);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      toast.error("Failed to create order", {
        description: "Please try again or contact customer support.",
      });
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      const success = await clearCart();
      if (success) {
        toast.success("Cart cleared successfully");
      } else {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${typeof subtotal === 'string' ? subtotal : subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          {shipping > 0 ? (
            <span>${shipping.toFixed(2)}</span>
          ) : (
            <span className="text-gray-500">Calculated at checkout</span>
          )}
        </div>

        <div className="border-t pt-3 mt-3 flex justify-between font-medium">
          <span>Total</span>
          <span>${typeof total === 'string' ? total : total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={totalItems === 0 || isCheckingOut}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleClearCart}
          disabled={totalItems === 0 || isClearing}
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Clearing...
            </>
          ) : (
            "Clear Cart"
          )}
        </Button>

        <Link to="/products" className="block text-center text-sm text-primary hover:underline mt-4">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}