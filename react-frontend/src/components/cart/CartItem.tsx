import { useState } from "react";
import { Link } from "react-router";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { CartItemData } from "@/types/api";

interface CartItemProps {
  item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const { product: productDetail, quantity } = item;

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setIsUpdating(true);
    try {
      await updateQuantity(productDetail.id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(productDetail.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPrice = productDetail.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b gap-4">
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <Link to={`/products/${productDetail.id}`}>
          {productDetail.image ? (
            <img
              src={productDetail.image}
              alt={productDetail.name}
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
        <Link to={`/products/${productDetail.id}`} className="hover:text-primary transition-colors">
          <h3 className="font-medium mb-1">{productDetail.name}</h3>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{productDetail.category_name}</p>
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
            ${totalPrice.toFixed(2)}
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