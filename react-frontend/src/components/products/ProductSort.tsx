import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/api/useProducts";
import { useState, useEffect } from "react";

export function ProductSort() {
  const { loading, currentFilters, setFilters } = useProducts();
  const [sortOption, setSortOption] = useState("name_asc");

  useEffect(() => {
    if (currentFilters && currentFilters.ordering) {
      switch (currentFilters.ordering) {
        case "name":
          setSortOption("name_asc");
          break;
        case "-name":
          setSortOption("name_desc");
          break;
        case "price":
          setSortOption("price_asc");
          break;
        case "-price":
          setSortOption("price_desc");
          break;
      }
    }
  }, [currentFilters]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortOption(value);

    // Convert sort option to API ordering format
    let ordering = "";
    switch (value) {
      case "name_asc":
        ordering = "name";
        break;
      case "name_desc":
        ordering = "-name";
        break;
      case "price_asc":
        ordering = "price";
        break;
      case "price_desc":
        ordering = "-price";
        break;
      default:
        ordering = "";
    }


    setFilters({
      ...currentFilters,
      ordering,
      page: 1
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select
        value={sortOption}
        onValueChange={handleSortChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name_asc">Name: A to Z</SelectItem>
          <SelectItem value="name_desc">Name: Z to A</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}