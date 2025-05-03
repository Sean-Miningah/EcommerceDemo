
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-8 mt-auto">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">ShopMVP</h3>
            <p className="text-gray-600 text-sm">
              Your one-stop shop for all your shopping needs.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4 text-gray-900">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary text-sm">
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-4 text-gray-900">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-2">
              Subscribe to get updates on new products and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-l-md border border-input bg-background px-3 py-2 text-sm flex-1"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} ShopMVP. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-600 hover:text-primary text-sm">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-600 hover:text-primary text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
