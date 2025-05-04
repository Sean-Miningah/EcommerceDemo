import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCart } from "@/hooks/api/useCart"
import { useProducts } from "@/hooks/api/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { product, loading, error, getProductById, clearProduct } = useProducts();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      getProductById(parseInt(id));
    }

    // Clean up when component unmounts
    return () => {
      clearProduct();
    };
  }, [id, getProductById, clearProduct]);

  const handleAddToCart = async () => {
    if (product) {
      setIsAddingToCart(true);
      try {
        // Use Redux cart action
        await addToCart(parseInt(product.id), quantity);
      } catch (err) {
        console.error("Error adding item to cart:", err);
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Skeleton className="aspect-square w-full rounded-lg" />
            </div>
            <div className="md:w-1/2 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error loading product</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => id && getProductById(parseInt(id))} // Use the Redux action
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/products" className="text-sm text-gray-500 hover:text-primary">
                    Products
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm text-gray-700">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="border rounded-lg overflow-hidden bg-white">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-square object-contain p-4"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <span className="badge badge-secondary">{product.category_name}</span>
              <span className="ml-4 text-sm text-gray-500">SKU: {product.id}</span>
            </div>

            <div className="text-2xl font-bold text-primary mb-4">
              ${product.price}
            </div>

            <p className="text-gray-700 mb-6">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Quantity</div>
              <div className="flex items-center">
                <button
                  className="w-8 h-8 flex items-center justify-center border rounded-l"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-16 h-8 text-center border-y"
                />
                <button
                  className="w-8 h-8 flex items-center justify-center border rounded-r"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex items-center"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
              >
                Add to Wishlist
              </Button>
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex items-center text-sm">
                <span className="font-medium">Availability:</span>
                <span className="ml-2 text-green-600">
                  In Stock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetailPage;