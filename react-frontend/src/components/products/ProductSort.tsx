import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/contexts/ProductContext";

export function ProductSort() {
  const { sortOption, setSortOption, isLoading } = useProducts();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select
        value={sortOption}
        onValueChange={(value) => setSortOption(value as any)}
        disabled={isLoading}
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