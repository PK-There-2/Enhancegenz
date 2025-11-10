// @ts-nocheck
/**
 * Notification Service for Thread Trends
 * Integrates with SendGrid (Email), Twilio (SMS), and Mailgun (Email)
 */

// ============================================
// TYPES & INTERFACES
// ============================================

export interface NotificationConfig {
  provider: 'sendgrid' | 'twilio' | 'mailgun';
  apiKey: string;
  from: string; // Email or phone number
  enabled: boolean;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

export interface SMSTemplate {
  message: string;
}

export interface NotificationPayload {
  type: 'email' | 'sms';
  to: string; // Email or phone number
  template: string;
  data: Record<string, any>;
}

// ============================================
// SENDGRID EMAIL SERVICE
// ============================================

export class SendGridService {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: this.fromEmail },
          subject: subject,
          content: [
            { type: 'text/html', value: html },
            ...(text ? [{ type: 'text/plain', value: text }] : [])
          ]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('SendGrid error:', error);
        return false;
      }

      console.log('SendGrid email sent successfully to:', to);
      return true;
    } catch (error) {
      console.error('SendGrid send error:', error);
      return false;
    }
  }
}

// ============================================
// MAILGUN EMAIL SERVICE
// ============================================

export class MailgunService {
  private apiKey: string;
  private domain: string;
  private fromEmail: string;

