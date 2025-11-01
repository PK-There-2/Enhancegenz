import { ShoppingBag, Search, User, Menu, X, Package, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'shop' | 'about' | 'contact';
  onNavigate: (page: 'home' | 'shop' | 'about' | 'contact') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              className={`hover:opacity-60 transition-opacity ${currentPage === 'home' ? 'opacity-100' : 'opacity-60'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('shop')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'shop' ? 'opacity-100' : 'opacity-60'}`}
            >
              Shop
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'about' ? 'opacity-100' : 'opacity-60'}`}
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className={`hover:opacity-60 transition-opacity ${currentPage === 'contact' ? 'opacity-100' : 'opacity-60'}`}
            >
              Contact
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hover:opacity-60 transition-opacity hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            
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
                  <h3 className="text-xl mb-4">Account</h3>
                  
                  {/* Sign In Button */}
                  <button className="w-full py-4 bg-black text-white hover:bg-gray-800 transition-colors mb-4 rounded-lg">
                    Sign in
                  </button>

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-4 border-2 border-black hover:bg-gray-50 transition-colors rounded-lg">
                      <Package className="w-5 h-5" />
                      <span>Orders</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-4 border-2 border-black hover:bg-gray-50 transition-colors rounded-lg">
                      <UserCircle className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="hover:opacity-60 transition-opacity relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
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
                className="hover:opacity-60 transition-opacity text-left"
              >
                Home
              </button>
              <button 
                onClick={() => {
                  onNavigate('shop');
                  setIsMenuOpen(false);
                }}
                className="hover:opacity-60 transition-opacity text-left"
              >
                Shop
              </button>
              <button 
                onClick={() => {
                  onNavigate('about');
                  setIsMenuOpen(false);
                }}
                className="hover:opacity-60 transition-opacity text-left"
              >
                About
              </button>
              <button 
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }}
                className="hover:opacity-60 transition-opacity text-left"
              >
                Contact
              </button>
              
              {/* Mobile Account Section */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button className="w-full py-3 bg-black text-white rounded-lg">
                  Sign in
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 border border-black rounded-lg">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Orders</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 border border-black rounded-lg">
                    <UserCircle className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
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
