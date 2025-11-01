# How to Add Products to Thread Trends

## Overview
This guide will help you add new clothing items to your Thread Trends website.

## Product Data Location
All products are stored in the following files:

1. **Shop Page Products**: `/components/Shop.tsx` (lines 6-110+)
2. **Best Sellers**: `/components/BestSellers.tsx`
3. **Shop by Choice**: `/components/ShopByChoice.tsx`

---

## Adding Products to the Shop Page

### Step 1: Open the Shop.tsx file
Navigate to `/components/Shop.tsx`

### Step 2: Find the products array
Look for the `products` array starting around line 6:

```typescript
const products = [
  {
    id: 1,
    image: 'url-to-image',
    name: 'Product Name',
    price: 1299,
    originalPrice: 1899,  // Optional
    isSale: true,         // Optional
    category: 'Graphic Tees',
    type: 'tshirts',
    gender: 'unisex'
  },
  // ... more products
];
```

### Step 3: Add your new product
Copy one of the existing product objects and modify it with your new product details:

```typescript
{
  id: 11,  // Make sure this is unique!
  image: 'https://your-image-url.com/image.jpg',  // See "Getting Images" section below
  name: 'Your New Product Name',
  price: 1599,  // Price in rupees
  originalPrice: 2199,  // Optional: only if on sale
  isSale: true,  // Optional: set to true if on sale
  category: 'Graphic Tees',  // Choose from categories below
  type: 'tshirts',  // Choose from types below
  gender: 'men'  // 'men', 'women', or 'unisex'
}
```

### Product Categories
- `Graphic Tees`
- `Oversized`
- `Hoodies`
- `Bottoms`
- `Jackets`
- `Accessories`
- `Essentials`

### Product Types
- `tshirts`
- `hoodies`
- `pants`
- `jackets`
- `accessories`

### Gender Options
- `men`
- `women`
- `unisex`

---

## Getting Images for Products

### Option 1: Use Unsplash (Free Stock Images)
1. Go to [Unsplash](https://unsplash.com)
2. Search for your product type (e.g., "graphic tshirt", "hoodie", "denim jeans")
3. Right-click on the image and copy the image URL
4. Paste the URL in the `image` field

### Option 2: Upload Your Own Images
If you have product photos:
1. Upload them to an image hosting service like:
   - Imgur
   - Cloudinary
   - Your own server
2. Get the direct image URL
3. Paste the URL in the `image` field

**Important**: Make sure the URL is a direct link to the image file (ending in .jpg, .png, etc.)

---

## Adding Products to Best Sellers

### Location: `/components/BestSellers.tsx`

Find the `bestSellers` array and add your product:

```typescript
const bestSellers = [
  {
    id: 1,
    name: 'Your Best Seller',
    price: 1299,
    originalPrice: 1899,
    image: 'image-url'
  },
  // Add more here
];
```

---

## Adding Categories to "Shop by Choice"

### Location: `/components/ShopByChoice.tsx`

Find the `categories` array and add new categories:

```typescript
const categories = [
  {
    id: 1,
    name: 'Your Category Name',
    image: 'image-url-showing-this-category'
  },
  // Add more here
];
```

**Tips for category images**:
- Use lifestyle photos showing people wearing the category
- Make sure images are high quality
- Keep the aspect ratio consistent (portrait orientation works best)

---

## Example: Adding a New Hoodie

```typescript
// In /components/Shop.tsx, add to the products array:

{
  id: 15,
  image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7',
  name: 'Vintage Oversized Hoodie - Navy',
  price: 2999,
  originalPrice: 4499,
  isSale: true,
  category: 'Hoodies',
  type: 'hoodies',
  gender: 'unisex'
}
```

---

## Important Notes

1. **Unique IDs**: Always make sure each product has a unique `id` number
2. **Image URLs**: Test your image URLs in a browser to make sure they work
3. **Prices**: Enter prices in rupees (₹)
4. **Categories**: Keep category names consistent with existing ones for filters to work properly
5. **Order**: Products appear in the order they're listed in the array

---

## Testing Your Changes

After adding products:
1. Save the file
2. The website will automatically reload
3. Check the Shop page to see your new products
4. Test the filters to make sure they work correctly
5. Verify images load properly

---

## Need More Help?

- Check existing products as examples
- Make sure all required fields are filled
- Keep the structure exactly the same as existing products
- Don't forget commas between products!

Happy selling! 🛍️
