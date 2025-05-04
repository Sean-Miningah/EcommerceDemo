import { useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCart } from "@/hooks/api/useCart"
import { useAuth } from "@/hooks/api/useAuth";
import { useOrders } from "@/hooks/api/useOrder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { CartItemData } from "@/types/api";

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { checkout } = useOrders();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States",
    paymentMethod: "credit-card",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await checkout();

      if (success) {
        toast.success("Order placed successfully!", {
          description: "You will receive a confirmation email shortly.",
        });

        // Clear the cart
        await clearCart();

        navigate("/order-confirmation");
      } else {
        throw new Error("Checkout failed");
      }
    } catch (error) {
      toast.error("Failed to place order", {
        description: "Please try again or contact customer support.",
      });
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const subtotal = parseInt(cartTotal) || cartItems.reduce((sum: number, item: CartItemData) => {
    return sum + item.total_price;
  }, 0);

  const shipping = 5.99;
  const total = subtotal + shipping;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Payment Method</h2>

                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handleRadioChange}
                >
                  <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
                      Credit Card
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md mb-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-grow cursor-pointer">
                      PayPal
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 border p-4 rounded-md">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer" className="flex-grow cursor-pointer">
                      Bank Transfer
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item: CartItemData) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product_detail.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ${item.product_detail.price}
                        </p>
                      </div>
                      <p className="font-medium">${item.total_price}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${typeof subtotal === 'string' ? subtotal : subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${typeof total === 'string' ? total : total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export default CheckoutPage;