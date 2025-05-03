import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { OrderProvider } from '@/contexts/OrderContext';

// Pages
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/products",
    element: <ProductsPage />
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />
  },
  {
    path: "/cart",
    element: <CartPage />
  },
  {
    path: "/checkout",
    element: <CheckoutPage />
  },
  {
    path: "/order-confirmation",
    element: <OrderConfirmationPage />
  },
  {
    path: "/orders",
    element: <OrdersPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "/admin",
    element: <AdminPage />
  },
  {
    path: "*",
    element: <NotFound />
  }
])

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <TooltipProvider>
                <Toaster />
                <RouterProvider router={router} />
              </TooltipProvider>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
