# 📖 Rewards System - API Reference

Complete technical reference for the Thread Trends Loyalty Rewards System.

---

## 🎯 Core Hooks

### `useRewards()`

Access the rewards context from any component.

```typescript
import { useRewards } from './components/RewardsContext';

function YourComponent() {
  const {
    userRewards,
    earnPoints,
    redeemReward,
    getAvailableRewards,
    getEarnActions,
    generateReferralCode,
    applyReferralCode
  } = useRewards();
}
```

---

## 📝 Types & Interfaces

### `UserRewards`
```typescript
interface UserRewards {
  userId: string;              // Unique user identifier
  totalPoints: number;         // Current available points
  lifetimePoints: number;      // Total points ever earned
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  actions: RewardAction[];     // Transaction history
  referralCode: string;        // Unique referral code (TT######)
  referrals: number;          // Count of successful referrals
}
```

### `RewardAction`
```typescript
interface RewardAction {
  id: string;                  // Unique transaction ID
  type: 'earn' | 'redeem';    // Transaction type
  action: string;             // Action name
  points: number;             // Points amount
  date: string;               // ISO timestamp
  description: string;        // Transaction description
}
```

### `Reward`
```typescript
interface Reward {
  id: string;                 // Unique reward ID
  name: string;              // Display name
  description: string;       // Reward description
  points: number;           // Cost in points
  type: 'coupon' | 'discount' | 'freebie';
  value: number;           // Monetary value (₹)
  icon: string;            // Emoji icon
}
```

---

## 🔧 Context Methods

### `earnPoints()`

Award points to the current user.

**Signature**:
```typescript
earnPoints(
  action: string,
  points: number,
  description: string
): void
```

**Parameters**:
- `action` (string): Name of the action (e.g., "Place an order")
- `points` (number): Number of points to award
- `description` (string): Detailed description for transaction history

**Example**:
```typescript
const { earnPoints } = useRewards();

// Award points for a purchase
earnPoints(
  'Place an order',
  200,
  'Order #12345 - Total: ₹2,500'
);

// Award points for social media follow
earnPoints(
  'Follow on Instagram',
  300,
  'Followed @threadtrends'
);
```

**Side Effects**:
- Increases `totalPoints` by `points`
- Increases `lifetimePoints` by `points`
- Recalculates user tier
- Adds transaction to history
- Saves to localStorage
- Updates UI

---

### `redeemReward()`

Redeem points for a reward.

**Signature**:
```typescript
redeemReward(reward: Reward): boolean
```

**Parameters**:
- `reward` (Reward): The reward object to redeem

**Returns**:
- `true`: Redemption successful
- `false`: Not enough points

**Example**:
```typescript
const { redeemReward, getAvailableRewards } = useRewards();

const rewards = getAvailableRewards();
const coupon = rewards.find(r => r.id === 'reward-1');

const success = redeemReward(coupon);

if (success) {
  console.log('Reward redeemed!');
  // Issue coupon code to user
} else {
  console.log('Not enough points');
}
```

**Side Effects**:
- Decreases `totalPoints` by `reward.points`
- Adds redemption transaction to history
- Saves to localStorage
- Updates UI
- Does NOT affect `lifetimePoints` or tier

---

### `getAvailableRewards()`

Get list of all available rewards.

**Signature**:
```typescript
getAvailableRewards(): Reward[]
```

**Returns**:
Array of Reward objects

**Example**:
```typescript
const { getAvailableRewards, userRewards } = useRewards();

const rewards = getAvailableRewards();

// Filter rewards user can afford
const affordable = rewards.filter(
  r => r.points <= (userRewards?.totalPoints || 0)
);
```

---

### `getEarnActions()`

Get list of all ways to earn points.

**Signature**:
```typescript
getEarnActions(): {
  action: string;
  points: number;
  icon: string;
}[]
```

**Returns**:
Array of earning action objects

**Example**:
```typescript
const { getEarnActions } = useRewards();

const actions = getEarnActions();

actions.forEach(action => {
  console.log(`${action.icon} ${action.action}: ${action.points} points`);
});
```

---

### `generateReferralCode()`

Generate a new unique referral code.

**Signature**:
```typescript
generateReferralCode(): string
```

**Returns**:
String in format "TT######" (e.g., "TT3F9A2B")

