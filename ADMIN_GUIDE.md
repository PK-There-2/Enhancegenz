# Thread Trends Admin Portal Guide

## 🎉 Your Admin Portal is Now Live!

Your Thread Trends website now has a complete authentication system with a powerful Admin Dashboard and User Portal.

---

## 🔐 Authentication System

### For Regular Users (Customers)

1. **Sign Up:**
   - Click the user icon in the header
   - Click "Sign In / Sign Up"
   - Fill in your name, email, and password
   - Click "Create Account"

2. **Sign In:**
   - Click the user icon in the header
   - Click "Sign In / Sign Up"
   - Enter your email and password
   - Click "Sign In"

3. **Access Your Account:**
   - After signing in, click the user icon
   - Click "My Account" to view your profile
   - View orders and wishlist

---

## 👑 Admin Access

### Creating an Admin Account

To create an admin account, you need the admin key:

1. Click "Sign Up"
2. Fill in your details
3. Click "Register as Admin?" link
4. Enter the admin key: `thread-trends-admin-2024`
5. Click "Create Account"

**Important:** Keep this admin key secure! Anyone with this key can create admin accounts.

### Admin Demo Credentials

For quick testing, you can create an admin account using:
- Email: `admin@threadtrends.com`
- Password: `admin123`
- Admin Key: `thread-trends-admin-2024`

---

## 🎛️ Admin Dashboard Features

### Dashboard Overview

Once logged in as admin, you'll see:

1. **Statistics Cards:**
   - Total Products
   - Products on Sale
   - Number of Categories
   - Average Price

2. **Product Management Panel:**
   - Search products
   - Add new products
   - Edit existing products
   - Delete products

### Adding a New Product

1. Click "Add Product" button
2. Fill in the product details:
   - **Product Name** (required)
   - **Image URL** (required) - Get images from Unsplash
   - **Price** (required) - In rupees (₹)
   - **Original Price** (optional) - For sale items
   - **Category** - Select from dropdown
   - **Type** - T-Shirts, Hoodies, etc.
   - **Gender** - Men, Women, or Unisex
   - **On Sale** - Check if discounted

3. Click "Add Product"

### Editing a Product

1. Find the product in the list
2. Click the edit icon (pencil)
3. Modify the fields you want to change
4. Click "Update Product"

### Deleting a Product

1. Find the product in the list
2. Click the delete icon (trash)
3. Confirm the deletion

### Searching Products

Use the search bar to quickly find products by:
- Product name
- Category

---

## 👤 User Portal Features

Regular users can access their portal by:

1. Signing in
2. Clicking the user icon
3. Selecting "My Account"

**User Portal Sections:**

- **Profile** - View account information
- **My Orders** - View order history (coming soon)
- **Wishlist** - Saved items (coming soon)

---

## 🔄 How Data Syncs

### Backend Architecture

The system uses a 3-tier architecture:
- **Frontend** - React components
- **Server** - Supabase Edge Function (Hono web server)
- **Database** - Supabase KV Store

### Data Flow

1. **Admin adds product:**
   - Frontend sends data to server
   - Server validates admin credentials
   - Product saved to database
   - Database automatically syncs to all users

2. **Customer views products:**
   - Frontend fetches from server
   - Server retrieves from database
   - Products displayed in shop

---

## 🎨 Getting Product Images

### Option 1: Unsplash (Recommended)

1. Go to [Unsplash.com](https://unsplash.com)
2. Search for your product type
3. Right-click the image
4. Copy image address
5. Paste URL in the "Image URL" field

### Option 2: Upload Your Own

1. Upload to a service like:
   - Imgur.com
   - Cloudinary.com
   - Your own server
2. Get the direct image URL
3. Paste in the "Image URL" field

---

## 💡 Pro Tips

### For Admins:

1. **Organize Products:** Use consistent category names
2. **High-Quality Images:** Use clear, high-resolution product photos
3. **Competitive Pricing:** Check market rates before setting prices
4. **Sale Items:** Mark seasonal items on sale to boost conversions
5. **Regular Updates:** Keep adding new products to keep customers engaged

### For Managing the Store:

1. **Categories:** Keep 5-10 main categories for easy navigation
2. **Product Names:** Be descriptive but concise
3. **Pricing Strategy:** Consider psychological pricing (₹999 vs ₹1000)
4. **Image Consistency:** Use similar angles/styles for professional look

---

## 🚀 Advanced Features

### Admin-Only Features:

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time product management
- ✅ Statistics dashboard
- ✅ Search and filter products
- ✅ Bulk operations support

### User Features:

- ✅ Secure authentication
- ✅ Personal profile
- ✅ Order tracking (ready to integrate)
- ✅ Wishlist (ready to integrate)

---

## 🔒 Security Features

1. **Password Protection:** All accounts require secure passwords (min 6 characters)
2. **Role-Based Access:** Only admins can modify products
3. **Secure Tokens:** JWT authentication for API calls
4. **Admin Key:** Prevents unauthorized admin account creation

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Make sure you're signed in
- Check if you have admin privileges
- Try signing out and back in

### Products Not Appearing
- Check the search filter
- Refresh the page
- Verify the product was saved successfully

### Can't Sign In
- Verify email and password are correct
- Make sure account was created successfully
- Check for typos

---

## 📱 Mobile Support

The entire system is fully responsive:
- Admin dashboard works on tablets
- User portal optimized for mobile
- Authentication forms mobile-friendly

---

## 🎯 Next Steps

### Recommended Enhancements:

1. **Shopping Cart:** Add cart functionality
2. **Payment Integration:** Integrate Razorpay/Stripe
3. **Order Processing:** Complete order management system
4. **Email Notifications:** Send order confirmations
5. **Product Reviews:** Let customers review products
6. **Inventory Management:** Track stock levels

---

## 📞 Need Help?

- Check the console for error messages
- Review the PRODUCT_GUIDE.md for product structure
- Test with demo credentials first
- Start with a few products before scaling

---

## 🎉 You're All Set!

Your Thread Trends store now has:
✅ User authentication
✅ Admin dashboard
✅ Product management
✅ User profiles
✅ Professional UI/UX
✅ Mobile responsive design

**Start managing your store today!** 🚀
