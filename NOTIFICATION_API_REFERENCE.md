# 📖 Notification System - API Reference

Technical reference for the Thread Trends notification system API.

---

## 🔧 Backend Services

### NotificationService Class

Main service class providing unified interface for all notification providers.

**Location**: `supabase/functions/server/notification_service.tsx`

#### Methods

##### `configureSendGrid(apiKey, fromEmail)`
Configure SendGrid email provider.

```typescript
configureSendGrid(apiKey: string, fromEmail: string): void
```

**Parameters**:
- `apiKey` (string): SendGrid API key (starts with `SG.`)
- `fromEmail` (string): Verified sender email

**Example**:
```typescript
notificationService.configureSendGrid(
  'SG.xxxxxxxxxxxxxxx',
  'noreply@threadtrends.com'
);
```

---

##### `configureMailgun(apiKey, domain, fromEmail)`
Configure Mailgun email provider.

```typescript
configureMailgun(apiKey: string, domain: string, fromEmail: string): void
```

**Parameters**:
- `apiKey` (string): Mailgun private API key
- `domain` (string): Mailgun domain (sandbox or custom)
- `fromEmail` (string): Sender email

**Example**:
```typescript
notificationService.configureMailgun(
  'key-xxxxxxxxxxxxxxx',
  'mg.threadtrends.com',
  'noreply@threadtrends.com'
);
```

---

##### `configureTwilio(accountSid, authToken, fromPhone)`
Configure Twilio SMS provider.

```typescript
configureTwilio(accountSid: string, authToken: string, fromPhone: string): void
```

**Parameters**:
- `accountSid` (string): Twilio Account SID
- `authToken` (string): Twilio Auth Token
- `fromPhone` (string): Twilio phone number (e.g., `+1234567890`)

**Example**:
```typescript
notificationService.configureTwilio(
  'ACxxxxxxxxxxxxxxx',
  'your_auth_token',
  '+1234567890'
);
```

---

##### `sendEmail(to, subject, html, text?)`
Send an email using configured provider.

```typescript
sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean>
```

**Parameters**:
- `to` (string): Recipient email
- `subject` (string): Email subject
- `html` (string): HTML email body
- `text` (string, optional): Plain text version

**Returns**: Promise<boolean> - Success status

**Example**:
```typescript
const success = await notificationService.sendEmail(
  'customer@example.com',
  'Order Confirmation',
  '<h1>Thank you for your order!</h1>',
  'Thank you for your order!'
);
```

---

##### `sendSMS(to, message)`
Send SMS using Twilio.

```typescript
sendSMS(to: string, message: string): Promise<boolean>
```

**Parameters**:
- `to` (string): Phone number (international format)
- `message` (string): SMS text (<160 characters recommended)

**Returns**: Promise<boolean> - Success status

**Example**:
```typescript
const success = await notificationService.sendSMS(
  '+1234567890',
  'Your order has shipped! Track: example.com/track'
);
```

---

##### Template Methods

**`sendOrderConfirmation(email, orderData)`**
```typescript
sendOrderConfirmation(email: string, orderData: any): Promise<boolean>
```

**`sendOrderShipped(email, orderData)`**
```typescript
sendOrderShipped(email: string, orderData: any): Promise<boolean>
```

**`sendWelcomeEmail(email, userName)`**
```typescript
sendWelcomeEmail(email: string, userName: string): Promise<boolean>
```

**`sendMarketingCampaign(email, campaignData)`**
```typescript
sendMarketingCampaign(email: string, campaignData: any): Promise<boolean>
```

**`sendOrderSMS(phone, orderNumber)`**
```typescript
sendOrderSMS(phone: string, orderNumber: string): Promise<boolean>
```

---

## 🌐 API Endpoints

Base URL: `http://127.0.0.1:54321/make-server-d9a3ff0a`

### Configuration Endpoints

