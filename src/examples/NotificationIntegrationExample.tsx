/**
 * Example: Integrating Notifications into Checkout Flow
 * 
 * This file demonstrates how to trigger email/SMS notifications
 * at key points in your e-commerce flow.
 */

import { 
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendWelcomeEmail,
  sendOrderSMS,
  type OrderData
} from '../utils/notificationHelpers';

// ============================================
// EXAMPLE 1: After User Registration
// ============================================

export async function handleUserSignup(email: string, name: string) {
  try {
    // Your existing signup logic here
    console.log('User signed up:', email);
    
    // Send welcome email
    const emailSent = await sendWelcomeEmail(email, name);
    
    if (emailSent) {
      console.log('✅ Welcome email sent to', email);
    } else {
      console.log('⚠️ Failed to send welcome email');
    }
    
    return { success: true, message: 'Account created successfully!' };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to create account' };
  }
}

// ============================================
// EXAMPLE 2: After Successful Order
// ============================================

export async function handleOrderPlacement(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  cartItems: Array<{
    id: string;
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}) {
  try {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;
    
    // Your existing order creation logic here
    console.log('Creating order:', orderNumber);
    
    // Format order data for notification
    const notificationData: OrderData = {
      orderNumber,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      total: orderData.total,
      shippingAddress: `${orderData.shippingAddress.street}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}`,
      estimatedDelivery: '3-5 business days'
    };
    
    // Send order confirmation email
    const emailSent = await sendOrderConfirmationEmail(notificationData);
    if (emailSent) {
      console.log('✅ Order confirmation email sent');
    }
    
    // Optionally send SMS if phone is provided
    if (orderData.customerPhone) {
      const smsSent = await sendOrderSMS(
        orderData.customerPhone,
        orderNumber
      );
      if (smsSent) {
        console.log('✅ Order confirmation SMS sent');
      }
    }
    
    return {
      success: true,
      orderNumber,
      message: 'Order placed successfully! Check your email for confirmation.'
    };
  } catch (error) {
    console.error('Order placement error:', error);
    return {
      success: false,
      message: 'Failed to place order'
    };
  }
}

// ============================================
// EXAMPLE 3: When Order Ships (Admin Action)
// ============================================

export async function handleOrderShipped(orderDetails: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  carrier: string;
  items: Array<{
    name: string;
    quantity: number;
    size: string;
    price: number;
  }>;
  total: number;
  shippingAddress: string;
}) {
  try {
    // Format shipping data
    const shippingData: OrderData = {
      ...orderDetails,
      estimatedDelivery: '2-3 business days',
      trackingUrl: `https://www.${orderDetails.carrier.toLowerCase()}.com/track/${orderDetails.trackingNumber}`
    };
    
    // Send shipping notification
    const emailSent = await sendOrderShippedEmail(shippingData);
    
    if (emailSent) {
      console.log('✅ Shipping notification sent');
      return { success: true, message: 'Customer notified of shipment' };
    } else {
      console.log('⚠️ Failed to send shipping notification');
      return { success: false, message: 'Failed to send notification' };
    }
  } catch (error) {
    console.error('Shipping notification error:', error);
    return { success: false, message: 'Error sending notification' };
  }
}

// ============================================
// EXAMPLE 4: Integration with Cart Checkout
// ============================================

// Example CartContext modification
export function useNotificationIntegration() {
  const handleCheckout = async (
    cartItems: any[],
    customerInfo: any,
    paymentInfo: any
  ) => {
    try {
      // Step 1: Process payment (your existing logic)
      console.log('Processing payment...');
      const paymentSuccess = true; // Replace with actual payment logic
      
      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }
      
      // Step 2: Create order in your system
      console.log('Creating order...');
      
      // Step 3: Send notifications
      const orderResult = await handleOrderPlacement({
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        cartItems: cartItems,
        total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shippingAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zip: customerInfo.zip
        }
      });
      
      if (orderResult.success) {
        // Clear cart
        console.log('Order completed:', orderResult.orderNumber);
        return {
          success: true,
          orderNumber: orderResult.orderNumber,
          message: 'Order placed! Check your email for confirmation.'
        };
      }
      
      return orderResult;
    } catch (error) {
      console.error('Checkout error:', error);
      return {
        success: false,
        message: 'Checkout failed. Please try again.'
      };
    }
  };
  
  return { handleCheckout };
}

// ============================================
// EXAMPLE 5: Newsletter Signup
// ============================================

export async function handleNewsletterSignup(email: string) {
  try {
    // Save to your newsletter list
    console.log('Adding to newsletter:', email);
    
    // Send welcome email with newsletter confirmation
    const sent = await sendWelcomeEmail(email, 'Subscriber');
    
    if (sent) {
      return {
        success: true,
        message: 'Subscribed! Check your email for a welcome message.'
      };
    } else {
      return {
        success: true, // Still subscribed even if email fails
        message: 'Subscribed successfully!'
      };
    }
  } catch (error) {
    console.error('Newsletter signup error:', error);
    return {
      success: false,
      message: 'Failed to subscribe. Please try again.'
    };
  }
}

// ============================================
// EXAMPLE 6: Error Handling & Retry Logic
// ============================================

export async function sendNotificationWithRetry(
  sendFunction: () => Promise<boolean>,
  maxRetries = 3,
  delayMs = 1000
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const success = await sendFunction();
      if (success) {
        return true;
      }
      
      if (attempt < maxRetries) {
        console.log(`Retry attempt ${attempt}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
    }
  }
  
  console.error('All retry attempts failed');
  return false;
}

// Usage:
// await sendNotificationWithRetry(() => sendOrderConfirmationEmail(orderData));

// ============================================
// EXAMPLE 7: Batch Notifications (Marketing)
// ============================================

export async function sendBatchWelcomeEmails(
  newUsers: Array<{ email: string; name: string }>
) {
  const results = await Promise.all(
    newUsers.map(user => sendWelcomeEmail(user.email, user.name))
  );
  
  const successCount = results.filter(r => r).length;
  
  console.log(`Sent ${successCount}/${newUsers.length} welcome emails`);
  
  return {
    total: newUsers.length,
    successful: successCount,
    failed: newUsers.length - successCount
  };
}

// ============================================
// HOW TO USE IN YOUR COMPONENTS
// ============================================

/*
// In your AuthModal.tsx or signup component:
import { handleUserSignup } from './examples/NotificationIntegrationExample';

const handleSignup = async (email, password, name) => {
  // Create user account
  const user = await createAccount(email, password, name);
  
  // Send welcome email
  await handleUserSignup(email, name);
  
  // Show success message
  toast.success('Account created! Check your email.');
};

// ============================================

// In your checkout component:
import { handleOrderPlacement } from './examples/NotificationIntegrationExample';

const completeOrder = async () => {
  const orderData = {
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    cartItems: cart.items,
    total: cart.total,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  };
  
  const result = await handleOrderPlacement(orderData);
  
  if (result.success) {
    toast.success(result.message);
    clearCart();
    navigate('/order-confirmation', { orderNumber: result.orderNumber });
  }
};

// ============================================

// In AdminDashboard.tsx when marking order as shipped:
import { handleOrderShipped } from './examples/NotificationIntegrationExample';

const markAsShipped = async (order) => {
  const result = await handleOrderShipped({
    orderNumber: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    trackingNumber: 'TRK123456789',
    carrier: 'FedEx',
    items: order.items,
    total: order.total,
    shippingAddress: order.shippingAddress
  });
  
  if (result.success) {
    toast.success('Customer notified!');
  }
};
*/
