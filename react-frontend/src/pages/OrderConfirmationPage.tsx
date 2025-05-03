
import { Link } from "react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const OrderConfirmationPage = () => {
  // Generate random order ID
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We've received your order and will process it as soon as possible.
          </p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order Number:</span>
                <span>{orderId}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>johndoe@example.com</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>Credit Card</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default">
              <Link to="/orders">View Order</Link>
            </Button>

            <Button asChild variant="outline">
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderConfirmationPage;