#### POST `/notifications/config/sendgrid`
Configure SendGrid provider.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "apiKey": "SG.xxxxxxxxxxxxx",
  "fromEmail": "noreply@threadtrends.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "SendGrid configured successfully"
}
```

---

#### POST `/notifications/config/mailgun`
Configure Mailgun provider.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "apiKey": "key-xxxxxxxxxxxxx",
  "domain": "mg.threadtrends.com",
  "fromEmail": "noreply@threadtrends.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Mailgun configured successfully"
}
```

---

#### POST `/notifications/config/twilio`
Configure Twilio provider.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "accountSid": "ACxxxxxxxxxxxxx",
  "authToken": "your_auth_token",
  "fromPhone": "+1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Twilio configured successfully"
}
```

---

#### GET `/notifications/config`
Get configuration status of all providers.

**Auth**: Required (Admin only)

**Response**:
```json
{
  "sendgrid": { "enabled": true, "configured": true },
  "mailgun": { "enabled": false, "configured": false },
  "twilio": { "enabled": true, "configured": true }
}
```

---

### Testing Endpoints

#### POST `/notifications/test`
Send test notification.

**Auth**: Required (Admin only)

**Request Body** (Email):
```json
{
  "type": "email",
  "recipient": "test@example.com"
}
```

**Request Body** (SMS):
```json
{
  "type": "sms",
  "recipient": "+1234567890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Test email sent"
}
```

---

### Transactional Endpoints

#### POST `/notifications/order/confirmation`
Send order confirmation email.

**Auth**: Optional

**Request Body**:
```json
{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "orderNumber": "ORD-12345",
  "items": [
    {
      "name": "Graphic Tee",
      "quantity": 2,
      "size": "M",
      "price": 1299
    }
  ],
  "total": 2598,
  "shippingAddress": "123 Main St, NY 10001",
  "estimatedDelivery": "3-5 business days"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Order confirmation sent"
}
```

---

#### POST `/notifications/order/shipped`
Send shipping notification.

**Auth**: Optional

**Request Body**:
```json
{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "orderNumber": "ORD-12345",
  "trackingNumber": "TRK123456789",
  "carrier": "FedEx",
  "trackingUrl": "https://fedex.com/track",
  "estimatedDelivery": "2-3 business days"
}
```

---

#### POST `/notifications/welcome`
Send welcome email to new user.

**Auth**: Optional

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "userName": "John Doe"
}
```

---

#### POST `/notifications/sms/order`
Send order SMS notification.

**Auth**: Optional

**Request Body**:
```json
{
  "phone": "+1234567890",
  "orderNumber": "ORD-12345"
}
```

---

### Marketing Endpoints

#### POST `/notifications/campaign`
Send marketing campaign to multiple recipients.

**Auth**: Required (Admin only)

**Request Body**:
```json
{
  "recipients": [
    "customer1@email.com",
    "customer2@email.com"
  ],
  "campaignData": {
    "subject": "Flash Sale - 50% Off!",
    "headline": "FLASH SALE",
    "subheadline": "Limited Time Offer",
    "body": "<p>Shop now and save!</p>",
    "ctaText": "Shop Now",
    "ctaUrl": "https://threadtrends.com/shop"
  }
}
```

**Response**:
```json
{
  "success": true,
  "sent": 45,
  "total": 50,
  "message": "Campaign sent to 45/50 recipients"
}
```

---

## 💻 Client-Side Helpers

### Location
`src/utils/notificationHelpers.ts`

### Functions

#### `sendOrderConfirmationEmail(orderData)`
```typescript
interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
}

sendOrderConfirmationEmail(orderData: OrderData): Promise<boolean>
```

**Example**:
```typescript
import { sendOrderConfirmationEmail } from '@/utils/notificationHelpers';

const orderData = {
  orderNumber: 'ORD-12345',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  items: [{ name: 'Tee', quantity: 1, size: 'M', price: 1299 }],
  total: 1299,
  shippingAddress: '123 Main St',
  estimatedDelivery: '3-5 days'
};

await sendOrderConfirmationEmail(orderData);
```

---

