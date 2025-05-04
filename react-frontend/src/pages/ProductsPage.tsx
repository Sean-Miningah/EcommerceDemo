import { PageLayout } from "@/components/layout/PageLayout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductSort } from "@/components/products/ProductSort";
import { ProductPagination } from "@/components/products/ProductPagination";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ProductsPage = () => {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>

          {/* Mobile filter button */}
          <div className="lg:hidden">
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters & Sorting
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="h-full overflow-y-auto py-6 px-4">
                  <ProductFilters />
                  <div className="mt-8">
                    <h3 className="text-sm font-medium mb-4">Sort</h3>
                    <ProductSort />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop filters sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters />
            </div>

            <div className="flex-1">
              {/* Sort controls on desktop */}
              <div className="hidden lg:flex justify-end mb-6">
                <ProductSort />
              </div>

              {/* Product grid */}
              <ProductGrid />

              {/* Pagination */}
              <ProductPagination />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductsPage;