# 🎁 Thread Trends Loyalty Rewards System - User Guide

## Quick Overview

A complete loyalty rewards system where customers earn points for purchases and activities, then redeem them for discounts and perks.

---

## ✨ Features Implemented

### 1. **Points System**
- Earn points for various activities
- Redeem points for rewards
- Track lifetime points
- Tier-based membership (Bronze, Silver, Gold, Platinum)

### 2. **Ways to Earn Points**
- 🛍️ Place an order: **200 points**
- 📸 Follow on Instagram: **300 points**
- 👋 Sign up: **500 points** (welcome bonus)
- 🎂 Birthday bonus: **1000 points**
- ⭐ Write a review: **150 points**
- 🔗 Share on social media: **100 points**
- 🎁 Referral (friend purchases): **500 points**

### 3. **Ways to Redeem**
- ₹100 off coupon: **500 points**
- ₹200 off coupon: **1000 points**
- ₹500 off coupon: **2500 points**
- Free shipping: **300 points**
- Mystery gift: **1500 points**

### 4. **Referral Program**
- **Your friend gets**: ₹200 off coupon
- **You get**: 500 points when they purchase
- Unique referral code for each user
- Easy sharing via social media

### 5. **Membership Tiers**
- **Bronze**: 0-1,999 lifetime points
- **Silver**: 2,000-4,999 lifetime points
- **Gold**: 5,000-9,999 lifetime points
- **Platinum**: 10,000+ lifetime points

---

## 🚀 How to Use (Customer Guide)

### Accessing the Rewards Program

1. **Sign in** to your account
2. Look for the **"Rewards"** button in the header (pink/purple gradient button)
3. Click to open the Loyalty Program modal

### Earning Points

#### Automatic Points
- Points are **automatically awarded** when you:
  - Complete a purchase (200 points)
  - Sign up for an account (500 points welcome bonus)

#### Manual Activities
Admin can manually award points for:
- Following on Instagram
- Writing reviews
- Sharing on social media
- Birthday bonuses

### Viewing Your Balance

Your current point balance is displayed:
1. On the **Rewards button** in the header
2. Inside the **Rewards modal** (big number display)
3. With your **membership tier** badge

### Redeeming Rewards

1. Open the **Rewards modal**
2. Click **"Ways to redeem"**
3. Browse available rewards
4. Click **"Redeem"** on any reward you can afford
5. Rewards are instant - you'll get a confirmation

### Using Your Referral Code

1. Open **Rewards modal**
2. Go to **"Referrals"** section
3. **Copy** your unique code
4. **Share** with friends via:
   - WhatsApp
   - Social media
   - Email
   - Direct message

5. When your friend:
   - Signs up using your code
   - Makes a purchase
   - **You both get rewards!**

### Tracking Your History

1. Open **Rewards modal**
2. Click **"View Points History"** at the bottom
3. See all earned and redeemed points
4. Track your activity over time

---

## 🔧 How It Works (Technical)

### System Architecture

```
RewardsContext (State Management)
    ↓
RewardsModal (UI Component)
    ↓
Integration Points:
- Header (Rewards Button)
- Cart/Checkout (Auto Point Award)
- AuthContext (User Tracking)
```

### Key Files

1. **`RewardsContext.tsx`** - State management & logic
2. **`RewardsModal.tsx`** - User interface
3. **`Header.tsx`** - Rewards button integration
4. **`CheckoutButton.tsx`** - Auto point awarding on purchase

### Data Storage

- **LocalStorage** based (no backend required)
- Per-user storage: `thread_trends_rewards_{userId}`
- Persists across sessions
- Includes:
  - Total points
  - Lifetime points
  - Transaction history
  - Referral code
  - Membership tier

### Point Calculation

```typescript
// Earning points
earnPoints(action, points, description) => {
  totalPoints += points
  lifetimePoints += points
  tier = calculateTier(lifetimePoints)
}

// Redeeming rewards
redeemReward(reward) => {
  if (totalPoints >= reward.points) {
    totalPoints -= reward.points
    return success
  }
}

// Tier calculation
calculateTier(lifetimePoints) => {
  if (>=10000) return 'Platinum'
  if (>=5000) return 'Gold'
  if (>=2000) return 'Silver'
  return 'Bronze'
}
```

---

## 🎨 Customization

### Adding New Earn Actions

Edit `RewardsContext.tsx`:

```typescript
const EARN_ACTIONS = [
  { action: 'Your new action', points: 100, icon: '🎯' },
  // ... existing actions
];
```

### Adding New Rewards

Edit `RewardsContext.tsx`:

```typescript
const AVAILABLE_REWARDS: Reward[] = [
  {
    id: 'reward-new',
    name: 'Your new reward',
    description: 'Description',
    points: 1000,
    type: 'coupon',
    value: 150,
    icon: '🎁'
  },
  // ... existing rewards
];
```

### Changing Tier Thresholds

Edit `calculateTier()` function in `RewardsContext.tsx`:

```typescript
const calculateTier = (lifetimePoints: number) => {
  if (lifetimePoints >= 20000) return 'Platinum'; // New threshold
  if (lifetimePoints >= 10000) return 'Gold';
  // ... etc
};
```

### Customizing Colors

Rewards button in `Header.tsx`:

