import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/contexts/ProductContext";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ProductFilters() {
  const {
    categories,
    selectedCategories,
    setSelectedCategories,
    priceRange,
    setPriceRange,
    isLoading, // Add this to show loading state
  } = useProducts();

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    priceRange.min,
    priceRange.max,
  ]);

  // Update local price range when the context price range changes
  useEffect(() => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
  }, [priceRange.min, priceRange.max]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(
      checked
        ? [...selectedCategories, categoryId]
        : selectedCategories.filter((id) => id !== categoryId)
    );
  };

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  const handlePriceChangeEnd = () => {
    setPriceRange(localPriceRange[0], localPriceRange[1]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>

        <Accordion type="single" collapsible className="w-full" defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div className="space-y-2 mt-2">
                  <p className="text-sm text-gray-500">Loading categories...</p>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price-range">
            <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-2 px-1">
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[localPriceRange[0], localPriceRange[1]]}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceChangeEnd}
                  className="mt-6"
                  disabled={isLoading}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm">
                    ${localPriceRange[0]}
                  </span>
                  <span className="text-sm">
                    ${localPriceRange[1]}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}