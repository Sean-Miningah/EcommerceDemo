import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts } from "@/hooks/api/useProducts";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CategoryData } from "@/types/api";

export function ProductFilters() {
  const {
    categories,
    loading,
    currentFilters,
    setFilters
  } = useProducts();

  const MAX_PRICE = 1000;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 1000]);

  useEffect(() => {
    if (currentFilters) {
      if (currentFilters.categories) {
        setSelectedCategories(currentFilters.categories);
      }
      if (currentFilters.priceRange) {
        setLocalPriceRange(currentFilters.priceRange);
      }
    }
  }, [currentFilters]);

  // Handle category selection changes
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelectedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);

    setSelectedCategories(newSelectedCategories);

    // Update filters in Redux
    setFilters({
      ...currentFilters,
      categories: newSelectedCategories,
      page: 1
    });
  };

  // Handle local price range slider changes
  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };

  // When price slider is released, apply the filter
  const handlePriceChangeEnd = () => {
    // Update filters in Redux
    setFilters({
      ...currentFilters,
      priceRange: localPriceRange,
      page: 1
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>

        <Accordion type="single" collapsible className="w-full" defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
            <AccordionContent>
              {loading ? (
                <div className="space-y-2 mt-2">
                  <p className="text-sm text-gray-500">Loading categories...</p>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  {categories.map((category: CategoryData) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id.toString())}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id.toString(), checked as boolean)
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
                  max={MAX_PRICE} // Use the defined maximum price constant
                  step={10}
                  value={[localPriceRange[0], localPriceRange[1]]}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceChangeEnd}
                  className="mt-6"
                  disabled={loading}
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