**Example**:
```typescript
const { generateReferralCode } = useRewards();

const newCode = generateReferralCode();
console.log(newCode); // "TTABC123"
```

**Note**: Code is automatically generated on user signup.

---

### `applyReferralCode()`

Apply a referral code (simplified implementation).

**Signature**:
```typescript
applyReferralCode(code: string): boolean
```

**Parameters**:
- `code` (string): Referral code to apply

**Returns**:
- `true`: Code applied successfully
- `false`: Invalid code

**Example**:
```typescript
const { applyReferralCode } = useRewards();

const success = applyReferralCode('TTABC123');

if (success) {
  console.log('Referral applied! You earned 500 points');
}
```

**Note**: In production, this should be a backend API call to validate and track referrals.

---

## 🎨 Component Usage

### RewardsModal

Display the rewards modal.

**Props**:
```typescript
interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Example**:
```typescript
import { RewardsModal } from './components/RewardsModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Open Rewards
      </button>
      
      <RewardsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
```

---

### CheckoutButton

Automatic point-awarding checkout button.

**Props**: None

**Example**:
```typescript
import { CheckoutButton } from './components/CheckoutButton';

function Cart() {
  return (
    <div>
      {/* Your cart items */}
      <CheckoutButton />
    </div>
  );
}
```

**Functionality**:
- Checks if user is logged in
- Validates cart has items
- Processes checkout
- Awards 200 points automatically
- Shows success toast with points earned

---

## 📊 Constants

### Earn Actions

```typescript
const EARN_ACTIONS = [
  { action: 'Place an order', points: 200, icon: '🛍️' },
  { action: 'Follow on Instagram', points: 300, icon: '📸' },
  { action: 'Sign up', points: 500, icon: '👋' },
  { action: 'Birthday bonus', points: 1000, icon: '🎂' },
  { action: 'Write a review', points: 150, icon: '⭐' },
  { action: 'Share on social media', points: 100, icon: '🔗' },
  { action: 'Referral (friend purchases)', points: 500, icon: '🎁' },
];
```

### Available Rewards

```typescript
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
```

---

## 💾 LocalStorage Schema

### Storage Key
```
thread_trends_rewards_{userId}
```

### Data Structure
```json
{
  "userId": "user_123",
  "totalPoints": 1200,
  "lifetimePoints": 2500,
  "tier": "Silver",
  "actions": [
    {
      "id": "1699123456789",
      "type": "earn",
      "action": "Place an order",
      "points": 200,
      "date": "2024-11-08T10:30:00.000Z",
      "description": "Order total: ₹2,500"
    },
    {
      "id": "1699123456790",
      "type": "redeem",
      "action": "₹100 off coupon",
      "points": 500,
      "date": "2024-11-08T11:00:00.000Z",
      "description": "Redeemed: Use on your next purchase"
    }
  ],
  "referralCode": "TT3F9A2B",
  "referrals": 2
}
```

---

## 🔄 State Flow

### Earning Points Flow

```
User Action
    ↓
earnPoints() called
    ↓
Create new RewardAction
    ↓
Update totalPoints (+)
Update lifetimePoints (+)
    ↓
Recalculate tier
    ↓
Add to actions array
    ↓
Save to localStorage
    ↓
Trigger re-render
    ↓
UI updates
```

### Redeeming Points Flow

```
User clicks "Redeem"
    ↓
redeemReward() called
    ↓
Check: totalPoints >= reward.points?
    ↓
If Yes:
  Create redemption action
  Update totalPoints (-)
  Add to actions array
  Save to localStorage
  Return true
    ↓
If No:
  Return false
    ↓
UI updates
```

---

## 🎯 Integration Examples

### Example 1: Custom Earn Action

```typescript
import { useRewards } from './components/RewardsContext';

function ProductReview() {
  const { earnPoints } = useRewards();
  
  const submitReview = async (review) => {
    // Submit review logic...
    
    // Award points
    earnPoints(
      'Write a review',
      150,
      `Reviewed: ${productName}`
    );
    
    toast.success('Review submitted! You earned 150 points!');
  };
  
  return (
    <button onClick={submitReview}>
      Submit Review (+150 points)
    </button>
  );
}
```

### Example 2: Tier-Based Benefits

```typescript
import { useRewards } from './components/RewardsContext';

