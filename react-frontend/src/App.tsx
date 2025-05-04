import {
  createBrowserRouter,
  RouterProvider, Outlet
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { RouteGuard } from '@/components/layout/RouteGuard'

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


export const AuthLayoutWrapper = () => {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
};

const router = createBrowserRouter([
  {
    element: <AuthLayoutWrapper />,
    children: [
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
        element: (
          <RouteGuard>
            <CheckoutPage />
          </RouteGuard>
        )
      },
      {
        path: "/order-confirmation",
        element: (
          <RouteGuard>
            <OrderConfirmationPage />
          </RouteGuard>
        )
      },
      {
        path: "/orders",
        element: (
          <RouteGuard>
            <OrdersPage />
          </RouteGuard>
        )
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
        element: (
          <RouteGuard adminOnly={true}>
            <AdminPage />
          </RouteGuard>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={router} />
        </TooltipProvider>
      </ReduxProvider>
    </QueryClientProvider>
  )
}

export default App
