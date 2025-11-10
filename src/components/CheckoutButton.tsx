import { useState } from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from './CartContext';
import { useRewards } from './RewardsContext';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export function CheckoutButton() {
  const { user } = useAuth();
  const { cart, getCartTotal, checkout } = useCart();
  const { earnPoints } = useRewards();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    // Simulate checkout process
    setTimeout(() => {
      const total = getCartTotal();
      const success = checkout();

      if (success) {
        // Award 200 points for placing an order
        earnPoints('Place an order', 200, `Order total: ₹${total.toLocaleString()}`);
        
        toast.success(
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="font-bold">Order placed successfully!</div>
              <div className="text-sm">You earned 200 points! 🎉</div>
            </div>
          </div>
        );
      }

      setIsProcessing(false);
    }, 1500);
  };

  if (!user || cart.length === 0) return null;

  return (
    <button
      onClick={handleCheckout}
      disabled={isProcessing}
      className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isProcessing ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          Checkout • ₹{getCartTotal().toLocaleString()}
        </>
      )}
    </button>
  );
}
