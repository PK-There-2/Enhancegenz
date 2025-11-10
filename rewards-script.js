// Rewards Window JavaScript
const STORAGE_KEY = 'thread_trends_rewards';
const USER_STORAGE_KEY = 'thread_trends_user';

const EARN_ACTIONS = [
  { action: 'Place an order', points: 200, icon: '🛍️' },
  { action: 'Follow on Instagram', points: 300, icon: '📸' },
  { action: 'Sign up', points: 500, icon: '👋' },
  { action: 'Birthday bonus', points: 1000, icon: '🎂' },
  { action: 'Write a review', points: 150, icon: '⭐' },
  { action: 'Share on social media', points: 100, icon: '🔗' },
  { action: 'Referral (friend purchases)', points: 500, icon: '🎁' },
];

const AVAILABLE_REWARDS = [
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

let userRewards = null;
let currentUser = null;

// Initialize
function init() {
  // Get current user
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    alert('Please sign in to access rewards');
    window.close();
    return;
  }
  
  currentUser = JSON.parse(storedUser);
  
  // Load user rewards
  const stored = localStorage.getItem(`${STORAGE_KEY}_${currentUser.id}`);
  if (stored) {
    userRewards = JSON.parse(stored);
  } else {
    // Initialize new rewards account
    userRewards = {
      userId: currentUser.id,
      totalPoints: 500,
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
    saveRewards();
  }
  
  updateDisplay();
  renderEarnActions();
  renderRewards();
  renderHistory();
}

function generateReferralCode() {
  return `TT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function calculateTier(lifetimePoints) {
  if (lifetimePoints >= 10000) return 'Platinum';
  if (lifetimePoints >= 5000) return 'Gold';
  if (lifetimePoints >= 2000) return 'Silver';
  return 'Bronze';
}

function saveRewards() {
  localStorage.setItem(`${STORAGE_KEY}_${currentUser.id}`, JSON.stringify(userRewards));
  
  // Notify parent window
  if (window.opener) {
    window.opener.postMessage({ 
      type: 'REWARDS_UPDATED', 
      rewards: userRewards 
    }, '*');
  }
}

function updateDisplay() {
  document.getElementById('pointsValue').textContent = userRewards.totalPoints;
  document.getElementById('redeemPoints').textContent = userRewards.totalPoints;
  document.getElementById('tierBadge').textContent = `${userRewards.tier} Member`;
  document.getElementById('referralCode').textContent = userRewards.referralCode;
  document.getElementById('referralsCount').textContent = userRewards.referrals;
}

function showView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => view.classList.add('hidden'));
  
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  
  // Show selected view
  document.getElementById(viewName + 'View').classList.remove('hidden');
  
  // Activate corresponding tab
  const tabs = document.querySelectorAll('.nav-tab');
  const tabNames = ['home', 'earn', 'redeem', 'referrals', 'history'];
  const index = tabNames.indexOf(viewName);
  if (index !== -1 && tabs[index]) {
    tabs[index].classList.add('active');
  }
}

function renderEarnActions() {
  const container = document.getElementById('earnActions');
  container.innerHTML = EARN_ACTIONS.map(action => `
    <div class="action-card">
      <div class="action-content">
        <span class="action-icon">${action.icon}</span>
        <span class="action-name">${action.action}</span>
      </div>
      <div class="points-badge">+${action.points}</div>
    </div>
  `).join('');
}

function renderRewards() {
  const container = document.getElementById('rewardsList');
  container.innerHTML = AVAILABLE_REWARDS.map(reward => {
    const canRedeem = userRewards.totalPoints >= reward.points;
    return `
      <div class="reward-card ${canRedeem ? 'available' : ''}">
        <div class="reward-header">
          <div class="reward-icon">${reward.icon}</div>
          <div class="reward-info">
            <div class="reward-name">${reward.name}</div>
            <div class="reward-desc">${reward.description}</div>
          </div>
        </div>
        <div class="reward-footer">
          <div class="reward-points">${reward.points} Points</div>
          <button 
            class="redeem-btn ${canRedeem ? 'available' : 'disabled'}"
            onclick="redeemReward('${reward.id}')"
            ${!canRedeem ? 'disabled' : ''}
          >
            ${canRedeem ? 'Redeem Now' : 'Not enough points'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderHistory() {
  const container = document.getElementById('historyList');
  if (!userRewards.actions || userRewards.actions.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: #9ca3af;">
        <div style="font-size: 48px; margin-bottom: 16px;">🏆</div>
        <p>No activity yet. Start earning points!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = userRewards.actions.slice(0, 10).map(action => {
    const date = new Date(action.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="history-item">
        <div class="history-content">
          <div class="history-icon ${action.type}">
            ${action.type === 'earn' ? '📈' : '🎁'}
          </div>
          <div class="history-info">
            <div class="history-title">${action.action}</div>
            <div class="history-desc">${action.description}</div>
            <div class="history-date">${formattedDate}</div>
          </div>
        </div>
        <div class="history-points ${action.type}">
          ${action.type === 'earn' ? '+' : '-'}${action.points}
        </div>
      </div>
    `;
  }).join('');
}

function redeemReward(rewardId) {
  const reward = AVAILABLE_REWARDS.find(r => r.id === rewardId);
  if (!reward) return;
  
  if (userRewards.totalPoints < reward.points) {
    alert('Not enough points to redeem this reward.');
    return;
  }
  
  const newAction = {
    id: Date.now().toString(),
    type: 'redeem',
    action: reward.name,
    points: reward.points,
    date: new Date().toISOString(),
    description: `Redeemed: ${reward.description}`
  };
  
  userRewards.totalPoints -= reward.points;
  userRewards.actions.unshift(newAction);
  
  saveRewards();
  updateDisplay();
  renderRewards();
  renderHistory();
  
  alert(`Successfully redeemed ${reward.name}! Check your email for the coupon code.`);
}

function copyReferralCode() {
  const code = userRewards.referralCode;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✓ Copied!';
    btn.classList.add('copied');
    
    setTimeout(() => {
      btn.textContent = 'Copy Code';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// Listen for messages from parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'EARN_POINTS') {
    const { action, points, description } = event.data;
    
    const newAction = {
      id: Date.now().toString(),
      type: 'earn',
      action,
      points,
      date: new Date().toISOString(),
      description
    };
    
    const newLifetimePoints = userRewards.lifetimePoints + points;
    
    userRewards.totalPoints += points;
    userRewards.lifetimePoints = newLifetimePoints;
    userRewards.tier = calculateTier(newLifetimePoints);
    userRewards.actions.unshift(newAction);
    
    saveRewards();
    updateDisplay();
    renderRewards();
    renderHistory();
  }
});

// Notify parent on close
window.addEventListener('beforeunload', () => {
  if (window.opener) {
    window.opener.postMessage({ 
      type: 'REWARDS_CLOSED',
      rewards: userRewards
    }, '*');
  }
});

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
