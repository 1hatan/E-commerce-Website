import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, Menu, X, LogOut, Package, LayoutDashboard, MapPin, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'NEW IN', path: '/shop?category=new-in' },
    { name: 'WOMEN', path: '/shop?category=women' },
    { name: 'MEN', path: '/shop?category=men' },
    { name: 'SHOES', path: '/shop?category=shoes' },
    { name: 'ACCESSORIES', path: '/shop?category=accessories' },
    { name: 'SALE', path: '/shop?category=sale' },
  ];

  return (
    <>
      {/* Top Black Announcement Bar */}
      <div className="bg-[#000000] text-white text-[11px] py-2 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-gray-400 text-[11px]">
            <span className="hover:text-white cursor-pointer transition-colors">US / USD</span>
          </div>

          <div className="flex-1 text-center font-medium tracking-wider uppercase text-gray-200">
            FREE SHIPPING ON ORDERS OVER $75 | EASY RETURNS
          </div>

          <div className="hidden md:flex items-center gap-4 text-gray-300">
            <Link to="/shop" className="hover:text-white flex items-center gap-1 transition-colors">
              <MapPin className="w-3 h-3" /> Store Locator
            </Link>
            <span>&bull;</span>
            <Link to="/shop" className="hover:text-white flex items-center gap-1 transition-colors">
              <HelpCircle className="w-3 h-3" /> Help
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Brand Logo (C-STYLE with circular emblem) */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#1c1917] flex items-center justify-center font-serif text-lg font-bold text-[#1c1917]">
                C
              </div>
              <span className="font-serif text-2xl font-bold tracking-[0.15em] text-[#1c1917]">
                C-STYLE
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-bold tracking-widest transition-colors ${
                    link.name === 'SALE' ? 'text-red-600 hover:text-red-700' : 'text-gray-700 hover:text-[#1c1917]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar + Account + Wishlist + Cart */}
            <div className="flex items-center gap-4">

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for items, brands..."
                    className="w-56 lg:w-64 pl-4 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Account Button */}
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="p-2 text-gray-700 hover:text-black transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full pt-2 w-56 z-50"
                    >
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                        {user ? (
                          <>
                            <div className="px-4 py-2 border-b border-gray-100 mb-1">
                              <p className="text-xs font-bold text-gray-900">{profile?.full_name || 'My Account'}</p>
                              <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                            </div>
                            <Link to="/account" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                              <User className="w-3.5 h-3.5 text-gray-500" /> My Profile
                            </Link>
                            <Link to="/account/orders" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                              <Package className="w-3.5 h-3.5 text-gray-500" /> My Orders
                            </Link>
                            {isAdmin && (
                              <Link to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                <LayoutDashboard className="w-3.5 h-3.5 text-gray-500" /> Admin Panel
                              </Link>
                            )}
                            <button
                              onClick={() => { signOut(); navigate('/'); }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg text-left"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Sign Out
                            </button>
                          </>
                        ) : (
                          <div className="p-2 space-y-2">
                            <Link
                              to="/login"
                              className="block w-full text-center py-2 bg-[#1c1917] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                            >
                              Sign In
                            </Link>
                            <Link
                              to="/register"
                              className="block w-full text-center py-2 bg-gray-100 text-gray-800 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              Create Account
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Icon */}
              <Link to="/wishlist" className="p-2 text-gray-700 hover:text-black transition-colors relative" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-[#1c1917] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon (Counter matching reference badge) */}
              <Link to="/cart" className="p-2 text-gray-700 hover:text-black transition-colors relative" aria-label="Shopping Cart">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1c1917] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-700"
                aria-label="Toggle Navigation"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-3">
                <form onSubmit={handleSearch} className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for items, brands..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-900"
                  />
                </form>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block px-2 py-2 text-sm font-bold tracking-wider text-gray-800 border-b border-gray-50"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
