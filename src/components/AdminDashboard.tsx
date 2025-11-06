import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.tsx';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { projectId } from '../utils/supabase/info';

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

export function AdminDashboard() {
  const { user, getAccessToken, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from API...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d9a3ff0a/products`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched products response:', data);
      console.log('Products count:', data.products?.length || 0);
      
      if (data.products) {
        setProducts(data.products);
      } else {
        console.warn('No products returned from API');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products - detailed:', error);
      showNotification('error', 'Failed to fetch products');
      // Don't clear products on error - keep existing state
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

      console.log('Adding product with data:', formData);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d9a3ff0a/products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      console.log('Add product response:', data);

      if (!response.ok) {
        console.error('Add product failed with status:', response.status, 'Error:', data.error);
        throw new Error(data.error);
      }

      console.log('Product added successfully, updating local state');
      setProducts([...products, data.product]);
      setIsAddingNew(false);
      resetForm();
      showNotification('success', 'Product added successfully!');
    } catch (error: any) {
      console.error('Error adding product:', error);
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

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d9a3ff0a/products/${editingProduct.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setProducts(products.map(p => p.id === editingProduct.id ? data.product : p));
      setEditingProduct(null);
      resetForm();
      showNotification('success', 'Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
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

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d9a3ff0a/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter(p => p.id !== productId));
      showNotification('success', 'Product deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting product:', error);
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

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 shadow-lg flex items-center gap-3 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl mt-2">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Sale</p>
                <p className="text-3xl mt-2">
                  {products.filter(p => p.isSale).length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-3xl mt-2">
                  {new Set(products.map(p => p.category)).size}
                </p>
              </div>
              <Users className="w-12 h-12 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Price</p>
                <p className="text-3xl mt-2">
                  ₹{products.length > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length) : 0}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Product Management */}
        <div className="bg-white shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl">Product Management</h2>
              <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 focus:border-black focus:outline-none w-full sm:w-64"
                  />
                </div>
                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAddingNew || editingProduct) && (
            <div className="p-6 bg-blue-50 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl">
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
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="e.g., Graphic Tee - Vintage"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Main Image URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Additional Images (comma-separated URLs)</label>
                  <input
                    type="text"
                    value={formData.images?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      images: e.target.value.split(',').map(url => url.trim()).filter(url => url) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="https://image1.jpg, https://image2.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple image URLs with commas</p>
                </div>

                <div>
                  <label className="block text-sm mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    rows={4}
                    placeholder="Product description, material details, care instructions..."
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
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
                  <label className="block text-sm mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  >
                    <option value="tshirts">T-Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="pants">Pants</option>
                    <option value="jackets">Jackets</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSale}
                      onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">On Sale</span>
                  </label>
                </div>
              </div>

              {/* Size & Stock Management */}
              <div className="mt-6">
                <h4 className="mb-3">Size & Stock</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.sizes?.map((sizeItem, index) => (
                    <div key={sizeItem.size} className="border border-gray-300 p-3">
                      <label className="block text-sm mb-1">{sizeItem.size}</label>
                      <input
                        type="number"
                        value={sizeItem.stock}
                        onChange={(e) => {
                          const newSizes = [...(formData.sizes || [])];
                          newSizes[index] = { ...sizeItem, stock: Number(e.target.value) };
                          setFormData({ ...formData, sizes: newSizes });
                        }}
                        className="w-full px-2 py-1 border border-gray-300 focus:border-black focus:outline-none"
                        placeholder="Stock"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={isAddingNew ? handleAddProduct : handleUpdateProduct}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {isAddingNew ? 'Add Product' : 'Update Product'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Products List */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4">Image</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Gender</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs truncate">{product.name}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>₹{product.price}</div>
                          {product.originalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">{product.category}</td>
                        <td className="py-3 px-4 capitalize">{product.type}</td>
                        <td className="py-3 px-4 capitalize">{product.gender}</td>
                        <td className="py-3 px-4">
                          {product.isSale && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs">
                              SALE
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="p-2 hover:bg-gray-200 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
