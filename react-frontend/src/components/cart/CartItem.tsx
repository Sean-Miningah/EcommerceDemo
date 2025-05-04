import { useState } from "react";
import { Link } from "react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/api/useCart";
import { CartItemData } from "@/types/api";

interface CartItemProps {
  item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
  const { updateCartItem, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const { product_detail, quantity, id } = item;
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      const success = await updateCartItem(parseInt(id), newQuantity);
      if (!success) {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      const success = await removeFromCart(parseInt(id));
      if (!success) {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Use total_price from the API response or calculate it
  const totalPrice = item.total_price || (product_detail.price * quantity);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b gap-4">
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <Link to={`/products/${product_detail.id}`}>
          {product_detail.image ? (
            <img
              src={product_detail.image}
              alt={product_detail.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </Link>
      </div>

      <div className="flex-grow">
        <Link to={`/products/${product_detail.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-medium mb-1">{product_detail.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{product_detail.category_name}</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border rounded">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center">
              {isUpdating ? <span className="text-xs">...</span> : quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <span className="font-medium">
            ${typeof totalPrice === 'string' ? totalPrice : totalPrice.toFixed(2)}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-gray-500 hover:text-destructive"
            onClick={handleRemove}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}