  constructor(apiKey: string, domain: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.domain = domain;
    this.fromEmail = fromEmail;
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('from', this.fromEmail);
      formData.append('to', to);
      formData.append('subject', subject);
      formData.append('html', html);
      if (text) formData.append('text', text);

      const credentials = btoa(`api:${this.apiKey}`);
      const response = await fetch(
        `https://api.mailgun.net/v3/${this.domain}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Mailgun error:', error);
        return false;
      }

      console.log('Mailgun email sent successfully to:', to);
      return true;
    } catch (error) {
      console.error('Mailgun send error:', error);
      return false;
    }
  }
}

// ============================================
// TWILIO SMS SERVICE
// ============================================

export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private fromPhone: string;

  constructor(accountSid: string, authToken: string, fromPhone: string) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromPhone = fromPhone;
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      const credentials = btoa(`${this.accountSid}:${this.authToken}`);
      const formData = new URLSearchParams();
      formData.append('From', this.fromPhone);
      formData.append('To', to);
      formData.append('Body', message);

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Twilio error:', error);
        return false;
      }

      console.log('Twilio SMS sent successfully to:', to);
      return true;
    } catch (error) {
      console.error('Twilio send error:', error);
      return false;
    }
  }
}

// ============================================
// UNIFIED NOTIFICATION SERVICE
// ============================================

export class NotificationService {
  private sendgrid: SendGridService | null = null;
  private mailgun: MailgunService | null = null;
  private twilio: TwilioService | null = null;
  private emailProvider: 'sendgrid' | 'mailgun' | null = null;

  configureSendGrid(apiKey: string, fromEmail: string) {
    this.sendgrid = new SendGridService(apiKey, fromEmail);
    this.emailProvider = 'sendgrid';
    console.log('SendGrid configured');
  }

  configureMailgun(apiKey: string, domain: string, fromEmail: string) {
    this.mailgun = new MailgunService(apiKey, domain, fromEmail);
    this.emailProvider = 'mailgun';
    console.log('Mailgun configured');
  }

  configureTwilio(accountSid: string, authToken: string, fromPhone: string) {
    this.twilio = new TwilioService(accountSid, authToken, fromPhone);
    console.log('Twilio configured');
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (this.emailProvider === 'sendgrid' && this.sendgrid) {
      return await this.sendgrid.sendEmail(to, subject, html, text);
    } else if (this.emailProvider === 'mailgun' && this.mailgun) {
      return await this.mailgun.sendEmail(to, subject, html, text);
    } else {
      console.error('No email provider configured');
      return false;
    }
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    if (this.twilio) {
      return await this.twilio.sendSMS(to, message);
    } else {
      console.error('Twilio not configured');
      return false;
    }
  }

  // Template-based notifications
  async sendOrderConfirmation(email: string, orderData: any): Promise<boolean> {
    const html = this.generateOrderConfirmationHTML(orderData);
    const text = this.generateOrderConfirmationText(orderData);
    return await this.sendEmail(email, 'Order Confirmation - Thread Trends', html, text);
  }

  async sendOrderShipped(email: string, orderData: any): Promise<boolean> {
    const html = this.generateOrderShippedHTML(orderData);
    const text = this.generateOrderShippedText(orderData);
    return await this.sendEmail(email, 'Your Order Has Shipped!', html, text);
  }

  async sendWelcomeEmail(email: string, userName: string): Promise<boolean> {
    const html = this.generateWelcomeHTML(userName);
    const text = this.generateWelcomeText(userName);
    return await this.sendEmail(email, 'Welcome to Thread Trends!', html, text);
  }

  async sendMarketingCampaign(email: string, campaignData: any): Promise<boolean> {
    const html = this.generateMarketingHTML(campaignData);
    const text = this.generateMarketingText(campaignData);
    return await this.sendEmail(email, campaignData.subject, html, text);
  }

  async sendOrderSMS(phone: string, orderNumber: string): Promise<boolean> {
    const message = `Your Thread Trends order #${orderNumber} has been confirmed! Track it at threadtrends.com/orders`;
    return await this.sendSMS(phone, message);
  }

  // ============================================
  // EMAIL TEMPLATES
  // ============================================

  private generateOrderConfirmationHTML(orderData: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: #fff; padding: 30px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .order-item { border-bottom: 1px solid #ddd; padding: 15px 0; }
    .total { font-size: 20px; font-weight: bold; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmed!</h1>
      <p>Thank you for shopping with Thread Trends</p>
    </div>
    <div class="content">
      <p>Hi ${orderData.customerName},</p>
      <p>Your order <strong>#${orderData.orderNumber}</strong> has been confirmed and is being processed.</p>
      
      <h3>Order Details:</h3>
      ${orderData.items.map((item: any) => `
        <div class="order-item">
          <strong>${item.name}</strong> × ${item.quantity}<br>
          Size: ${item.size} | ₹${item.price}
        </div>
      `).join('')}
      
      <div class="total">
        Total: ₹${orderData.total}
      </div>
      
      <p><strong>Shipping Address:</strong><br>
      ${orderData.shippingAddress}</p>
      
      <p>Expected delivery: ${orderData.estimatedDelivery}</p>
      
      <a href="https://threadtrends.com/orders/${orderData.orderNumber}" class="button">Track Your Order</a>
    </div>
    <div class="footer">
      <p>&copy; 2024 Thread Trends. All rights reserved.</p>
      <p>Questions? Contact us at support@threadtrends.com</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private generateOrderConfirmationText(orderData: any): string {
    return `
Order Confirmed!

Hi ${orderData.customerName},

Your order #${orderData.orderNumber} has been confirmed.

Order Details:
${orderData.items.map((item: any) => `${item.name} × ${item.quantity} - ₹${item.price}`).join('\n')}

Total: ₹${orderData.total}

Shipping to: ${orderData.shippingAddress}
Expected delivery: ${orderData.estimatedDelivery}

Track your order: https://threadtrends.com/orders/${orderData.orderNumber}

Thanks for shopping with Thread Trends!
    `.trim();
  }

  private generateOrderShippedHTML(orderData: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: #fff; padding: 30px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .tracking { background: #fff; border: 2px solid #000; padding: 20px; margin: 20px 0; text-align: center; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Order Has Shipped!</h1>
    </div>
    <div class="content">
      <p>Hi ${orderData.customerName},</p>
      <p>Great news! Your order <strong>#${orderData.orderNumber}</strong> is on its way!</p>
      
      <div class="tracking">
        <h3>Tracking Number</h3>
        <p style="font-size: 20px; font-weight: bold;">${orderData.trackingNumber}</p>
        <p>Carrier: ${orderData.carrier}</p>
      </div>
      
      <p>Expected delivery: <strong>${orderData.estimatedDelivery}</strong></p>
      
      <a href="${orderData.trackingUrl}" class="button">Track Package</a>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private generateOrderShippedText(orderData: any): string {
    return `Your Thread Trends order #${orderData.orderNumber} has shipped! Track it: ${orderData.trackingUrl}`;
  }

  private generateWelcomeHTML(userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 40px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .benefits { background: #fff; padding: 20px; margin: 20px 0; }
    .benefit { padding: 10px 0; border-bottom: 1px solid #eee; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Thread Trends!</h1>
      <p>Gen Z Fashion, Redefined</p>
    </div>
    <div class="content">
      <p>Hi ${userName},</p>
      <p>Welcome to the Thread Trends family! We're stoked to have you here. 🎉</p>
      
      <div class="benefits">
        <h3>What You Get:</h3>
        <div class="benefit">✨ Early access to new drops</div>
        <div class="benefit">🎁 Exclusive member discounts</div>
        <div class="benefit">📦 Free shipping on orders over ₹999</div>
        <div class="benefit">💎 Loyalty points on every purchase</div>
      </div>
      
      <p>Ready to elevate your wardrobe?</p>
      <a href="https://threadtrends.com/shop" class="button">Start Shopping</a>
      
      <p style="margin-top: 30px;">Follow us on social media for daily style inspo:</p>
      <p>Instagram | Twitter | TikTok @threadtrends</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private generateWelcomeText(userName: string): string {
    return `Welcome to Thread Trends, ${userName}! Get ready for exclusive drops, discounts, and more. Start shopping: threadtrends.com/shop`;
  }

  private generateMarketingHTML(campaignData: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .hero { background: ${campaignData.backgroundColor || '#000'}; color: #fff; padding: 50px 30px; text-align: center; }
    .content { padding: 30px; }
    .cta { text-align: center; padding: 30px; }
    .button { display: inline-block; background: #000; color: #fff; padding: 15px 40px; text-decoration: none; font-size: 18px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1>${campaignData.headline}</h1>
      <p style="font-size: 18px;">${campaignData.subheadline}</p>
    </div>
    <div class="content">
      ${campaignData.body}
    </div>
    <div class="cta">
      <a href="${campaignData.ctaUrl}" class="button">${campaignData.ctaText}</a>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  private generateMarketingText(campaignData: any): string {
    return `${campaignData.headline}

${campaignData.body}

${campaignData.ctaUrl}`;
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
