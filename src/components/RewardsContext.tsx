import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface RewardAction {
  id: string;
  type: 'earn' | 'redeem';
  action: string;
  points: number;
  date: string;
  description: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'coupon' | 'discount' | 'freebie';
  value: number;
  icon: string;
}

interface UserRewards {
  userId: string;
  totalPoints: number;
  lifetimePoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  actions: RewardAction[];
  referralCode: string;
  referrals: number;
}

interface RewardsContextType {
  userRewards: UserRewards | null;
  earnPoints: (action: string, points: number, description: string) => void;
  redeemReward: (reward: Reward) => boolean;
  getAvailableRewards: () => Reward[];
  getEarnActions: () => { action: string; points: number; icon: string }[];
  generateReferralCode: () => string;
  applyReferralCode: (code: string) => boolean;
  openRewardsWindow: () => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

const STORAGE_KEY = 'thread_trends_rewards';

// Ways to earn points
const EARN_ACTIONS = [
  { action: 'Place an order', points: 200, icon: '🛍️' },
  { action: 'Follow on Instagram', points: 300, icon: '📸' },
  { action: 'Sign up', points: 500, icon: '👋' },
  { action: 'Birthday bonus', points: 1000, icon: '🎂' },
  { action: 'Write a review', points: 150, icon: '⭐' },
  { action: 'Share on social media', points: 100, icon: '🔗' },
  { action: 'Referral (friend purchases)', points: 500, icon: '🎁' },
];

// Available rewards
const AVAILABLE_REWARDS: Reward[] = [
  {
    id: 'reward-1',
    name: '₹100 off coupon',
    description: 'Use on your next purchase',
    points: 500,
    type: 'coupon',
    value: 100,
    icon: '🎫'
  },
  {
    id: 'reward-2',
    name: '₹200 off coupon',
    description: 'Use on orders above ₹1000',
    points: 1000,
    type: 'coupon',
    value: 200,
    icon: '🎫'
  },
  {
    id: 'reward-3',
    name: '₹500 off coupon',
    description: 'Use on orders above ₹2000',
    points: 2500,
    type: 'coupon',
    value: 500,
    icon: '🎫'
  },
  {
    id: 'reward-4',
    name: 'Free shipping',
    description: 'Free delivery on next order',
    points: 300,
    type: 'discount',
    value: 0,
    icon: '🚚'
  },
  {
    id: 'reward-5',
    name: 'Mystery gift',
    description: 'Surprise gift with your order',
    points: 1500,
    type: 'freebie',
    value: 0,
    icon: '🎁'
  },
];

export function RewardsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [rewardsWindow, setRewardsWindow] = useState<Window | null>(null);

  // Initialize or load user rewards
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        setUserRewards(JSON.parse(stored));
      } else {
        // Initialize new rewards account
        const newRewards: UserRewards = {
          userId: user.id,
          totalPoints: 500, // Welcome bonus
          lifetimePoints: 500,
          tier: 'Bronze',
          actions: [
            {
              id: Date.now().toString(),
              type: 'earn',
              action: 'Sign up',
              points: 500,
              date: new Date().toISOString(),
              description: 'Welcome bonus for joining Thread Trends!'
            }
          ],
          referralCode: generateReferralCode(),
          referrals: 0
        };
        setUserRewards(newRewards);
        localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(newRewards));
      }
    } else {
      setUserRewards(null);
    }
  }, [user]);

  // Save rewards whenever they change
  useEffect(() => {
    if (userRewards && user) {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(userRewards));
    }
  }, [userRewards, user]);

  // Listen for rewards updates from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'REWARDS_UPDATED') {
        setUserRewards(event.data.rewards);
      } else if (event.data.type === 'REWARDS_CLOSED') {
        setUserRewards(event.data.rewards);
        setRewardsWindow(null);
      } else if (event.data.type === 'ORDER_PLACED' && event.data.order) {
        // Award points for placing an order
        const order = event.data.order;
        earnPoints('Place an order', 200, `Order #${order.orderNumber} - ₹${order.total.toLocaleString()}`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [rewardsWindow]);

  const generateReferralCode = (): string => {
    return `TT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const calculateTier = (lifetimePoints: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' => {
    if (lifetimePoints >= 10000) return 'Platinum';
    if (lifetimePoints >= 5000) return 'Gold';
    if (lifetimePoints >= 2000) return 'Silver';
    return 'Bronze';
  };

  const earnPoints = (action: string, points: number, description: string) => {
    if (!userRewards) return;

    const newAction: RewardAction = {
      id: Date.now().toString(),
      type: 'earn',
      action,
      points,
      date: new Date().toISOString(),
      description
    };

    const newLifetimePoints = userRewards.lifetimePoints + points;

    setUserRewards({
      ...userRewards,
      totalPoints: userRewards.totalPoints + points,
      lifetimePoints: newLifetimePoints,
      tier: calculateTier(newLifetimePoints),
      actions: [newAction, ...userRewards.actions]
    });
  };

  const redeemReward = (reward: Reward): boolean => {
    if (!userRewards) return false;

    if (userRewards.totalPoints < reward.points) {
      return false; // Not enough points
    }

    const newAction: RewardAction = {
      id: Date.now().toString(),
      type: 'redeem',
      action: reward.name,
      points: reward.points,
      date: new Date().toISOString(),
      description: `Redeemed: ${reward.description}`
    };

    setUserRewards({
      ...userRewards,
      totalPoints: userRewards.totalPoints - reward.points,
      actions: [newAction, ...userRewards.actions]
    });

    return true;
  };

  const getAvailableRewards = (): Reward[] => {
    return AVAILABLE_REWARDS;
  };

  const getEarnActions = () => {
    return EARN_ACTIONS;
  };

  const applyReferralCode = (code: string): boolean => {
    // Find the user who owns this referral code
    // In a real app, this would be a server call
    if (code && code.startsWith('TT')) {
      // Award points to both users
      earnPoints('Referral', 500, 'Friend joined using your referral code!');
      return true;
    }
    return false;
  };

  const openRewardsWindow = () => {
    const width = 500;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      '/rewards.html',
      'Thread Trends Rewards',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    setRewardsWindow(popup);
    
    // Focus the popup
    if (popup) {
      popup.focus();
    }
  };

  return (
    <RewardsContext.Provider
      value={{
        userRewards,
        earnPoints,
        redeemReward,
        getAvailableRewards,
        getEarnActions,
        generateReferralCode,
        applyReferralCode,
        openRewardsWindow
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}
