import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { User, Package, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react';

export function UserPortal({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be signed in to view your profile</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Go to Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <h3 className="text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <nav className="p-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 transition-colors ${
                    activeTab === 'wishlist'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-6 border-t border-gray-200 hover:bg-red-50 text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-2xl mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">Account Type</label>
                    <input
                      type="text"
                      value={user.role === 'admin' ? 'Administrator' : 'Customer'}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 bg-gray-50 capitalize"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-2xl mb-6">My Orders</h2>
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white shadow-sm p-6">
                <h2 className="text-2xl mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPortal;