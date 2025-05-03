import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/products/ProductCard";
// Import the hooks
import { useProducts } from "@/contexts/ProductContext";

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  // Use the products hook to get all products and categories
  const {
    products,
    categories,
    isLoading,
    error
  } = useProducts();



  // Get featured products when products are loaded
  useEffect(() => {

    console.log('categories ', categories)
    if (products.length > 0) {
      // You could apply your own logic to determine "featured" products
      // For now, just taking the first 4 as an example
      setFeaturedProducts(products.slice(0, 4));
    }
  }, [products]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              Discover Quality Products for Your Lifestyle
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Browse our curated collection of products designed to enhance your everyday experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop Now <ShoppingCart className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                <img
                  src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                  alt="Product showcase"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white mt-8">
                <img
                  src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                  alt="Product showcase"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                <img
                  src="https://images.unsplash.com/photo-1556740714-a8395b3bf30f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                  alt="Product showcase"
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg bg-white mt-8">
                <img
                  src="https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                  alt="Product showcase"
                  className="w-full h-40 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-lg">Loading categories...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link to={`/products?category=${category.id}`} key={category.id} className="group">
                  <div className="rounded-lg overflow-hidden">
                    <div className="bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                      <h3 className="text-white font-bold text-xl">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary bg-opacity-10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to shop?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Explore our wide range of products and find exactly what you need.
            </p>
            <Button asChild size="lg">
              <Link to="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;