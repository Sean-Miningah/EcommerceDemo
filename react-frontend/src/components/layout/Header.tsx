import { useState } from "react";
import { Link } from "react-router";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { logout } from '@/store/slices/authSlice';
import { useAuth } from '@/hooks/api/useAuth';
import { useCart } from '@/hooks/api/useCart';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { user, isAuthenticated, logout: handleLogout } = useAuth();
  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">ShopMVP</span>
          </Link>

          <nav className="hidden md:flex ml-6 space-x-4">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm"
            />
          </div>

          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 badge badge-primary">{itemCount}</span>
              )}
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="font-medium">
                  {user?.username}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="default">Sign In</Button>
            </Link>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <Link
                  to="/"
                  className="text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-lg font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full h-9 rounded-md border border-input bg-background pl-8 pr-3 text-sm"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}