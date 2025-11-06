// @ts-nocheck
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign Up
app.post('/make-server-d9a3ff0a/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, role = 'customer' } = body;

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Only allow admin creation with special admin key (for security)
    const isAdmin = role === 'admin' && body.adminKey === 'thread-trends-admin-2024';

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: isAdmin ? 'admin' : 'customer'
      },
      email_confirm: true // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name,
        role: data.user.user_metadata.role
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Get Current User
app.get('/make-server-d9a3ff0a/auth/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({
      id: user.id,
      email: user.email,
      name: user.user_metadata.name,
      role: user.user_metadata.role || 'customer'
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ============================================
// PRODUCT MANAGEMENT ROUTES (Admin Only)
// ============================================

// Helper function to verify admin
async function verifyAdmin(c: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return { authorized: false, error: 'No access token provided' };
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    return { authorized: false, error: 'Unauthorized' };
  }

  if (user.user_metadata.role !== 'admin') {
    return { authorized: false, error: 'Admin access required' };
  }

  return { authorized: true, user };
}

// Get All Products
app.get('/make-server-d9a3ff0a/products', async (c) => {
  try {
    console.log('Fetching all products with prefix: product:');
    const products = await kv.getByPrefix('product:');
    console.log('Retrieved products count:', products?.length || 0);
    console.log('Products data:', JSON.stringify(products, null, 2));
    return c.json({ products: products || [] });
  } catch (error) {
    console.error('Get products error - detailed:', error);
    return c.json({ error: `Failed to fetch products: ${error.message}` }, 500);
  }
});

// Get Single Product
app.get('/make-server-d9a3ff0a/products/:id', async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(productId);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

// Add Product (Admin Only)
app.post('/make-server-d9a3ff0a/products', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (!auth.authorized) {
      console.error('Product add authorization failed:', auth.error);
      return c.json({ error: auth.error }, 401);
    }

    const product = await c.req.json();
    console.log('Adding product:', product);
    
    if (!product.name || !product.price || !product.category) {
      console.error('Product validation failed - missing required fields');
      return c.json({ error: 'Name, price, and category are required' }, 400);
    }

    // Generate unique ID
    const productId = `product:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('Generated product ID:', productId);
    
    const productData = {
      id: productId,
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Saving product to KV store:', productData);
    await kv.set(productId, productData);
    console.log('Product saved successfully to KV store');

    // Verify the product was saved
    const savedProduct = await kv.get(productId);
    console.log('Verified saved product:', savedProduct);

    return c.json({ success: true, product: productData });
  } catch (error) {
    console.error('Add product error - detailed:', error);
    return c.json({ error: `Failed to add product: ${error.message}` }, 500);
  }
});

// Update Product (Admin Only)
app.put('/make-server-d9a3ff0a/products/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (!auth.authorized) {
      return c.json({ error: auth.error }, 401);
    }

    const productId = c.req.param('id');
    const updates = await c.req.json();

    const existingProduct = await kv.get(productId);
    
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updatedProduct = {
      ...existingProduct,
      ...updates,
      id: productId,
      updatedAt: new Date().toISOString()
    };

    await kv.set(productId, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

// Delete Product (Admin Only)
app.delete('/make-server-d9a3ff0a/products/:id', async (c) => {
  try {
    const auth = await verifyAdmin(c);
    if (!auth.authorized) {
      return c.json({ error: auth.error }, 401);
    }

    const productId = c.req.param('id');
    await kv.del(productId);

    return c.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// Get User Orders
app.get('/make-server-d9a3ff0a/user/orders', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orders = await kv.getByPrefix(`order:${user.id}:`);
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.error('Get orders error:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Health check
app.get('/make-server-d9a3ff0a/health', (c) => {
  return c.json({ status: 'ok', message: 'Thread Trends API is running' });
});

// Test KV Store (for debugging)
app.get('/make-server-d9a3ff0a/test-kv', async (c) => {
  try {
    // Test writing
    const testKey = 'test:' + Date.now();
    const testValue = { message: 'Hello from KV store', timestamp: Date.now() };
    
    console.log('Testing KV set with key:', testKey);
    await kv.set(testKey, testValue);
    console.log('KV set successful');
    
    // Test reading
    console.log('Testing KV get with key:', testKey);
    const retrieved = await kv.get(testKey);
    console.log('KV get result:', retrieved);
    
    // Test prefix search
    console.log('Testing KV getByPrefix with prefix: product:');
    const products = await kv.getByPrefix('product:');
    console.log('Products found:', products?.length || 0);
    
    // Clean up
    await kv.del(testKey);
    
    return c.json({ 
      success: true, 
      testResult: { retrieved, productsCount: products?.length || 0 },
      products: products
    });
  } catch (error) {
    console.error('KV test error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);
