import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/api/useCart";
import { ProductData } from "@/types/api";

type ProductCardProps = {
  product: ProductData;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false); // Add loading state

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(parseInt(product.id), 1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 truncate">{product.category_name}</p>
          <p className="font-bold text-lg">${product.price}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          variant="default"
          size="sm"
          className="w-full"
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
}