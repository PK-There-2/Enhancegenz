import { useState } from 'react';
import { X, Gift, Award, TrendingUp, Users, ChevronRight, ChevronLeft, Copy, Check, Sparkles, CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { useRewards } from './RewardsContext';
import { useAuth } from './AuthContext';

interface RewardsPageProps {
  onBack: () => void;
}

type View = 'home' | 'earn' | 'redeem' | 'referrals' | 'history';

export function RewardsPage({ onBack }: RewardsPageProps) {
  const { user } = useAuth();
  const { userRewards, getAvailableRewards, getEarnActions, redeemReward } = useRewards();
  const [currentView, setCurrentView] = useState<View>('home');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access rewards</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

  const getTierColors = (tier: string) => {
    const tierLower = tier.toLowerCase();
    if (tierLower === 'gold') {
      return { bg: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600', text: 'text-white', icon: 'text-white' };
    } else if (tierLower === 'silver') {
      return { bg: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500', text: 'text-gray-900', icon: 'text-gray-900' };
    } else { // bronze
      return { bg: 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600', text: 'text-white', icon: 'text-white' };
    }
  };

  const tierColors = getTierColors(userRewards?.tier || 'Bronze');

  const renderHome = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-8 border-b-2 border-gray-300 mb-8" style={{ marginTop: '-40px' }}>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
          Welcome to Thread Trends
        </h1>
        <h2 className="text-3xl font-bold text-gray-800">
          Loyalty Program
        </h2>
      </div>

      {/* Points Display */}
      <div className="relative bg-black rounded-2xl p-8 text-center shadow-2xl overflow-hidden border-2 border-gray-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-600/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gray-700/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-gray-700/30 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-7 h-7 text-white" />
            <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Your Balance</span>
          </div>
          <div className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg">
            {userRewards?.totalPoints || 0}
          </div>
          <div className="text-sm text-white font-medium mb-4">Points</div>
          
          {/* Tier Badge */}
          <div className="mt-6">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${tierColors.bg} ${tierColors.text} font-bold text-sm shadow-xl border-2 border-white hover:shadow-2xl hover:scale-105 transition-all`}>
              <TrendingUp className={`w-5 h-5 ${tierColors.icon}`} />
              {userRewards?.tier || 'Bronze'} Member
            </div>
          </div>
        </div>
      </div>

      {/* Become a Member CTA */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md p-2.5 border-2 border-gray-200">
            <Sparkles className="w-7 h-7 text-black" />
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
      <div className="mt-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
            <Award className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Points</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          Earn more Points for different actions, and turn those Points into awesome rewards!
        </p>

        {/* Ways to earn */}
        <button
          onClick={() => setCurrentView('earn')}
          className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black hover:shadow-2xl transition-all mb-4 shadow-md group hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md p-3">
              <Gift className="w-8 h-8 text-black" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 block text-base mb-1">Ways to earn</div>
              <div className="text-sm text-gray-500">Start earning points</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </button>

        {/* Ways to redeem */}
        <button
          onClick={() => setCurrentView('redeem')}
          className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black hover:shadow-2xl transition-all shadow-md group hover:scale-[1.02]"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md p-3">
              <Award className="w-8 h-8 text-black" />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900 block text-base mb-1">Ways to redeem</div>
              <div className="text-sm text-gray-500">Claim your rewards</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </button>
      </div>

      {/* Referrals */}
      <div className="mt-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
            <Users className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Referrals</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed text-base">
          Give your friends a reward and claim your own when they make a purchase.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 p-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-lg mb-1">They get</div>
              <div className="text-green-600 font-extrabold text-2xl">₹200 off coupon</div>
              <p className="text-sm text-gray-600 mt-1">On their first order</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 p-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900 text-lg mb-1">You get</div>
              <div className="text-blue-600 font-extrabold text-2xl">500 Points</div>
              <p className="text-sm text-gray-600 mt-1">When they make a purchase</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('referrals')}
          className="w-full py-4 px-6 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
        >
          <span className="flex items-center justify-center gap-2.5">
            <Users className="w-5 h-5 text-white" />
            View Referral Details
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 mt-8 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Award className="w-4 h-4" />
          <span>We reward with Smile</span>
        </div>
      </div>
    </div>
  );

  const renderEarn = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
            <Gift className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ways to earn</h2>
        </div>
      </div>

      <div className="space-y-4">
        {earnActions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-black hover:shadow-2xl transition-all shadow-md hover:scale-[1.02]"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{action.icon}</div>
              <span className="font-bold text-gray-900 text-base">{action.action}</span>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              +{action.points}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200 shadow-md mt-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-black" />
          <p className="text-gray-900 font-bold text-base">
            Join now for free to start earning
          </p>
        </div>
        <p className="text-sm text-gray-600">Complete actions to earn points and unlock rewards</p>
      </div>
    </div>
  );

  const renderRedeem = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md p-2">
            <Award className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ways to redeem</h2>
        </div>
      </div>

      {/* Points Balance Card - Matching main page style */}
      <div className="relative bg-black rounded-2xl p-8 text-center shadow-2xl overflow-hidden border-2 border-gray-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-600/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-gray-700/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-gray-700/30 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-6 h-6 text-white" />
            <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">Available to Redeem</span>
          </div>
          <div className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">{userRewards?.totalPoints || 0}</div>
          <div className="text-sm text-white/80 font-medium">Points</div>
        </div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const canRedeem = (userRewards?.totalPoints || 0) >= reward.points;
          
          return (
            <div
              key={reward.id}
              className={`p-6 bg-white rounded-2xl border-2 transition-all shadow-md ${
                canRedeem 
                  ? 'border-green-300 hover:border-green-400 hover:shadow-2xl hover:scale-[1.02]' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-5xl">{reward.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{reward.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{reward.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 mt-4">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-gray-900">{reward.points}</span>
                  <span className="text-sm text-gray-500 font-medium">Points</span>
                </div>
                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canRedeem}
                  className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                    canRedeem
                      ? 'bg-black text-white hover:bg-gray-900 hover:shadow-2xl hover:scale-105 active:scale-95'
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

      {/* Info Footer */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl p-6 border-2 border-gray-200 shadow-md mt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-md p-2.5 border-2 border-gray-200">
            <Gift className="w-7 h-7 text-black" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1 text-base">Redeem your rewards</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Use your points to unlock exclusive discounts and special offers. More rewards coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
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
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 mb-5 shadow-lg">
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

      <div className="mt-6">
        <h3 className="font-bold text-gray-900 mb-4">How it works</h3>
        <div className="space-y-4">
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

      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5 mt-6">
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
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Points History</h2>
      </div>

      <div className="space-y-4">
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
                <div className="font-bold text-gray-900 mb-1">{action.action}</div>
                <div className="text-sm text-gray-600 mt-2 leading-relaxed">{action.description}</div>
                <div className="text-xs text-gray-400 mt-3">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-6 sm:py-8">
      {/* Back to Home Button - Fixed */}

      <button
        onClick={onBack}
        className="back-to-home-button"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2.5rem',
          zIndex: '50',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 2rem',
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '9999px',
          boxShadow: '0 10px 15px -3px rgba(18, 18, 18, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 30px 35px -5px rgba(68, 0, 255, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(86, 104, 183, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="max-w-2xl mx-auto mt-16">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-900 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-700/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-800/30 to-transparent rounded-full blur-3xl"></div>
            
           
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 pt-2 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {currentView === 'home' && renderHome()}
            {currentView === 'earn' && renderEarn()}
            {currentView === 'redeem' && renderRedeem()}
            {currentView === 'referrals' && renderReferrals()}
            {currentView === 'history' && renderHistory()}
          </div>

          {/* Bottom Navigation (for home view) */}
          {currentView === 'home' && (
            <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t-2 border-gray-200 p-4 sm:p-6">
              <button
                onClick={() => setCurrentView('history')}
                className="w-full py-4 px-6 bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2.5">
                  <TrendingUp className="w-5 h-5 text-white" />
                  View Points History
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}