import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Package } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems());
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-40 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-green-600 tracking-tight">InstaMart</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition-colors"
                    placeholder="Search for 'milk', 'bread'..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-600 hover:text-green-600 font-medium text-sm">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" className="text-gray-600 hover:text-green-600">
                    <Package className="h-6 w-6" />
                  </Link>
                  <button onClick={handleLogout} className="text-gray-600 hover:text-green-600">
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">
                  Login
                </Link>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="font-bold">{totalItems} items</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
