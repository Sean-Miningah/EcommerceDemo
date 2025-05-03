import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useOrder } from "@/contexts/OrderContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function CartSummary() {
  const { subtotal, itemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuthContext();
  const { createOrder } = useOrder();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Calculate derived values
  const shipping = itemCount > 0 ? 5.99 : 0;
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
      const order = await createOrder();
      toast.success("Order placed successfully!");
      navigate(`/orders/${order.id}`);
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
      await clearCart();
      toast.success("Cart cleared successfully");
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
          <span>${subtotal.toFixed(2)}</span>
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
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          className="w-full"
          onClick={handleCheckout}
          disabled={itemCount === 0 || isCheckingOut}
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
          disabled={itemCount === 0 || isClearing}
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