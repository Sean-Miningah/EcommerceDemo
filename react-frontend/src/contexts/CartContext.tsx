import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/ui/use-toast";
import { useAuthContext } from "./AuthContext";
import { useCart as useCartHook } from "@/hooks/api/useCart";
import { ProductData } from "@/types/api";

type CartItem = {
  id: string;
  product: ProductData;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: ProductData, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();
  const { toast } = useToast();
  const {
    items: cartItems,
    addItem: apiAddItem,
    removeItem: apiRemoveItem,
    updateQuantity: apiUpdateQuantity,
    clearCart: apiClearCart,
    itemCount,
    subtotal,
    isLoading: cartLoading,
    error: cartError,
    refetch
  } = useCartHook();

  // Set local items state from API hook
  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  // Set loading and error states
  useEffect(() => {
    setIsLoading(cartLoading);
  }, [cartLoading]);

  useEffect(() => {
    setError(cartError);
  }, [cartError]);

  // Fetch cart data when user changes
  useEffect(() => {
    if (user) {
      refetch();
    } else {
      // For non-authenticated users, load from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
          localStorage.removeItem("cart");
        }
      }
    }
  }, [user, refetch]);

  // Save cart to localStorage for non-authenticated users
  useEffect(() => {
    if (!user && items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, user]);

  // Add item to cart
  const addItem = async (product: ProductData, quantity = 1) => {
    setIsLoading(true);

    try {
      if (user) {
        console.log("User found when adding cart", user)
        await apiAddItem(product, quantity);
      } else {
        // Use localStorage for non-authenticated users
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Update quantity if item already exists
            return prevItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            // Add new item if it doesn't exist yet
            return [...prevItems, {
              id: `local-${product.id}`,
              product,
              quantity
            }];
          }
        });
      }

      toast({
        title: "Product added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    } catch (err) {
      setError("Failed to add item to cart");
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    setIsLoading(true);

    try {
      if (user) {
        // Use the API for authenticated users
        await apiRemoveItem(productId);
      } else {
        // Use localStorage for non-authenticated users
        setItems((prevItems) => {
          const itemToRemove = prevItems.find(
            (item) => item.product.id === productId
          );

          if (itemToRemove) {
            toast({
              title: "Product removed from cart",
              description: `${itemToRemove.product.name} removed from your cart`,
            });
          }

          return prevItems.filter((item) => item.product.id !== productId);
        });
      }
    } catch (err) {
      setError("Failed to remove item from cart");
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(productId);
    }

    setIsLoading(true);

    try {
      if (user) {
        // Use the API for authenticated users
        await apiUpdateQuantity(productId, quantity);
      } else {
        // Use localStorage for non-authenticated users
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (err) {
      setError("Failed to update cart");
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true);

    try {
      if (user) {
        // Use the API for authenticated users
        await apiClearCart();
      } else {
        // Use localStorage for non-authenticated users
        setItems([]);
      }

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (err) {
      setError("Failed to clear cart");
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: user ? itemCount : items.reduce((count, item) => count + item.quantity, 0),
    subtotal: user ? subtotal : items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    isLoading,
    error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};