# ⚡ Email/SMS Notifications - Quick Start Guide

## 5-Minute Setup

Get email and SMS notifications running in your Thread Trends platform quickly.

---

## 🎯 Choose Your Provider

### Email Providers (Pick One)

#### Option A: SendGrid (Recommended for Beginners)
- **Free Tier**: 100 emails/day
- **Setup Time**: 5 minutes
- **Best For**: Quick start, reliable delivery

#### Option B: Mailgun
- **Free Tier**: 5,000 emails/month
- **Setup Time**: 10 minutes
- **Best For**: Higher volume, advanced features

### SMS Provider (Optional)

#### Twilio
- **Free Credit**: $15
- **Setup Time**: 5 minutes
- **Best For**: SMS alerts, order notifications

---

## 🚀 Quick Setup Steps

### Step 1: Get API Credentials (5 min)

**For SendGrid:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Copy the key (starts with `SG.`)
5. Verify sender email at **Settings** → **Sender Authentication**

**For Mailgun:**
1. Sign up at [mailgun.com](https://mailgun.com)
2. Go to **Settings** → **API Keys**
3. Copy **Private API Key**
4. Note your domain (sandbox or custom)

**For Twilio:**
1. Sign up at [twilio.com](https://twilio.com)
2. Get a phone number
3. Copy **Account SID** and **Auth Token**

### Step 2: Configure in Admin Panel (2 min)

1. **Login** as admin on your website
2. Go to **Marketing** section in sidebar
3. Click appropriate provider tab:
   - **SendGrid Setup** tab
   - **Mailgun Setup** tab  
   - **Twilio Setup** tab
4. **Paste** your API credentials
5. Click **Save Configuration**
6. See green checkmark ✓

### Step 3: Test It (1 min)

1. Scroll to **Send Test Email/SMS**
2. Enter your email or phone
3. Click **Send Test**
4. Check inbox/phone
5. Success! 🎉

---

## 📧 What You Can Do

### Transactional Emails
- ✅ Order confirmations (automatic)
- ✅ Shipping notifications
- ✅ Welcome emails (automatic on signup)
- ✅ Password resets

### Marketing Campaigns
- ✅ New product launches
- ✅ Flash sales announcements
- ✅ Newsletter campaigns
- ✅ Promotional offers

### SMS Alerts
- ✅ Order confirmations
- ✅ Shipping updates
- ✅ Important notifications

---

## 💡 Quick Examples

### Send Marketing Campaign

1. Admin Panel → Marketing → **Send Campaign** tab
2. Fill in:
   ```
   Subject: 🔥 Flash Sale - 50% Off!
   Headline: FLASH SALE ALERT
   Body: <p>Limited time offer!</p>
   Recipients: customer@email.com, another@email.com
   ```
3. Click **Send Campaign**

### Automatic Order Email

Already set up! When customers checkout, they automatically receive:
- Order confirmation email
- Points earned in loyalty program
- Order details and tracking

---

## 🎨 Pre-Built Email Templates

### 1. Order Confirmation
- Order number & details
- Items purchased
- Shipping address
- Expected delivery
- Track order button

### 2. Order Shipped
- Tracking number
- Carrier info
- Tracking link
- Delivery estimate

### 3. Welcome Email
- Brand introduction
- Member benefits
- Shop now CTA
- Social links

### 4. Marketing Campaign
- Custom headline
- Custom content (HTML)
- Custom CTA button
- Fully branded

---

## 🔧 Quick Customization

### Change Email Templates

Edit: `supabase/functions/server/notification_service.tsx`

```typescript
// Find this function
generateOrderConfirmationHTML(orderData) {
  return `
    <!DOCTYPE html>
    <html>
      <!-- Edit HTML here -->
    </html>
  `;
}
```

### Trigger Notifications from Code

```typescript
import { sendWelcomeEmail } from '@/utils/notificationHelpers';

// After user signs up
await sendWelcomeEmail(email, name);
```

---

## 🐛 Quick Troubleshooting

**Email not received?**
1. ✓ Check spam folder
2. ✓ Verify sender email in provider
3. ✓ Check API key is correct

**SMS not delivered?**
1. ✓ Phone format: +1234567890
2. ✓ Verify number in Twilio (trial)
3. ✓ Check Twilio balance

**Can't save config?**
1. ✓ Make sure you're logged in as admin
2. ✓ Refresh page
3. ✓ Check all fields filled

---

## 📊 Free Tier Limits

| Provider | Free Limit | Good For |
|----------|-----------|----------|
| SendGrid | 100/day | Testing |
| Mailgun | 5,000/month | Small business |
| Twilio | $15 credit | SMS testing |

---

## 🎯 Next Steps

1. ✅ **Test** - Send test email/SMS
2. ✅ **Customize** - Edit templates if needed
3. ✅ **Launch** - Start sending to customers
4. ✅ **Monitor** - Check provider dashboard for stats

---

## 📚 Need More Help?

**Detailed Documentation:**
- `NOTIFICATION_INTEGRATION_GUIDE.md` - Complete guide
- `NOTIFICATION_API_REFERENCE.md` - Code reference

**Provider Documentation:**
- SendGrid: [docs.sendgrid.com](https://docs.sendgrid.com)
- Mailgun: [documentation.mailgun.com](https://documentation.mailgun.com)
- Twilio: [twilio.com/docs](https://www.twilio.com/docs)

---

**Status**: ✅ Fully Integrated  
**Time to Setup**: 5-10 minutes  
**Difficulty**: Easy

Just follow the steps and you're ready to send notifications! 📧📱
