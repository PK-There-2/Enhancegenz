import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import './styles/rewards-animations.css';
import { AuthProvider } from './components/AuthContext';
import { CartProvider, useCart } from './components/CartContext';
import { WishlistProvider } from './components/WishlistContext.tsx';
import { RewardsProvider } from './components/RewardsContext.tsx';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnimatedMarquee } from './components/AnimatedMarquee';
import { BestSellers } from './components/BestSellers';
import { ShopByChoice } from './components/ShopByChoice';
import { CollectionsGrid } from './components/CollectionsGrid';
import { NewsletterCTA } from './components/NewsletterCTA';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { Shop } from './components/Shop';
import { About } from './components/About';
import { Contact } from './components/Contact';
import UserPortal from './components/UserPortal.tsx';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetail, type ProductDetailData } from './components/ProductDetail';
import { FloatingRewardsButton } from './components/FloatingRewardsButton';
import { Checkout } from './components/Checkout';
import { RefundPolicy } from './components/RefundPolicy';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { RefundPolicyFooter } from './components/RefundPolicyFooter';
import { PrivacyPolicyFooter } from './components/PrivacyPolicyFooter';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/LoginPage';
import { RewardsPage } from './components/RewardsPage';

export default function App() {
  return (
    <AuthProvider>
      <RewardsProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </RewardsProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout' | 'refund-policy' | 'privacy-policy' | 'refund-policy-footer' | 'privacy-policy-footer' | 'contact-page' | 'login' | 'rewards'>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailData | null>(null);
  const [checkoutSource, setCheckoutSource] = useState<'cart' | 'buynow'>('cart');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { addToCart, cart, clearCart } = useCart();

  // Handle navigation events from components like Footer
  const handleNavigation = (event: CustomEvent) => {
    const detail = event.detail;
    
    // Handle simple page navigation
    if (typeof detail === 'string' && ['home', 'shop', 'about', 'contact', 'profile', 'admin', 'checkout', 'refund-policy', 'privacy-policy', 'refund-policy-footer', 'privacy-policy-footer', 'contact-page', 'login', 'rewards'].includes(detail)) {
      navigateToPage(detail as any);
      return;
    }
    
    // Handle complex navigation with scroll/filter
    if (typeof detail === 'object' && detail !== null) {
      const { page, scrollTo, filter } = detail;
      
      if (page && ['home', 'shop', 'about', 'contact', 'profile', 'admin', 'checkout', 'refund-policy', 'privacy-policy', 'refund-policy-footer', 'privacy-policy-footer', 'contact-page', 'login', 'rewards'].includes(page)) {
        navigateToPage(page as any);
        
        // Handle scroll to section
        if (scrollTo && page === 'home') {
          setTimeout(() => {
            const element = document.getElementById(scrollTo);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
        
        // Handle shop filtering
        if (filter && page === 'shop') {
          // We'll need to pass filter info to the Shop component
          // This will be handled by setting state in the App component
          window.dispatchEvent(new CustomEvent('shopFilter', { detail: filter }));
        }
      }
    }
  };

  const navigateToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (page: 'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout' | 'refund-policy' | 'privacy-policy' | 'refund-policy-footer' | 'privacy-policy-footer' | 'contact-page' | 'login' | 'rewards') => {
    setSelectedProduct(null); // Clear selected product when navigating
    setCurrentPage(page);
    // Clear search query when navigating away from shop
    if (page !== 'shop') {
      setSearchQuery('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleOpenProduct = (product: any) => {
    const mapped: ProductDetailData = {
      id: Number(product.id ?? 0),
      image: String(product.image ?? ''),
      name: String(product.name ?? 'Product'),
      price: Number(product.price ?? 0),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      isSale: Boolean(product.isSale),
      category: String(product.category ?? '')
    };
    setSelectedProduct(mapped);
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    // Go back to shop page when clicking back
    setCurrentPage('shop');
  };

  const handleAddToCart = (item: { product: ProductDetailData; size: string; qty: number }) => {
    addToCart({
      productId: String(item.product.id),
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      size: item.size,
    });
    
    // Show success toast/notification
    alert(`Added ${item.qty} x ${item.product.name} (Size: ${item.size}) to cart!`);
  };

  const renderPage = () => {
    // Show login page
    if (currentPage === 'login') {
      return <LoginPage onBack={() => navigateToPage('home')} onSuccess={() => navigateToPage('home')} />;
    }
    
    // Show rewards page
    if (currentPage === 'rewards') {
      return <RewardsPage onBack={() => navigateToPage('home')} />;
    }
    
    // Show checkout page
    if (currentPage === 'checkout') {
      // Only prepare cart data if checkout source is 'cart'
      // For 'buynow', the ProductDetail component already set the checkout data
      if (checkoutSource === 'cart') {
        // Prepare checkout data from cart
        const checkoutData = {
          items: cart.map(item => ({
            id: parseInt(item.productId),
            name: item.name,
            image: item.image,
            price: item.price,
            size: item.size,
            quantity: item.quantity
          })),
          total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
        // Save to localStorage for Checkout component
        localStorage.setItem('thread_trends_checkout_data', JSON.stringify(checkoutData));
      }
      
      return (
        <Checkout 
          onComplete={() => {
            // Only clear cart if checkout was from cart
            if (checkoutSource === 'cart') {
              clearCart();
            }
            setCheckoutSource('cart'); // Reset for next checkout
            navigateToPage('home');
          }}
          onCancel={() => {
            // Navigate to profile cart section if from cart, otherwise to shop
            if (checkoutSource === 'cart') {
              window.dispatchEvent(new CustomEvent('navigate-to-cart'));
              navigateToPage('profile');
            } else {
              setCurrentPage('shop');
            }
            setCheckoutSource('cart'); // Reset for next checkout
          }}
        />
      );
    }
    
    // Show refund policy page
    if (currentPage === 'refund-policy') {
      return <RefundPolicy onBack={() => navigateToPage('checkout')} />;
    }
    
    // Show privacy policy page
    if (currentPage === 'privacy-policy') {
      return <PrivacyPolicy onBack={() => navigateToPage('checkout')} />;
    }
    
    // Show contact page
    if (currentPage === 'contact-page') {
      return <ContactPage onBack={() => navigateToPage('checkout')} />;
    }
    
    // Show footer version of refund policy (scrolls to footer when closed)
    if (currentPage === 'refund-policy-footer') {
      return <RefundPolicyFooter onBack={() => {
        navigateToPage('home');
        setTimeout(() => {
          const footer = document.querySelector('footer');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }} />;
    }
    
    // Show footer version of privacy policy (scrolls to footer when closed)
    if (currentPage === 'privacy-policy-footer') {
      return <PrivacyPolicyFooter onBack={() => {
        navigateToPage('home');
        setTimeout(() => {
          const footer = document.querySelector('footer');
          if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }} />;
    }

    // Show product detail if a product is selected
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          onBack={handleBackFromProduct}
          onAddToCart={handleAddToCart}
          onNavigateCheckout={() => {
            setCheckoutSource('buynow');
            navigateToPage('checkout');
          }}
          onOpenProduct={handleOpenProduct}
        />
      );
    }
  
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigateShop={navigateToShop} />
            <AnimatedMarquee />
            <BestSellers onNavigateShop={navigateToShop} />
            <ShopByChoice onNavigateShop={navigateToShop} />
            <CollectionsGrid onNavigateShop={navigateToShop} />
            <FeaturesSection />
            <NewsletterCTA />
          </>
        );
      case 'shop':
        return <Shop onOpenProduct={handleOpenProduct} searchQuery={searchQuery} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'profile':
        // Add a wrapper div with minimum height to prevent white screen
        return (
          <div className="min-h-screen">
            <UserPortal onNavigate={(page) => navigateToPage(page as any)} />
          </div>
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };
  

  const showFooter = !['admin', 'checkout', 'login', 'rewards'].includes(currentPage);
  const showFloatingRewards = !['admin', 'checkout', 'login', 'rewards'].includes(currentPage);
  const showHeader = !['checkout', 'login', 'rewards'].includes(currentPage);

  // Add event listener for navigation events
  useEffect(() => {
    window.addEventListener('navigate', handleNavigation as EventListener);
    
    // Listen for checkout-from-cart event
    const handleCheckoutFromCart = () => {
      setCheckoutSource('cart');
    };
    window.addEventListener('checkout-from-cart', handleCheckoutFromCart);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
      window.removeEventListener('checkout-from-cart', handleCheckoutFromCart);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      {showHeader && (
        <Header 
          currentPage={currentPage} 
          onNavigate={navigateToPage}
          onSearch={handleSearch}
        />
      )}
      {showFloatingRewards && <FloatingRewardsButton onNavigate={navigateToPage} />}
      {renderPage()}
      {showFooter && <Footer />}

      <Toaster position="top-right" richColors />
    </div>
  );
}
