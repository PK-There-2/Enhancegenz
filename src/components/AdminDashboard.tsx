import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.tsx';
import { 
  Edit2, Trash2, Save, Package, TrendingUp, Users, IndianRupee, X,
  Search, Loader2, AlertCircle, CheckCircle, LayoutDashboard, ShoppingCart,
  UserCircle, Megaphone, BarChart3, ChevronRight, ArrowUpRight, ArrowDownRight,
  ShoppingBag, Gift, Award, Sparkles
} from 'lucide-react';
import { NotificationPanel } from './NotificationPanel.tsx';
import { useRewards } from './RewardsContext.tsx';

const PRODUCTS_STORAGE_KEY = 'thread_trends_products';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  category: string;
  type: string;
  gender: string;
  image: string;
  images?: string[];
  description?: string;
  sizes?: { size: string; stock: number }[];
  createdAt?: string;
  updatedAt?: string;
}

const initializeDemoProducts = () => {
  const existingProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!existingProducts) {
    const demoProducts: Product[] = [
      {
        id: '1',
        name: 'Classic White Tee',
        price: 1299,
        originalPrice: 1899,
        isSale: true,
        category: 'Basic Tees',
        type: 'tshirts',
        gender: 'unisex',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        description: 'Premium cotton classic white t-shirt',
        sizes: [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 12 },
          { size: 'XL', stock: 8 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Graphic Print Hoodie',
        price: 2499,
        category: 'Hoodies',
        type: 'hoodies',
        gender: 'unisex',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        description: 'Comfortable hoodie with unique graphic design',
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 6 }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(demoProducts));
  }
};

