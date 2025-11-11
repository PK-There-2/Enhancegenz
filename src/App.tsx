import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import './styles/rewards-animations.css';
import { AuthProvider } from './components/AuthContext';
import { CartProvider } from './components/CartContext';
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
import AuthModal from './components/AuthModal.tsx';
import UserPortal from './components/UserPortal.tsx';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetail, type ProductDetailData } from './components/ProductDetail';
import { FloatingRewardsButton } from './components/FloatingRewardsButton';
import { Checkout } from './components/Checkout';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout'>('home');
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigateToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (page: 'home' | 'shop' | 'about' | 'contact' | 'profile' | 'admin' | 'checkout') => {
    setSelectedProduct(null); // Clear selected product when navigating
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const renderPage = () => {
    // Show checkout page
    if (currentPage === 'checkout') {
      return (
        <Checkout 
          onComplete={() => navigateToPage('home')}
          onCancel={() => navigateToPage('shop')}
        />
      );
    }

    // Show product detail if a product is selected
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          onBack={handleBackFromProduct}
          onNavigateCheckout={() => navigateToPage('checkout')}
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
        return <Shop onOpenProduct={handleOpenProduct} />;
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
  

  const showFooter = !['admin', 'checkout'].includes(currentPage);
  const showFloatingRewards = !['admin', 'checkout'].includes(currentPage);
  const showHeader = !['checkout'].includes(currentPage);

  return (
    <AuthProvider>
      <RewardsProvider>
        <CartProvider>
          <WishlistProvider>
          <div className="min-h-screen bg-white relative">
            {showHeader && (
              <Header 
                currentPage={currentPage} 
                onNavigate={navigateToPage}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}
            {showFloatingRewards && <FloatingRewardsButton />}
            {renderPage()}
            {showFooter && <Footer />}

            <AuthModal 
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onSuccess={() => {
                setIsAuthModalOpen(false);
                // Ensure body overflow is reset
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');
                // Navigate to profile
                setTimeout(() => {
                  navigateToPage('profile');
                }, 50);
              }}
            />

            <Toaster position="top-right" richColors />
          </div>
          </WishlistProvider>
        </CartProvider>
      </RewardsProvider>
    </AuthProvider>
  );
}