#### `sendWelcomeEmail(email, userName)`
```typescript
sendWelcomeEmail(email: string, userName: string): Promise<boolean>
```

**Example**:
```typescript
import { sendWelcomeEmail } from '@/utils/notificationHelpers';

await sendWelcomeEmail('newuser@example.com', 'John Doe');
```

---

#### `sendOrderSMS(phone, orderNumber)`
```typescript
sendOrderSMS(phone: string, orderNumber: string): Promise<boolean>
```

**Example**:
```typescript
import { sendOrderSMS } from '@/utils/notificationHelpers';

await sendOrderSMS('+1234567890', 'ORD-12345');
```

---

## 🎨 Template Data Structures

### Order Confirmation Data
```typescript
{
  customerName: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
  estimatedDelivery: string;
}
```

### Shipping Notification Data
```typescript
{
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
}
```

### Marketing Campaign Data
```typescript
{
  subject: string;
  headline: string;
  subheadline: string;
  body: string;        // HTML content
  ctaText: string;
  ctaUrl: string;
  backgroundColor?: string;  // Optional
}
```

---

## 🔐 Authentication

### Admin Endpoints
Require Bearer token in Authorization header:

```http
Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN
```

Get token from:
```typescript
const token = localStorage.getItem('access_token');
```

### Public Endpoints
Transactional endpoints (order confirmations, welcome emails) don't require authentication.

---

## 📊 Error Responses

### Standard Error Format
```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad request (missing/invalid parameters)
- `401` - Unauthorized (admin endpoints only)
- `500` - Server error

---

## 💡 Integration Examples

### Example 1: Signup Flow
```typescript
import { sendWelcomeEmail } from '@/utils/notificationHelpers';

async function handleSignup(email: string, name: string) {
  // Create user account
  await createUser(email, name);
  
  // Send welcome email
  const emailSent = await sendWelcomeEmail(email, name);
  
  if (emailSent) {
    toast.success('Account created! Check your email.');
  }
}
```

### Example 2: Checkout Flow
```typescript
import { sendOrderConfirmationEmail, sendOrderSMS } from '@/utils/notificationHelpers';

async function handleCheckout(order: Order) {
  // Process payment
  await processPayment(order);
  
  // Send email
  await sendOrderConfirmationEmail({
    orderNumber: order.id,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    items: order.items,
    total: order.total,
    shippingAddress: order.shippingAddress,
    estimatedDelivery: '3-5 business days'
  });
  
  // Optionally send SMS
  if (order.customer.phone) {
    await sendOrderSMS(order.customer.phone, order.id);
  }
}
```

### Example 3: Admin Shipping Update
```typescript
import { sendOrderShippedEmail } from '@/utils/notificationHelpers';

async function markAsShipped(orderId: string) {
  const order = await getOrder(orderId);
  
  // Update order status
  await updateOrder(orderId, { status: 'shipped' });
  
  // Notify customer
  await sendOrderShippedEmail({
    customerEmail: order.customer.email,
    customerName: order.customer.name,
    orderNumber: order.id,
    trackingNumber: order.tracking.number,
    carrier: order.tracking.carrier,
    trackingUrl: order.tracking.url,
    estimatedDelivery: '2-3 business days'
  });
}
```

---

## 🧪 Testing

### Test Email Template
```bash
curl -X POST http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"email","recipient":"test@example.com"}'
```

### Test SMS
```bash
curl -X POST http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/test \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"sms","recipient":"+1234567890"}'
```

### Test Order Confirmation
```bash
curl -X POST http://127.0.0.1:54321/make-server-d9a3ff0a/notifications/order/confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "orderNumber": "ORD-TEST",
    "items": [{"name":"Test Item","quantity":1,"size":"M","price":1000}],
    "total": 1000,
    "shippingAddress": "Test Address",
    "estimatedDelivery": "3-5 days"
  }'
```

---

**API Version**: 1.0.0  
**Last Updated**: November 2024  
**Status**: Production Ready