function ShippingCalculator() {
  const { userRewards } = useRewards();
  
  const getShippingCost = (orderTotal) => {
    const baseCost = 100;
    
    // Tier-based discounts
    switch (userRewards?.tier) {
      case 'Platinum':
        return 0; // Free shipping
      case 'Gold':
        return baseCost * 0.5; // 50% off
      case 'Silver':
        return baseCost * 0.75; // 25% off
      default:
        return baseCost;
    }
  };
  
  return <div>Shipping: ₹{getShippingCost()}</div>;
}
```

### Example 3: Points Preview

```typescript
import { useRewards } from './components/RewardsContext';

function ProductCard({ price }) {
  const { userRewards } = useRewards();
  
  // Calculate points that will be earned
  const pointsWillEarn = 200; // Per order
  
  return (
    <div>
      <p>Price: ₹{price}</p>
      <p className="text-green-600">
        +{pointsWillEarn} points on purchase
      </p>
      {userRewards && (
        <p className="text-sm text-gray-500">
          You have {userRewards.totalPoints} points
        </p>
      )}
    </div>
  );
}
```

### Example 4: Conditional Rendering

```typescript
import { useRewards } from './components/RewardsContext';

function RewardsBanner() {
  const { userRewards } = useRewards();
  
  // Show banner only for users close to next tier
  const nextTierThreshold = 
    userRewards?.tier === 'Bronze' ? 2000 :
    userRewards?.tier === 'Silver' ? 5000 :
    userRewards?.tier === 'Gold' ? 10000 : null;
  
  const pointsToNextTier = 
    nextTierThreshold ? nextTierThreshold - (userRewards?.lifetimePoints || 0) : 0;
  
  if (!nextTierThreshold || pointsToNextTier > 500) return null;
  
  return (
    <div className="bg-yellow-100 p-4 rounded">
      🎯 Only {pointsToNextTier} more points to reach next tier!
    </div>
  );
}
```

---

## 🧪 Testing Utilities

### Mock Rewards Data

```typescript
const mockUserRewards: UserRewards = {
  userId: 'test_user_123',
  totalPoints: 1500,
  lifetimePoints: 3000,
  tier: 'Silver',
  actions: [
    {
      id: '1',
      type: 'earn',
      action: 'Sign up',
      points: 500,
      date: new Date().toISOString(),
      description: 'Welcome bonus'
    }
  ],
  referralCode: 'TTTEST01',
  referrals: 0
};
```

### Test Helper Functions

```typescript
// Clear rewards data (for testing)
const clearRewardsData = (userId: string) => {
  localStorage.removeItem(`thread_trends_rewards_${userId}`);
};

// Set custom rewards data (for testing)
const setRewardsData = (userId: string, data: UserRewards) => {
  localStorage.setItem(
    `thread_trends_rewards_${userId}`,
    JSON.stringify(data)
  );
};

// Get rewards data (for debugging)
const getRewardsData = (userId: string): UserRewards | null => {
  const data = localStorage.getItem(`thread_trends_rewards_${userId}`);
  return data ? JSON.parse(data) : null;
};
```

---

## 🚨 Error Handling

### Common Errors

**1. useRewards called outside provider**
```
Error: useRewards must be used within a RewardsProvider
```
**Solution**: Wrap your app with `<RewardsProvider>`

**2. User not logged in**
```typescript
const { userRewards } = useRewards();

if (!userRewards) {
  return <div>Please log in to access rewards</div>;
}
```

**3. Insufficient points**
```typescript
const success = redeemReward(reward);

if (!success) {
  toast.error('Not enough points to redeem this reward');
}
```

---

## 🔒 Security Considerations

### Current Implementation
- ✅ Client-side only (no backend required)
- ✅ Per-user data isolation
- ⚠️ LocalStorage can be manipulated by user
- ⚠️ No server-side validation

### For Production
Implement:
- Backend API for point transactions
- Server-side validation
- Fraud detection
- Transaction auditing
- Rate limiting
- Encryption for sensitive data

---

## 📚 Additional Resources

- **Main Guide**: `REWARDS_SYSTEM_GUIDE.md`
- **Quick Start**: `QUICK_SETUP_REWARDS.md`
- **Integration Summary**: `REWARDS_INTEGRATION_SUMMARY.md`
- **Source Code**: `src/components/RewardsContext.tsx`

---

**Last Updated**: November 2024  
**Version**: 1.0.0  
**Status**: Production Ready