```typescript
className="bg-gradient-to-r from-pink-500 to-purple-500..."
// Change colors as needed
```

Modal header in `RewardsModal.tsx`:

```typescript
className="bg-pink-200..." // Change pink-200 to your color
```

---

## 💻 Developer Integration

### Manual Point Award Example

```typescript
import { useRewards } from './components/RewardsContext';

function YourComponent() {
  const { earnPoints } = useRewards();
  
  const handleSocialShare = () => {
    // User shared on social media
    earnPoints(
      'Share on social media',
      100,
      'Shared product on Instagram'
    );
  };
}
```

### Custom Checkout Integration

```typescript
import { useRewards } from './components/RewardsContext';
import { useCart } from './components/CartContext';

function CustomCheckout() {
  const { earnPoints } = useRewards();
  const { checkout, getCartTotal } = useCart();
  
  const handlePurchase = () => {
    const total = getCartTotal();
    checkout();
    
    // Award points based on order total
    const points = Math.floor(total / 10); // 1 point per ₹10
    earnPoints(
      'Place an order',
      points,
      `Order total: ₹${total}`
    );
  };
}
```

### Checking User Tier

```typescript
import { useRewards } from './components/RewardsContext';

function TierBenefits() {
  const { userRewards } = useRewards();
  
  if (userRewards?.tier === 'Platinum') {
    // Show platinum-exclusive features
  }
}
```

---

## 📊 Admin Features

### Viewing Customer Rewards

Currently stored in browser localStorage. To view:

1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Find keys starting with `thread_trends_rewards_`
4. Each key represents a user's rewards data

### Manual Point Adjustment

To manually adjust points, create an admin function:

```typescript
// In RewardsContext
const adjustPoints = (amount: number, reason: string) => {
  if (!userRewards) return;
  
  setUserRewards({
    ...userRewards,
    totalPoints: userRewards.totalPoints + amount,
    lifetimePoints: Math.max(0, userRewards.lifetimePoints + amount)
  });
};
```

---

## 🐛 Troubleshooting

### Points Not Appearing

**Issue**: Points awarded but not showing in UI

**Solution**:
1. Check if user is logged in
2. Refresh the page
3. Clear browser cache
4. Check localStorage for user data

### Rewards Modal Not Opening

**Issue**: Clicking Rewards button does nothing

**Solution**:
1. Check if user is logged in (button only shows for logged-in users)
2. Check browser console for errors
3. Ensure `RewardsProvider` wraps the app in `App.tsx`

### Can't Redeem Rewards

**Issue**: Redeem button disabled or doesn't work

**Solution**:
1. Check if you have enough points
2. Ensure reward points requirement is met
3. Check browser console for errors

### Referral Code Not Working

**Issue**: Applying referral code doesn't award points

**Solution**:
1. Ensure code starts with "TT"
2. Check if friend completed purchase
3. Currently referral system is simplified - enhance in backend for production

---

## 🚀 Future Enhancements

### Recommended Features to Add

1. **Backend Integration**
   - Store rewards in database
   - Sync across devices
   - Admin dashboard for management

2. **Email Notifications**
   - Points earned notifications
   - Reward redemption confirmations
   - Tier upgrade congratulations

3. **Advanced Referrals**
   - Track referral conversions
   - Multi-tier referral bonuses
   - Referral leaderboard

4. **Gamification**
   - Daily login bonuses
   - Achievement badges
   - Streak rewards
   - Challenges & missions

5. **Expiring Points**
   - Points validity period
   - Expiration warnings
   - Points rollover rules

6. **Tier Benefits**
   - Exclusive discounts per tier
   - Early access to sales
   - Free shipping thresholds
   - Birthday multipliers

---

## 📱 Mobile Experience

The rewards system is fully responsive:

- ✅ Rewards button adapts to mobile
- ✅ Modal optimized for small screens
- ✅ Touch-friendly interactions
- ✅ Smooth animations

---

## 🎯 Success Metrics to Track

1. **Engagement**
   - % of users with rewards accounts
   - Average points earned per user
   - Redemption rate

2. **Retention**
   - Repeat purchase rate
   - Time between purchases
   - User lifetime value

3. **Growth**
   - Referral conversion rate
   - New users from referrals
   - Social shares generated

---

## 📞 Support

### Common User Questions

**Q: How do I earn points?**
A: Points are earned automatically on purchases, plus manual activities like social follows and reviews.

**Q: Do points expire?**
A: Currently, points don't expire. Future versions may add expiration policies.

**Q: Can I transfer points?**
A: No, points are non-transferable between accounts.

**Q: What happens to my tier if I redeem points?**
A: Your tier is based on lifetime points earned, not current balance. Redeeming doesn't affect your tier.

---

## ✅ Quick Checklist

### For Users
- [ ] Sign up/Login
- [ ] Open Rewards modal
- [ ] Make a purchase (earn 200 points)
- [ ] Copy your referral code
- [ ] Share with friends
- [ ] Redeem your first reward

### For Developers
- [ ] `RewardsProvider` wrapping app
- [ ] Rewards button in header
- [ ] Points awarded on checkout
- [ ] Modal rendering correctly
- [ ] LocalStorage persisting data

---

**System Status**: ✅ Fully Implemented & Ready to Use

**Version**: 1.0.0  
**Last Updated**: November 2024
