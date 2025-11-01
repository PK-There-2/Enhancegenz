import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AnimatedMarquee } from './components/AnimatedMarquee';
import { BestSellers } from './components/BestSellers';
import { CollectionsGrid } from './components/CollectionsGrid';
import { NewsletterCTA } from './components/NewsletterCTA';
import { FeaturesSection } from './components/FeaturesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Shop } from './components/Shop';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop'>('home');

  const navigateToShop = () => {
    setCurrentPage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (page: 'home' | 'shop') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={navigateToPage} />
      
      {currentPage === 'home' ? (
        <>
          <Hero onNavigateShop={navigateToShop} />
          <AnimatedMarquee />
          <BestSellers onNavigateShop={navigateToShop} />
          <CollectionsGrid onNavigateShop={navigateToShop} />
          <FeaturesSection />
          <NewsletterCTA />
          <ContactSection />
        </>
      ) : (
        <Shop />
      )}
      
      <Footer />
    </div>
  );
}