export function AdminDashboard() {
  const { user, getAccessToken, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'marketing' | 'reports' | 'rewards'>('dashboard');
  const [isAddingReward, setIsAddingReward] = useState(false);
  const { userRewards, openRewardsWindow } = useRewards();

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    isSale: false,
    category: 'Graphic Tees',
    type: 'tshirts',
    gender: 'unisex',
    image: '',
    images: [],
    description: '',
    sizes: [
      { size: 'XS', stock: 0 },
      { size: 'S', stock: 0 },
      { size: 'M', stock: 0 },
      { size: 'L', stock: 0 },
      { size: 'XL', stock: 0 },
      { size: 'XXL', stock: 0 }
    ]
  });

  const [rewardFormData, setRewardFormData] = useState({
    name: '',
    description: '',
    points: 0,
    icon: '🎁',
    available: true
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      initializeDemoProducts();
      fetchProducts();
    }
  }, [user]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts([]);
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        showNotification('error', 'You must be logged in');
        return;
      }

      const newProduct: Product = {
        ...formData as Product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedProducts = [...products, newProduct];
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      
      setProducts(updatedProducts);
      setIsAddingNew(false);
      resetForm();
      showNotification('success', 'Product added successfully!');
      
      // Trigger event to notify Shop component
      window.dispatchEvent(new Event('products-updated'));
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        showNotification('error', 'You must be logged in');
        return;
      }

      const updatedProduct = {
        ...editingProduct,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? updatedProduct : p
      );
      
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setEditingProduct(null);
      resetForm();
      showNotification('success', 'Product updated successfully!');
      
      // Trigger event to notify Shop component
      window.dispatchEvent(new Event('products-updated'));
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = await getAccessToken();
      if (!token) {
        showNotification('error', 'You must be logged in');
        return;
      }

      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      showNotification('success', 'Product deleted successfully!');
      
      // Trigger event to notify Shop component
      window.dispatchEvent(new Event('products-updated'));
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete product');
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddingNew(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      isSale: false,
      category: 'Graphic Tees',
      type: 'tshirts',
      gender: 'unisex',
      image: '',
      images: [],
      description: '',
      sizes: [
        { size: 'XS', stock: 0 },
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 },
        { size: 'XXL', stock: 0 }
      ]
    });
  };

  const resetRewardForm = () => {
    setRewardFormData({
      name: '',
      description: '',
      points: 0,
      icon: '🎁',
      available: true
    });
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate real-time analytics
  const calculateAnalytics = () => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => {
      const productStock = p.sizes?.reduce((s, size) => s + size.stock, 0) || 0;
      return sum + productStock;
    }, 0);
    
    // Calculate total potential revenue (price × stock for all products)
    const totalRevenue = products.reduce((sum, p) => {
      const productStock = p.sizes?.reduce((s, size) => s + size.stock, 0) || 0;
      return sum + (p.price * productStock);
    }, 0);
    
    // Calculate products on sale
    const productsOnSale = products.filter(p => p.isSale).length;
    
    // Calculate average discount percentage
    const avgDiscount = products.filter(p => p.isSale && p.originalPrice).length > 0
      ? products
          .filter(p => p.isSale && p.originalPrice)
          .reduce((sum, p) => {
            const discount = ((p.originalPrice! - p.price) / p.originalPrice!) * 100;
            return sum + discount;
          }, 0) / products.filter(p => p.isSale && p.originalPrice).length
      : 0;

    // Get category breakdown
    const categoryBreakdown = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([label, count]) => ({
        label,
        value: totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
      }));

    return {
      totalProducts,
      totalStock,
      totalRevenue,
      productsOnSale,
      avgDiscount: Math.round(avgDiscount),
      topCategories
    };
  };

  const analytics = calculateAnalytics();

  // Render Dashboard Section
  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue Potential</p>
                <h3 className="text-3xl font-semibold text-gray-900 mt-2">₹{analytics.totalRevenue.toLocaleString()}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <span>Based on current stock</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
                <IndianRupee className="w-6 h-6" />
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Discount</p>
                <h3 className="text-3xl font-semibold text-gray-900 mt-2">{analytics.avgDiscount}%</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <span>{analytics.productsOnSale} products on sale</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <TrendingUp className="w-6 h-6" />
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Stock</p>
                <h3 className="text-3xl font-semibold text-gray-900 mt-2">{analytics.totalStock}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <span>{analytics.totalProducts} products available</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 text-rose-600">
                <Package className="w-6 h-6" />
              </span>
            </div>
          </div>
        </div>

        {/* Business Growth Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Milestones */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">Growth Milestones</h3>
                <p className="text-sm text-gray-500 mt-1">Track your business progress</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                <span className="text-sm font-semibold text-gray-600">Starting Fresh</span>
              </div>
            </div>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[{
                title: 'Q1',
                amount: '₹0',
                description: 'Ready to launch',
                color: 'from-gray-400 to-gray-500'
              }, {
                title: 'Q2',
                amount: '₹0',
                description: 'Building momentum',
                color: 'from-gray-400 to-gray-500'
              }, {
                title: 'Q3',
                amount: '₹0',
                description: 'Growing strong',
                color: 'from-gray-400 to-gray-500'
              }, {
                title: 'Q4',
                amount: '₹0',
                description: 'Reaching goals',
                color: 'from-gray-400 to-gray-500'
              }].map(({ title, amount, description, color }) => (
                <div
                  key={title}
                   className="group relative overflow-hidden rounded-xl border border-gray-200 p-5 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                     <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 bg-gray-50 text-xs font-semibold text-gray-900 tracking-wide">
                       {title}
                     </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{amount}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                   <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Categories */}
              <div className="rounded-xl border border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-base font-semibold text-gray-900">Top Performing Categories</p>
                </div>
                {analytics.topCategories.length > 0 ? (
                  <div className="space-y-5">
                    {analytics.topCategories.map(({ label, value }, idx) => {
                      const colors = [
                        'from-black to-gray-800',
                        'from-gray-700 to-gray-900',
                        'from-gray-500 to-gray-700'
                      ];
                      return (
                        <div key={label}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                            <span className="text-sm font-bold text-gray-900">{value}%</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${colors[idx]} transition-all duration-500`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No categories yet</p>
                    <p className="text-sm">Add products to see category breakdown</p>
                  </div>
                )}
              </div>

              {/* Product Overview */}
              <div className="rounded-xl border border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <p className="text-base font-semibold text-gray-900">Product Overview</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white hover:shadow-sm transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Total Products</p>
                      <p className="text-xs text-gray-500 mt-1">Active inventory</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalProducts}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white hover:shadow-sm transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Total Stock</p>
                      <p className="text-xs text-gray-500 mt-1">All units combined</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalStock}</p>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white hover:shadow-sm transition-all">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">On Sale</p>
                      <p className="text-xs text-gray-500 mt-1">Discounted items</p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600">{analytics.productsOnSale}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Revenue Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Product Value Breakdown</h3>
            {products.length > 0 ? (
              <div className="space-y-3">
                {products
                  .sort((a, b) => {
                    const aStock = a.sizes?.reduce((s, size) => s + size.stock, 0) || 0;
                    const bStock = b.sizes?.reduce((s, size) => s + size.stock, 0) || 0;
                    return (b.price * bStock) - (a.price * aStock);
                  })
                  .slice(0, 5)
                  .map((product) => {
                    const stock = product.sizes?.reduce((s, size) => s + size.stock, 0) || 0;
                    const value = product.price * stock;
                    return (
                      <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{stock} units in stock</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{value.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">₹{product.price} each</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No products yet</p>
                <p className="text-sm">Add products to see value breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[{
            label: 'Total Products',
            value: analytics.totalProducts,
            subtext: 'Currently active SKUs',
            Icon: Package
          }, {
            label: 'Total Stock Units',
            value: analytics.totalStock,
            subtext: 'Items in inventory',
            Icon: ShoppingBag
          }, {
            label: 'Products on Sale',
            value: analytics.productsOnSale,
            subtext: 'Active discounts',
            Icon: TrendingUp
          }, {
            label: 'Categories',
            value: Object.keys(products.reduce((acc, p) => ({ ...acc, [p.category]: 1 }), {})).length,
            subtext: 'Unique product categories',
            Icon: LayoutDashboard
          }].map(({ label, value, subtext, Icon }) => (
            <div
              key={label}
              className="group bg-white rounded-2xl p-6 border border-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">{label}</p>
                  <p className="mt-3 text-4xl font-semibold text-gray-900">{value}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-black/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-full border border-black/10 bg-white text-black">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">{subtext}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render empty states for other sections
  const renderOrdersSection = () => (
    <div className="bg-white rounded-xl p-12 text-center shadow-md">
      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900">Orders Management</h3>
      <p className="text-gray-500">Order management features coming soon</p>
    </div>
  );

  const renderCustomersSection = () => (
    <div className="bg-white rounded-xl p-12 text-center shadow-md">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900">Customer Management</h3>
      <p className="text-gray-500">Customer management features coming soon</p>
    </div>
  );

  const renderMarketingSection = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return (
        <div className="bg-white rounded-xl p-12 text-center shadow-md">
          <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Authentication Required</h3>
          <p className="text-gray-500">Please log in to access marketing tools</p>
        </div>
      );
    }
    return <NotificationPanel accessToken={token} />;
  };

  const renderReportsSection = () => (
    <div className="bg-white rounded-xl p-12 text-center shadow-md">
      <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-900">Detailed Reports</h3>
      <p className="text-gray-500">Advanced reporting features coming soon</p>
    </div>
  );

  const renderRewardsSection = () => {
    // This would normally come from a database/API
    const rewards = [
      {
        id: '1',
        name: '₹100 off coupon',
        description: 'Use on your next purchase',
        points: 500,
        redeemed: 0,
        available: true,
        icon: '🎫'
      },
      {
        id: '2',
        name: '₹200 off coupon',
        description: 'Use on orders above ₹1000',
        points: 1000,
        redeemed: 0,
        available: true,
        icon: '🎫'
      },
      {
        id: '3',
        name: '₹500 off coupon',
        description: 'Use on orders above ₹2000',
        points: 2500,
        redeemed: 0,
        available: true,
        icon: '🎫'
      },
      {
        id: '4',
        name: 'Free shipping',
        description: 'Free delivery on next order',
        points: 300,
        redeemed: 0,
        available: true,
        icon: '🚚'
      },
      {
        id: '5',
        name: 'Mystery gift',
        description: 'Surprise gift with your order',
        points: 1500,
        redeemed: 0,
        available: true,
        icon: '🎁'
      }
    ];

    const totalRedeemed = rewards.reduce((sum, r) => sum + r.redeemed, 0);
    const totalPointsIssued = rewards.reduce((sum, r) => sum + (r.redeemed * r.points), 0);

    const handleAddReward = () => {
      if (!rewardFormData.name || !rewardFormData.description || rewardFormData.points <= 0) {
        showNotification('error', 'Please fill in all reward fields');
        return;
      }
      
      // Here you would save to database/localStorage
      showNotification('success', `Reward "${rewardFormData.name}" added successfully!`);
      resetRewardForm();
      setIsAddingReward(false);
    };

    const iconOptions = ['🎫', '🎁', '🚚', '⭐', '🏆', '💎', '🎉', '✨', '🔥', '💰'];

    return (
      <div className="space-y-6">
        {/* Header with Rewards Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Gift className="w-8 h-8 text-pink-500" />
              Rewards Management
            </h2>
            <p className="text-sm text-gray-500 mt-2">Manage your loyalty rewards program</p>
          </div>
          <button
            onClick={() => openRewardsWindow()}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Gift className="w-5 h-5" />
            <span className="font-semibold">View Rewards</span>
            {userRewards && (
              <span className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-bold">
                {userRewards.totalPoints} pts
              </span>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rewards Redeemed</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalRedeemed}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <span>Ready to start</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600">
                <Award className="w-6 h-6" />
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points Issued</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalPointsIssued.toLocaleString()}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <span>No points distributed yet</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600">
                <Sparkles className="w-6 h-6" />
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                  <span>Awaiting first users</span>
                </div>
              </div>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600">
                <Users className="w-6 h-6" />
              </span>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Available Rewards</h3>
              <p className="text-sm text-gray-500 mt-1">Manage rewards that customers can redeem</p>
            </div>
            <button 
              onClick={() => setIsAddingReward(!isAddingReward)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {isAddingReward ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  <span>Add Reward</span>
                </>
              )}
            </button>
          </div>

          {/* Add Reward Form */}
          {isAddingReward && (
            <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Create New Reward</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reward Name *</label>
                  <input
                    type="text"
                    value={rewardFormData.name}
                    onChange={(e) => setRewardFormData({ ...rewardFormData, name: e.target.value })}
                    placeholder="e.g., ₹100 off coupon"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points Required *</label>
                  <input
                    type="number"
                    value={rewardFormData.points}
                    onChange={(e) => setRewardFormData({ ...rewardFormData, points: parseInt(e.target.value) || 0 })}
                    placeholder="500"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={rewardFormData.description}
                    onChange={(e) => setRewardFormData({ ...rewardFormData, description: e.target.value })}
                    placeholder="Describe the reward and any conditions..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setRewardFormData({ ...rewardFormData, icon })}
                        className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                          rewardFormData.icon === icon
                            ? 'border-black bg-gray-100'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rewardFormData.available}
                      onChange={(e) => setRewardFormData({ ...rewardFormData, available: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Make reward available immediately</span>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddReward}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Create Reward</span>
                </button>
                <button
                  onClick={() => {
                    setIsAddingReward(false);
                    resetRewardForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 bg-white hover:border-pink-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{reward.icon}</div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    reward.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {reward.available ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-gray-900 mb-1">{reward.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Points Required</p>
                    <p className="text-lg font-bold text-pink-600">{reward.points}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Redeemed</p>
                    <p className="text-lg font-bold text-gray-900">{reward.redeemed}</p>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Redemptions</h3>
          <div className="text-center py-12 text-gray-500">
            <Gift className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No redemptions yet</p>
            <p className="text-sm mt-2">Redemption activity will appear here once customers start using rewards</p>
          </div>
        </div>
      </div>
    );
  };

  // Render Products Section (existing code - simplified for length)
  const renderProductsSection = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    if (isAddingNew || editingProduct) {
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {isAddingNew ? 'Add New Product' : 'Edit Product'}
            </h3>
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditingProduct(null);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                placeholder="e.g., Graphic Tee - Vintage"
              />
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Main Image URL *</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                placeholder="https://..."
              />
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Additional Images (comma-separated URLs)</label>
              <input
                type="text"
                value={(formData.images || []).join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  images: e.target.value.split(',').map((u) => u.trim()).filter(Boolean),
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                placeholder="https://image1.jpg, https://image2.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple image URLs with commas</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-1 text-gray-700">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                placeholder="Product description, material details, care instructions..."
              />
            </div>

            {/* Price / Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Price (₹) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Original Price (₹)</label>
                <input
                  type="number"
                  value={formData.originalPrice || 0}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                />
              </div>
            </div>

            {/* Category / Type / Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                >
                  <option>Graphic Tees</option>
                  <option>Oversized</option>
                  <option>Hoodies</option>
                  <option>Bottoms</option>
                  <option>Jackets</option>
                  <option>Accessories</option>
                  <option>Essentials</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                >
                  <option value="tshirts">T-Shirts</option>
                  <option value="hoodies">Hoodies</option>
                  <option value="pants">Pants</option>
                  <option value="jackets">Jackets</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                </select>
              </div>
            </div>

            {/* On Sale */}
            <div className="flex items-center gap-2">
              <input
                id="on-sale"
                type="checkbox"
                checked={!!formData.isSale}
                onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="on-sale" className="text-sm text-gray-700">On Sale</label>
            </div>

            {/* Size & Stock */}
            <div className="mt-2">
              <h4 className="mb-2 text-gray-900">Size & Stock</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(formData.sizes || []).map((sizeItem, index) => (
                  <div key={sizeItem.size} className="border border-gray-200 rounded-md p-3">
                    <label className="block text-xs mb-1 text-gray-700">{sizeItem.size}</label>
                    <input
                      type="number"
                      value={sizeItem.stock}
                      onChange={(e) => {
                        const newSizes = [...(formData.sizes || [])];
                        newSizes[index] = { ...sizeItem, stock: Number(e.target.value) };
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:border-black focus:outline-none"
                      min={0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-3">
              <button
                onClick={isAddingNew ? handleAddProduct : handleUpdateProduct}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isAddingNew ? 'Add Product' : 'Update Product'}
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              setIsAddingNew(true);
              resetForm();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Add Product</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Product</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-black">Price</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <span className="font-medium text-black">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black">{product.category}</td>
                  <td className="px-6 py-4 text-black">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(product)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-black">Access Denied</h2>
          <p className="text-black">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className="w-64 text-white min-h-screen p-6 shadow-2xl"
        style={{ backgroundColor: '#0f172a' }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-xs text-slate-200 mt-1">Thread Trends</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'customers', icon: UserCircle, label: 'Customers', hasChevron: true },
            { id: 'marketing', icon: Megaphone, label: 'Marketing', hasChevron: true },
            { id: 'reports', icon: BarChart3, label: 'Reports', hasChevron: true },
            { id: 'rewards', icon: Gift, label: 'Rewards' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center ${item.hasChevron ? 'justify-between' : ''} gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.hasChevron && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}

          {activeSection === 'reports' && (
            <div className="ml-4 space-y-1 border-l-2 border-white/20 pl-4">
              <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white">
                Net Margin
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-white/70 hover:text-white">
                Sales by Category
              </button>
            </div>
          )}
        </nav>

        <div className="mt-auto pt-8">
          <div className="border-t border-white/15 pt-4">
            <p className="text-xs text-white/70">Logged in as</p>
            <p className="text-sm font-medium text-white">{user.name}</p>
            <button
              onClick={signOut}
              className="mt-2 text-xs text-rose-300 hover:text-rose-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'products' && renderProductsSection()}
          {activeSection === 'orders' && renderOrdersSection()}
          {activeSection === 'customers' && renderCustomersSection()}
          {activeSection === 'marketing' && renderMarketingSection()}
          {activeSection === 'reports' && renderReportsSection()}
          {activeSection === 'rewards' && renderRewardsSection()}
        </div>
      </div>
    </div>
  );
}
