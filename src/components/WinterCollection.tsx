import { ProductCard } from './ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const winterProducts = [
  {
    id: 101,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBob29kaWV8ZW58MXx8fHwxNzYxOTg2MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Arctic Warmth Hoodie',
    price: 2999,
    originalPrice: 3999,
    isSale: true,
    category: 'Hoodies'
  },
  {
    id: 102,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqb2dnZXJzfGVufDF8fHx8MTc2MTk4NjI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Winter Essentials Joggers',
    price: 1999,
    category: 'Bottoms'
  },
  {
    id: 103,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBjb2F0fGVufDF8fHx8MTc2MTk4NjI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Insulated Winter Coat',
    price: 4999,
    originalPrice: 6999,
    isSale: true,
    category: 'Jackets'
  },
  {
    id: 104,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzd2VhdGVyfGVufDF8fHx8MTc2MTk4NjI2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Thermal Sweater Set',
    price: 2499,
    category: 'Sweaters'
  },
  {
    id: 105,
    image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBiZWFuaWV8ZW58MXx8fHwxNzYxOTg2MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Beanie Winter Cap',
    price: 799,
    category: 'Accessories'
  },
  {
    id: 106,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzaG9lc3xlbnwxfHx8fDE3NjE5ODYyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    name: 'Snowproof Boots',
    price: 3999,
    originalPrice: 5999,
    isSale: true,
    category: 'Footwear'
  }
];

interface WinterCollectionProps {
  onNavigateShop: () => void;
}

export function WinterCollection({ onNavigateShop }: WinterCollectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // Number of items to show per view based on screen size
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 768) return 2; // tablet
    if (window.innerWidth < 1024) return 3; // small desktop
    return 4; // large desktop
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  
  // Create extended array with clones for infinite loop
  const extendedProducts = [
    ...winterProducts,
    ...winterProducts,
    ...winterProducts
  ];

  // Update items per view on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set initial position to middle set
  useEffect(() => {
    setCurrentIndex(winterProducts.length);
  }, [itemsPerView]);

  // Handle infinite loop - check position after transition
  useEffect(() => {
    const carousel = carouselRef.current?.querySelector('.carousel-track') as HTMLElement;
    if (!carousel) return;

    const handleTransitionEnd = () => {
      // If we're at or past the end of the second set, jump to first set
      if (currentIndex >= winterProducts.length * 2) {
        carousel.style.transition = 'none';
        setCurrentIndex(winterProducts.length);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carousel.style.transition = 'transform 500ms ease-out';
          });
        });
      }
      // If we're before the first set, jump to second set
      else if (currentIndex < winterProducts.length) {
        carousel.style.transition = 'none';
        setCurrentIndex(winterProducts.length * 2 - 1);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carousel.style.transition = 'transform 500ms ease-out';
          });
        });
      }
    };

    carousel.addEventListener('transitionend', handleTransitionEnd);
    return () => carousel.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Add a placeholder function for product clicks
  const handleProductClick = () => {
    // For now, we'll just navigate to the shop when a product is clicked
    onNavigateShop();
  };

  return (
    <section id="winter-collection" className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-extrabold text-black tracking-widest uppercase">
              Winter Collection
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 relative">Stay Warm, Stay Stylish</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Our premium winter essentials to keep you cozy all season long
          </p>
        </div>

        {/* Carousel Track */}
        <div 
          className="flex-1 overflow-x-auto scrollbar-hide mb-6" 
          ref={carouselRef}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div
            className="carousel-track flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {extendedProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="flex-shrink-0 px-2 sm:px-3 md:px-4"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <div className="h-full">
                  <ProductCard {...product} id={product.id} onClick={handleProductClick} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors rounded-full"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors rounded-full"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-10 sm:mb-14">
          <button
            onClick={onNavigateShop}
            className="group inline-flex items-center gap-1 px-8 py-3 bg-black text-white hover:bg-gray-900 hover:scale-105 hover:shadow-xl transition-all duration-300 rounded-md"
          >
            <span>Shop Winter Collection</span>
            <ArrowRight className="w-2 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}