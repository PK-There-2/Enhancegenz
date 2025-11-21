import { useState, useEffect } from 'react';
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
  const [policy, setPolicy] = useState<null | 'privacy' | 'contact'>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [orderData] = useState<OrderData>(() => {
    const stored = localStorage.getItem('thread_trends_checkout_data');
    return stored ? JSON.parse(stored) : { items: [], total: 0 };
  });

  // Add discount state
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    phone: '',
    billingSameAsShipping: true,
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: 'Maharashtra',
    billingPincode: ''
  });

  const [shippingMethod, setShippingMethod] = useState<'free' | 'express'>('free');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [orderNumber, setOrderNumber] = useState('');

  const UPI_ID = 'paarth.mritunjya@okicici';

  // Auto-show popup when component mounts and on shipping step
  useEffect(() => {
    if (step === 'shipping') {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1000); // 1 second delay, adjust as needed

      return () => clearTimeout(timer);
    }
  }, [step]);

  // Function to apply discount
  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'SAVE20') {
      const discount = Math.round(orderData.total * 0.20);
      setDiscountAmount(discount);
      setDiscountApplied(true);
    } else {
      alert('Invalid discount code');
    }
  };

  // Function to calculate final total
  const calculateTotal = () => {
    const subtotal = orderData.total;
    const shippingCost = shippingMethod === 'free' ? 0 : 99;
    const tax = Math.round((subtotal - discountAmount) * 0.18);
    return subtotal - discountAmount + shippingCost;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && 'checked' in e.target) {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const generateOrderNumber = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCompleteOrder = () => {
    if (!formData.email || !formData.firstName || !formData.lastName ||
        !formData.address || !formData.city || !formData.pincode || !formData.phone) {
      alert('Please fill in all required shipping address fields');
      return;
    }

    if (!formData.billingSameAsShipping) {
      if (!formData.billingAddress || !formData.billingCity || !formData.billingPincode) {
        alert('Please fill in all required billing address fields');
        return;
      }
    }

    const newOrderNumber = generateOrderNumber();
    setOrderNumber(newOrderNumber);

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
      billing: {
        sameAsShipping: formData.billingSameAsShipping,
        address: formData.billingSameAsShipping ? formData.address : formData.billingAddress,
        apartment: formData.billingSameAsShipping ? formData.apartment : formData.billingApartment,
        city: formData.billingSameAsShipping ? formData.city : formData.billingCity,
        state: formData.billingSameAsShipping ? formData.state : formData.billingState,
        pincode: formData.billingSameAsShipping ? formData.pincode : formData.billingPincode,
        country: 'India'
      },
      shippingMethod,
      paymentMethod,
      items: orderData.items,
      total: calculateTotal(), // Use the final total with discount
      discount: discountApplied ? discountAmount : 0
    };

    const orders = JSON.parse(localStorage.getItem('thread_trends_orders') || '[]');
    orders.push(order);
    localStorage.setItem('thread_trends_orders', JSON.stringify(orders));

    window.dispatchEvent(new CustomEvent('orders-updated'));
    earnPoints('Place an order', 200, `Order #${newOrderNumber} - ₹${order.total.toLocaleString()}`);
    localStorage.removeItem('thread_trends_checkout_data');

    setStep('confirmation');
  };

  const calculateTax = () => {
    return Math.round((orderData.total - discountAmount) * 0.18);
  };

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onComplete}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Return to Shop</span>
            </button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 pb-8 border-b border-gray-200 bg-white rounded-xl shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank you, {formData.firstName}!
            </h1>
            <p className="text-gray-600">Your order is confirmed</p>
            <p className="text-sm text-gray-500 mt-2">Confirmation #{orderNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact information</h3>
              <p className="text-gray-600">{formData.email}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h3>
              <p className="text-gray-600">
                {paymentMethod === 'cod' ? 'Cash on Delivery' : `UPI Payment (${UPI_ID})`} · ₹{calculateTotal().toLocaleString()} INR
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping address</h3>
              <div className="text-gray-600">
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}{formData.apartment && `, ${formData.apartment}`}</p>
                <p>{formData.city}, {formData.state} {formData.pincode}</p>
                <p>India</p>
                <p>{formData.phone}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping method</h3>
              <p className="text-gray-600">
                {shippingMethod === 'free' ? 'Standard Shipping (Free)' : 'Express Shipping (₹99)'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order items</h3>
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
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

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-blue-900">Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI Payment'}</p>
                <p className="text-sm text-blue-800 mt-1">
                  {paymentMethod === 'cod'
                    ? 'Our team will contact you to confirm your order before dispatch.'
                    : `You paid/paid via UPI ID: ${UPI_ID}.` }
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add CSS for animation */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in-popup {
          animation: slideInFromRight 0.5s ease-out forwards;
        }
      `}</style>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Return to Shop</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Shipping Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <div className="max-w-xl mx-auto">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country/Region</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                      <option>India</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Gujarat</option>
                        <option>Tamil Nadu</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="PIN code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Mobile phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      required
                    />

                    {formData.phone.trim() !== '' && (
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        By signing up via text, you agree to receive recurring automated marketing messages,
                        including cart reminders, at the phone number provided. Consent is not a condition of purchase.
                        Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. Msg &amp; data rates
                        may apply. View our{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy policy
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms of service
                        </a>.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping method</h2>

                <div className={`border rounded-lg overflow-hidden ${shippingMethod === 'free' ? 'border-blue-500 ring-1 ring-blue-100 bg-white' : 'border-gray-300'}`}>
                  <label
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setShippingMethod('free')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'free'}
                        onChange={() => setShippingMethod('free')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                        style={{ marginLeft: '1rem' }}
                      />
                      <span className="font-medium text-gray-900 uppercase tracking-wide" style={{ height: '2.6rem', marginTop: '1rem', marginLeft: '0.7rem' }}>Shipping</span>
                    </div>

                    <span className="font-medium text-gray-900" style={{ marginRight: '1.3rem' }}>FREE</span>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment</h2>
                <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>

                <div className="space-y-3">
                  <div className={`rounded-lg overflow-hidden ${paymentMethod === 'upi' ? 'border border-blue-500 bg-blue-50 ring-1 ring-blue-100' : 'border border-gray-300'}`}>
                    <label className="flex items-center p-4 cursor-pointer" onClick={() => setPaymentMethod('upi')}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                        style={{ marginLeft: '1rem' }}
                      />
                      <div className="ml-1 font-medium text-gray-900 uppercase" style={{ height: '2.6rem', marginTop: '1rem', marginLeft: '0.7rem' }}>UPI PAYMENTS</div>
                    </label>

                    {paymentMethod === 'upi' && (
                      <div className="px-4 py-3 bg-white border-t text-sm text-gray-700">
                        <div className="font-medium mb-1">PLEASE PAY ON:</div>
                        <div className="break-words">{UPI_ID}</div>
                      </div>
                    )}
                  </div>

                  <div className={`rounded-lg overflow-hidden ${paymentMethod === 'cod' ? 'border border-blue-500 bg-blue-50 ring-1 ring-blue-100' : 'border border-gray-300'}`}>
                    <label className="flex items-center p-4 cursor-pointer" onClick={() => setPaymentMethod('cod')}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                        style={{ marginLeft: '1rem' }}
                      />
                      <div className="ml-1 font-medium text-gray-900" style={{ height: '2.6rem', marginTop: '1rem', marginLeft: '0.7rem' }}>Cash on Delivery (COD)</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing address</h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center p-4 rounded-lg cursor-pointer ${formData.billingSameAsShipping ? 'border border-blue-500 bg-blue-50 ring-1 ring-blue-100' : 'border border-gray-300'}`}
                    onClick={() => setFormData({ ...formData, billingSameAsShipping: true })}
                  >
                    <input
                      type="radio"
                      name="billingOption"
                      checked={formData.billingSameAsShipping}
                      readOnly
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                      style={{ marginLeft: '1rem' }}
                    />
                    <span className="text-gray-700" style={{ height: '2.6rem', marginTop: '1rem', marginLeft: '0.7rem' }}>Same as shipping address</span>
                  </label>

                  <label
                    className={`flex items-center p-4 rounded-lg cursor-pointer ${!formData.billingSameAsShipping ? 'border border-blue-500 bg-blue-50 ring-1 ring-blue-100' : 'border border-gray-300'}`}
                    onClick={() => setFormData({ ...formData, billingSameAsShipping: false })}
                  >
                    <input
                      type="radio"
                      name="billingOption"
                      checked={!formData.billingSameAsShipping}
                      readOnly
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                      style={{ marginLeft: '1rem' }}
                    />
                    <span className="text-gray-700" style={{ height: '2.6rem', marginTop: '1rem', marginLeft: '0.7rem' }}>Use a different billing address</span>
                  </label>

                  {!formData.billingSameAsShipping && (
                    <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200">
                      <input
                        type="text"
                        name="billingAddress"
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                        placeholder="Billing address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                      <input
                        type="text"
                        name="billingApartment"
                        value={formData.billingApartment}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, etc. (optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <input
                          type="text"
                          name="billingCity"
                          value={formData.billingCity}
                          onChange={handleInputChange}
                          placeholder="City"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <select
                          name="billingState"
                          value={formData.billingState}
                          onChange={handleInputChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>Maharashtra</option>
                          <option>Delhi</option>
                          <option>Karnataka</option>
                          <option>Gujarat</option>
                          <option>Tamil Nadu</option>
                        </select>
                        <input
                          type="text"
                          name="billingPincode"
                          value={formData.billingPincode}
                          onChange={handleInputChange}
                          placeholder="PIN code"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-900">Payment Method</p>
                    <p className="text-sm text-blue-800 mt-1">
                      {paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD) available. Pay when you receive your order.'
                        : 'UPI Payment available. You will be redirected to UPI payment gateway.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCompleteOrder}
                  className="flex-1 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Complete order
                </button>

                <button
                  onClick={onCancel}
                  className="py-4 px-6 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ← Back to cart
                </button>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center gap-6 text-sm">
                  <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'refund-policy' }))} className="text-blue-600 hover:underline">
                    Refund policy
                  </button>
                  <button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy-policy' }))} className="text-blue-600 hover:underline">
                    Privacy policy
                  </button>
                  <button onClick={() => setPolicy('contact')} className="text-blue-600 hover:underline">
                    Contact
                  </button>
                </div>
              </div>

              {policy && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center"
                  aria-modal="true"
                  role="dialog"
                >
                  <div className="absolute inset-0 bg-black/40" onClick={() => setPolicy(null)} />

                  <div className="relative bg-white w-full max-w-lg mx-4 rounded-xl shadow-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {policy === 'privacy' && 'Privacy policy'}
                        {policy === 'contact' && 'Contact'}
                      </h3>
                      <button
                        onClick={() => setPolicy(null)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="text-sm text-gray-700 space-y-3 max-h-80 overflow-y-auto">
                      {policy === 'privacy' && (
                        <>
                          <p>We collect only the data needed to fulfill your order and improve our service.</p>
                          <p>Your information is never sold. You can request data deletion or export anytime.</p>
                          <p>For full details, email us and we'll share our complete privacy notice.</p>
                        </>
                      )}

                      {policy === 'contact' && (
                        <>
                          <p>Questions? We're here.</p>
                          <p>Email: <a className="text-blue-600 hover:underline" href="mailto:support@example.com">support@example.com</a></p>
                          <p>Phone: +91 90000 00000 (Mon–Sat, 10am–6pm IST)</p>
                          <p>We typically respond within 24 hours.</p>
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setPolicy(null)}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 h-fit sticky top-8">
              <div className="max-w-xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                <div className="mb-6">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
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

                {/* Discount Input */}
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={discountApplied}
                  />
                  <button 
                    onClick={applyDiscount}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                      discountApplied 
                        ? 'bg-gray-100 text-green-700 cursor-default' 
                        : 'bg-gray-100 text-gray-700 hover:bg-black hover:text-white hover:shadow-md hover:-translate-y-0.5'
                    }`}
                    disabled={discountApplied}
                  >
                    {discountApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>

                <div className="space-y-4 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{orderData.total.toLocaleString()}</span>
                  </div>
                  
                  {/* Show discount if applied */}
                  {discountApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount (SAVE20)</span>
                      <span className="font-medium text-green-600">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shippingMethod === 'free' ? 'FREE' : '₹99'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-900">₹{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-4">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center mt-6 text-sm text-gray-500" style = {{marginTop: '1rem'}}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout
                </div>
              </div>
            </div>

            {/* Animated Popup - Auto-shows on page load */}
            {showPopup && (
              <div className="slide-in-popup mt-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl shadow-2xl p-6 border-4 border-white">
                <div className="relative">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-lg font-bold flex items-center justify-center"
                    aria-label="Close popup"
                  >
                    ✕
                  </button>

                  <div className="text-center text-white" style={{ marginTop: '-2rem' }}>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce" style={{ marginBottom: '11.9rem', zIndex: '10' , marginLeft : '6rem' }}>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
                    <h3 className="text-2xl font-bold mb-2 text-black">Special Offer!</h3>
                    <p className="text-lg mb-4 opacity-90 text-black">
                      Get 20% OFF on your next purchase!
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold mb-2 text-black">Use code:</p>
                      <div className="bg-white text-purple-600 font-mono font-bold text-xl py-2 px-4 rounded-lg inline-block">
                        SAVE20
                      </div>
                    </div>
                    <p className="text-sm opacity-75 text-black">Valid for 24 hours only!</p>
                    
                    <button
                      onClick={() => setShowPopup(false)}
                      className="mt-4 w-full py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
                    >
                      Claim Offer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}