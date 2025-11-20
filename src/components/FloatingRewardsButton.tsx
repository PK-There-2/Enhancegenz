import { useState } from 'react';
import { Gift } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useRewards } from './RewardsContext';

interface FloatingRewardsButtonProps {
  onNavigate?: (page: 'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout' | 'refund-policy' | 'privacy-policy' | 'refund-policy-footer' | 'privacy-policy-footer' | 'contact-page' | 'login' | 'rewards') => void;
}

export function FloatingRewardsButton({ onNavigate }: FloatingRewardsButtonProps = {}) {
  const { user } = useAuth();
  const { userRewards } = useRewards();
  const [isPulsing, setIsPulsing] = useState(true);

  // Only show for logged-in users
  if (!user) return null;

  const handleClick = () => {
    setIsPulsing(false);
    // Navigate to rewards page
    if (onNavigate) {
      onNavigate('rewards');
    } else {
      // Fallback: dispatch navigation event
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'rewards' }));
    }
  };

  return (
    <>
      {/* Floating Rewards Button */}
      <div style={{ position: 'fixed', bottom: '32px', left: '32px', zIndex: 9999 }} className="flex items-end gap-4">
        <button
          onClick={handleClick}
          className="relative flex items-center gap-3 px-8 py-4 bg-pink-500 text-white rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
          style={{ 
            background: 'linear-gradient(135deg, #F5C6C6 0%, #F5C6C6 100%)',
          }}
        >
          {/* Animated Ring */}
          {isPulsing && (
            <div className="absolute inset-0 rounded-full bg-pink-400 animate-ping opacity-75" />
          )}
          
          {/* Button Content */}
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <Gift className="w-6 h-6" />
              {userRewards && userRewards.totalPoints > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-5 text-black rounded-full flex items-center justify-center text-xs font-bold">
                  {userRewards.totalPoints > 99 ? '99+' : userRewards.totalPoints}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-wide text-black">Rewards</span>
              {userRewards && (
                <span className="text-xs text-black opacity-90">{userRewards.totalPoints} points</span>
              )}
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
