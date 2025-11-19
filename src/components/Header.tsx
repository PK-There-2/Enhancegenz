import { ShoppingBag, Search, User, Menu, X, Package, UserCircle , Shield , LogOut , Heart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useCart } from './CartContext.tsx';
import { useWishlist } from './WishlistContext';


interface HeaderProps {
  currentPage: 'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout' | 'refund-policy' | 'privacy-policy' | 'contact-page';
  onNavigate: (page: 'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout' | 'refund-policy' | 'privacy-policy' | 'contact-page') => void;
  onSearch?: (query: string) => void;
}

export function Header({ currentPage, onNavigate, onSearch }: HeaderProps) {
  const { user, signOut, openAuthWindow } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount, wishlist, removeFromWishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const wishlistMenuRef = useRef<HTMLDivElement>(null);
  const cartMenuRef = useRef<HTMLDivElement>(null);
  const searchMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
      if (wishlistMenuRef.current && !wishlistMenuRef.current.contains(event.target as Node)) {
        setShowWishlist(false);
      }
      if (cartMenuRef.current && !cartMenuRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop');
      if (onSearch) {
        onSearch(searchQuery);
      }
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      {/* Top Banner */}
      <div className="bg-black text-white py-2 px-4 text-center">
        <p className="text-sm">🎉 Free Shipping Across India | Shop Now</p>
      </div>
 {/* Main Header */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex-shrink-0 hover:opacity-60 transition-opacity"
          >
            <h1 className="text-2xl tracking-tight">Thread Trends</h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('shop')}
              className={`transition-colors ${currentPage === 'shop' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Shop
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`transition-colors ${currentPage === 'about' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`transition-colors ${currentPage === 'contact' ? 'text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Contact
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block" ref={searchMenuRef}>
              <button 
                onClick={() => setShowSearch(!showSearch)}
                className="hover:opacity-60 transition-opacity"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-xl border border-gray-200 p-6 animate-fadeIn z-50">
                  <h3 className="text-xl mb-4 text-gray-900">Search Products</h3>
                  <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            
            {/* Wishlist Dropdown */}
            <div className="relative hidden sm:block" ref={wishlistMenuRef}>
              <button 
                onClick={() => setShowWishlist(!showWishlist)}
                className="hover:opacity-60 transition-opacity relative"
              >
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 -left-1 bg-white text-red-500 border-red-500 text-xs w-4 h-4 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </button>


              {/* Wishlist Dropdown */}
              {showWishlist && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-xl border border-gray-200 p-6 animate-fadeIn z-50">
                  <h3 className="text-2xl mb-6 text-red-500"> Wishlist ({getWishlistCount()})</h3>
                  {getWishlistCount() === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your wishlist is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div key={item.productId} className="flex gap-3 pb-4 border-b border-gray-200">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.category}</p>
                            <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={() => removeFromWishlist(item.productId)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          onNavigate('profile');
                          setShowWishlist(false);
                        }}
                        className="w-full py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Account Dropdown */}
            <div className="relative hidden sm:block" ref={accountMenuRef}>
              <button 
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="hover:opacity-60 transition-opacity"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Account Menu Dropdown */}
              {showAccountMenu && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white shadow-xl border border-gray-200 p-6 animate-fadeIn">
                  {user ? (
                    <>
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-600">Signed in as</p>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <button 
                          onClick={() => {
                            onNavigate('profile');
                            setShowAccountMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <UserCircle className="w-5 h-5" />
                          <span>My Account</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                          <Package className="w-5 h-5" />
                          <span>My Orders</span>
                        </button>
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => {
                              onNavigate('admin');
                              setShowAccountMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left"
                          >
                            <Shield className="w-5 h-5" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            signOut();
                            setShowAccountMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors text-left border-t border-gray-200"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl mb-4">Account</h3>
                      
                      <button 
                        onClick={() => {
                          openAuthWindow();
                          setShowAccountMenu(false);
                        }}
                        className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-colors mb-4"
                      >
                        Sign In / Sign Up
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => {
                            openAuthWindow();
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center justify-center gap-2 py-4 border-2 border-black hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-5 h-5" />
                          <span>Orders</span>
                        </button>
                        <button 
                          onClick={() => {
                            openAuthWindow();
                            setShowAccountMenu(false);
                          }}
                          className="flex items-center justify-center gap-2 py-4 border-2 border-black hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle className="w-5 h-5" />
                          <span>Profile</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={cartMenuRef}>
              <button 
                onClick={() => setShowCart(!showCart)}
                className="hover:opacity-60 transition-opacity relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {showCart && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-xl border border-gray-200 p-6 animate-fadeIn z-50">
                  <h3 className="text-xl mb-4">Shopping Cart ({getCartCount()} items)</h3>
                  {getCartCount() === 0 ? (
                    <p className="text-gray-500 text-center py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Cart items will be displayed here</p>
                      <button 
                        onClick={() => {
                          setShowCart(false);
                          // Navigate to profile cart section
                          window.dispatchEvent(new CustomEvent('navigate-to-cart'));
                          onNavigate('profile');
                        }}
                        className="w-full py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                      >
                        View Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              className="md:hidden hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-black/5">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  onNavigate('home');
                  setIsMenuOpen(false);
                }}
                className="text-left transition-colors text-gray-500 hover:text-black"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  onNavigate('shop');
                  setIsMenuOpen(false);
                }}
                className="text-left transition-colors text-gray-500 hover:text-black"
              >
                Shop
              </button>
              <button 
                onClick={() => {
                  onNavigate('about');
                  setIsMenuOpen(false);
                }}
                className="text-left transition-colors text-gray-500 hover:text-black"
              >
                About
              </button>
              <button 
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }}
                className="text-left transition-colors text-gray-500 hover:text-black"
              >
                Contact
              </button>
              
              {/* Mobile Account Section */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {user ? (
                  <>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <button 
                      onClick={() => {
                        onNavigate('profile');
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 border border-black hover:bg-gray-50"
                    >
                      My Account
                    </button>
                    {user.role === 'admin' && (
                      <button 
                        onClick={() => {
                          onNavigate('admin');
                          setIsMenuOpen(false);
                        }}
                        className="w-full py-3 bg-blue-600 text-white"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 border border-red-600 text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        openAuthWindow();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-3 bg-black text-white"
                    >
                      Sign In / Sign Up
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          openAuthWindow();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-3 border border-black"
                      >
                        <Package className="w-4 h-4" />
                        <span className="text-sm">Orders</span>
                      </button>
                      <button 
                        onClick={() => {
                          openAuthWindow();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-3 border border-black"
                      >
                        <UserCircle className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}