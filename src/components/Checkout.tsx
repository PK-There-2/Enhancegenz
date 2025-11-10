import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useRewards } from './RewardsContext';

interface CheckoutProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface OrderData {
  items: Array<{
    id: number;
    name: string;
    image: string;
    price: number;
    size: string;
    quantity: number;
  }>;
  total: number;
}

export function Checkout({ onComplete, onCancel }: CheckoutProps) {
  const { user } = useAuth();
  const { earnPoints } = useRewards();
  const [step, setStep] = useState<'shipping' | 'confirmation'>('shipping');
  const [orderData] = useState<OrderData>(() => {
    const stored = localStorage.getItem('thread_trends_checkout_data');
    return stored ? JSON.parse(stored) : { items: [], total: 0 };
  });

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    phone: ''
  });

  const [orderNumber, setOrderNumber] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateOrderNumber = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCompleteOrder = () => {
    // Validate form
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate order number
    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);

    // Save order
    const order = {
      orderNumber: newOrderNumber,
      date: new Date().toISOString(),
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      },
      shipping: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India'
      },
      items: orderData.items,
      total: orderData.total
    };

    const orders = JSON.parse(localStorage.getItem('thread_trends_orders') || '[]');
    orders.push(order);
    localStorage.setItem('thread_trends_orders', JSON.stringify(orders));

    // Award points
    earnPoints('Place an order', 200, `Order #${newOrderNumber} - ₹${orderData.total.toLocaleString()}`);

    // Clear checkout data
    localStorage.removeItem('thread_trends_checkout_data');

    // Show confirmation
    setStep('confirmation');
  };

  const calculateTax = () => {
    return Math.round(orderData.total * 0.18);
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Header */}
          <div className="text-center mb-12 pb-8 border-b border-gray-200">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Thank you, {formData.firstName}!
            </h1>
            <p className="text-gray-600">Your order is confirmed</p>
            <p className="text-sm text-gray-500 mt-2">Confirmation #{orderNumber}</p>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact information</h3>
              <p className="text-gray-600">{formData.email}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment method</h3>
              <p className="text-gray-600">Cash on Delivery · ₹{orderData.total.toLocaleString()} INR</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping address</h3>
              <div className="text-gray-600">
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}{formData.apartment && `, ${formData.apartment}`}</p>
                <p>{formData.city}, {formData.state} {formData.pincode}</p>
                <p>India</p>
                <p>{formData.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping method</h3>
              <p className="text-gray-600">Standard Shipping (3-7 business days)</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-4 last:mb-0">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-200" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                </div>
                <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Payment Method: Cash on Delivery</strong><br />
              Our team will contact you to confirm your order before dispatch.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onComplete}
            className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section - Shipping Form (Scrollable) */}
          <div className="px-6 sm:px-12 lg:px-16 py-12 lg:py-16 overflow-y-auto" style={{ maxHeight: '100vh' }}>
            <div className="max-w-xl">
              <h1 className="text-2xl font-semibold mb-8">Thread Trends</h1>

              {/* Contact */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Contact</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Delivery */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Delivery</h2>
                
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">Country/Region</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>India</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  required
                />

                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Gujarat</option>
                    <option>Tamil Nadu</option>
                  </select>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="PIN code"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>Payment Method:</strong><br />
                  Cash on Delivery (COD) available. Pay when you receive your order.
                </p>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handleCompleteOrder}
                className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                Complete Order
              </button>

              <button
                onClick={onCancel}
                className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Return to cart
              </button>
            </div>
          </div>

          {/* Right Section - Order Summary (Fixed) */}
          <div className="bg-gray-50 px-6 sm:px-12 lg:px-16 py-12 lg:py-16 border-l border-gray-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <div className="max-w-xl">
              {/* Products */}
              <div className="mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  Apply
                </button>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₹{orderData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-300">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">
                    <span className="text-sm text-gray-600 font-normal">INR </span>
                    ₹{orderData.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Including ₹{calculateTax().toLocaleString()} in taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
