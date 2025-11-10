import { useState } from 'react';
import { X, Gift, Award, TrendingUp, Users, ChevronRight, ChevronLeft, Copy, Check, Sparkles, CheckCircle } from 'lucide-react';
import { useRewards } from './RewardsContext';
import { useAuth } from './AuthContext';
import { Portal } from './Portal'; // Import Portal

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = 'home' | 'earn' | 'redeem' | 'referrals' | 'history';

export function RewardsModal({ isOpen, onClose }: RewardsModalProps) {
  const { user } = useAuth();
  const { userRewards, getAvailableRewards, getEarnActions, redeemReward } = useRewards();
  const [currentView, setCurrentView] = useState<View>('home');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !user) return null;

  const rewards = getAvailableRewards();
  const earnActions = getEarnActions();

  const copyReferralCode = () => {
    if (userRewards?.referralCode) {
      navigator.clipboard.writeText(userRewards.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleRedeemReward = (reward: any) => {
    const success = redeemReward(reward);
    if (success) {
      alert(`Successfully redeemed ${reward.name}! Check your email for the coupon code.`);
    } else {
      alert('Not enough points to redeem this reward.');
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'from-purple-400 to-purple-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Silver': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to
        </h2>
        <h1 className="text-2xl font-bold text-gray-900">
          Thread Trends Loyalty Program
        </h1>
      </div>

      {/* Points Display */}
      <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-center shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-6 h-6 text-white/90" />
            <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Your Balance</span>
          </div>
          <div className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
            {userRewards?.totalPoints || 0}
          </div>
          <div className="text-sm text-white/80 font-medium mb-4">Points</div>
          
          {/* Tier Badge */}
          <div className="mt-6">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm ${getTierColor(userRewards?.tier || 'Bronze')} text-white font-bold text-sm shadow-lg`}>
              <TrendingUp className="w-4 h-4" />
              {userRewards?.tier || 'Bronze'} Member
            </div>
          </div>
        </div>
      </div>

      {/* Become a Member CTA */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Welcome to Rewards!
            </h3>
            <p className="text-gray-600 mb-3 text-sm leading-relaxed">
              With more ways to unlock exciting perks, this is your all access pass to exclusive rewards.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>You're all set!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Points Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Points</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Earn more Points for different actions, and turn those Points into awesome rewards!
        </p>

        {/* Ways to earn */}
        <button
          onClick={() => setCurrentView('earn')}
          className="w-full flex items-center justify-between p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all mb-3 shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-bold text-gray-900 block">Ways to earn</span>
              <span className="text-xs text-gray-500">Start earning points</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
        </button>

        {/* Ways to redeem */}
        <button
          onClick={() => setCurrentView('redeem')}
          className="w-full flex items-center justify-between p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-400 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-bold text-gray-900 block">Ways to redeem</span>
              <span className="text-xs text-gray-500">Claim your rewards</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
        </button>
      </div>

      {/* Referrals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Referrals</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Give your friends a reward and claim your own when they make a purchase.
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Gift className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <div className="font-medium text-gray-900">They get</div>
              <div className="text-green-600 font-semibold">₹200 off coupon</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Gift className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <div className="font-medium text-gray-900">You get</div>
              <div className="text-blue-600 font-semibold">500 Points</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('referrals')}
          className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
        >
          View Referral Details
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Award className="w-4 h-4" />
          <span>We reward with Smile</span>
        </div>
      </div>
    </div>
  );

  const renderEarn = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Ways to earn</h2>
      </div>

      <div className="space-y-3">
        {earnActions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform">{action.icon}</div>
              <span className="font-semibold text-gray-900">{action.action}</span>
            </div>
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-sm">
              +{action.points}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-50 rounded-lg p-4 text-center">
        <p className="text-purple-900 font-medium">
          Join now for free to start earning
        </p>
      </div>
    </div>
  );

  const renderRedeem = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Ways to redeem</h2>
      </div>

      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-center mb-6 shadow-lg">
        <div className="text-sm text-white/90 mb-2 font-medium">Your Points Balance</div>
        <div className="text-4xl font-extrabold text-white">{userRewards?.totalPoints || 0}</div>
        <div className="text-sm text-white/80 mt-1">Available Points</div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const canRedeem = (userRewards?.totalPoints || 0) >= reward.points;
          
          return (
            <div
              key={reward.id}
              className={`p-5 bg-white rounded-xl border-2 transition-all ${
                canRedeem 
                  ? 'border-green-300 hover:border-green-400 hover:shadow-lg' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-5xl">{reward.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{reward.name}</h3>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-pink-600">{reward.points}</span>
                  <span className="text-sm text-gray-500">Points</span>
                </div>
                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canRedeem}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                    canRedeem
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-md transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? 'Redeem Now' : 'Not enough points'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Referrals</h2>
      </div>

      <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 mb-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 tracking-wider font-mono">
                {userRewards?.referralCode}
              </div>
              <button
                onClick={copyReferralCode}
                className={`p-3 rounded-xl transition-all ${
                  copiedCode 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {copiedCode ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            {copiedCode && (
              <p className="text-sm text-green-600 mt-2 font-medium text-center">Code copied!</p>
            )}
          </div>

          <div className="text-center">
            <div className="text-sm text-white/90 mb-1">Total Referrals</div>
            <div className="text-3xl font-extrabold text-white">{userRewards?.referrals || 0}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-3">How it works</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Share your code</p>
              <p className="text-sm text-gray-600">Send your unique referral code to friends</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">They get rewarded</p>
              <p className="text-sm text-gray-600">Your friend gets ₹200 off their first order</p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">You earn points</p>
              <p className="text-sm text-gray-600">You get 500 points when they make a purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Gift className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-green-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-green-800">
              Share on social media or send directly via WhatsApp to maximize your referrals!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Points History</h2>
      </div>

      <div className="space-y-3">
        {userRewards?.actions.slice(0, 10).map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-pink-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                action.type === 'earn' 
                  ? 'bg-green-100' 
                  : 'bg-red-100'
              }`}>
                {action.type === 'earn' ? (
                  <TrendingUp className={`w-6 h-6 ${action.type === 'earn' ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <Gift className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{action.action}</div>
                <div className="text-sm text-gray-600 mt-1">{action.description}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(action.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className={`text-2xl font-extrabold ${action.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
              {action.type === 'earn' ? '+' : '-'}{action.points}
            </div>
          </div>
        ))}
        {(!userRewards?.actions || userRewards.actions.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>No activity yet. Start earning points!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Portal>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-pink-100/50 animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-6 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Thread Trends Loyalty
              </h2>
            </div>
            <button
              onClick={onClose}
              className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white/50 backdrop-blur-sm">
            {currentView === 'home' && renderHome()}
            {currentView === 'earn' && renderEarn()}
            {currentView === 'redeem' && renderRedeem()}
            {currentView === 'referrals' && renderReferrals()}
            {currentView === 'history' && renderHistory()}
          </div>

          {/* Bottom Navigation (for home view) */}
          {currentView === 'home' && (
            <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4 flex-shrink-0">
              <button
                onClick={() => setCurrentView('history')}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-900 font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                View Points History
              </button>
            </div>
          )}
        </div>
        
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>
      </div>
    </Portal>
  );
}
