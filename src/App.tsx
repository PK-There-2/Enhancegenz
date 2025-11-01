import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnimatedMarquee } from './components/AnimatedMarquee';
import { BestSellers } from './components/BestSellers';
import { CollectionsGrid } from './components/CollectionsGrid';
import { NewsletterCTA } from './components/NewsletterCTA';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { Shop } from './components/Shop';
import { About } from './components/About';
import { Contact } from './components/Contact';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact'>('home');

  const navigateToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (page: 'home' | 'shop' | 'about' | 'contact') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigateShop={navigateToShop} />
            <AnimatedMarquee />
            <BestSellers onNavigateShop={navigateToShop} />
            <CollectionsGrid onNavigateShop={navigateToShop} />
            <FeaturesSection />
            <NewsletterCTA />
          </>
        );
      case 'shop':
        return <Shop />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={navigateToPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}
