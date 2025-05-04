import { ProductCard } from "./ProductCard";
import { useProducts } from "@/hooks/api/useProducts"; // Import the new Redux hook
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductData } from '@/types/api'

export function ProductGrid() {
  const {
    products,
    loading,
    error,
    getProducts
  } = useProducts();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error loading products</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button
            onClick={() => getProducts()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">
          Try adjusting your filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: ProductData) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}