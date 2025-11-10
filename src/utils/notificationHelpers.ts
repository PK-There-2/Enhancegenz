/**
 * Notification Helper Utilities
 * Client-side helpers for triggering email/SMS notifications
 */

const API_BASE = 'http://127.0.0.1:54321/make-server-d9a3ff0a';

export interface OrderData {
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
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
}

/**
 * Send order confirmation email
 * Call this after successful order placement
 */
export async function sendOrderConfirmationEmail(
  orderData: OrderData,
  accessToken?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/notifications/order/confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      console.error('Failed to send order confirmation:', await response.text());
      return false;
    }

    console.log('Order confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    return false;
  }
}

/**
 * Send order shipped notification
 * Call this when order status changes to shipped
 */
export async function sendOrderShippedEmail(
  orderData: OrderData,
  accessToken?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/notifications/order/shipped`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      console.error('Failed to send shipping notification:', await response.text());
      return false;
    }

    console.log('Shipping notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending shipping notification:', error);
    return false;
  }
}

/**
 * Send welcome email to new user
 * Call this after successful user registration
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  accessToken?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/notifications/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify({ email, userName })
    });

    if (!response.ok) {
      console.error('Failed to send welcome email:', await response.text());
      return false;
    }

    console.log('Welcome email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Send SMS notification for order
 * Call this for high-priority order updates
 */
export async function sendOrderSMS(
  phone: string,
  orderNumber: string,
  accessToken?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/notifications/sms/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      },
      body: JSON.stringify({ phone, orderNumber })
    });

    if (!response.ok) {
      console.error('Failed to send order SMS:', await response.text());
      return false;
    }

    console.log('Order SMS sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending order SMS:', error);
    return false;
  }
}

/**
 * Example usage in your order flow:
 * 
 * // After successful checkout
 * const orderData = {
 *   orderNumber: 'ORD-12345',
 *   customerName: 'John Doe',
 *   customerEmail: 'john@example.com',
 *   customerPhone: '+1234567890',
 *   items: [
 *     { name: 'Graphic Tee', quantity: 2, size: 'M', price: 1299 }
 *   ],
 *   total: 2598,
 *   shippingAddress: '123 Main St, City, State 12345',
 *   estimatedDelivery: '3-5 business days'
 * };
 * 
 * await sendOrderConfirmationEmail(orderData);
 * await sendOrderSMS(orderData.customerPhone, orderData.orderNumber);
 * 
 * // After shipping
 * const shippingData = {
 *   ...orderData,
 *   trackingNumber: 'TRK123456789',
 *   trackingUrl: 'https://tracking.com/TRK123456789',
 *   carrier: 'FedEx'
 * };
 * 
 * await sendOrderShippedEmail(shippingData);
 */
