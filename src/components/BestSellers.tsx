import { ProductCard } from './ProductCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const bestSellerProducts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Passion & Purpose Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1711387718409-a05f62a3dc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MTk3NjI0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Urban Hoodie Black',
    price: 2499,
    category: 'Hoodies'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTAyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Lost in Space Oversized Tee',
    price: 1299,
    originalPrice: 1999,
    isSale: true,
    category: 'Oversized'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1715865871494-6bba579c2dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE5NTQxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Vintage Denim Jeans',
    price: 2999,
    category: 'Bottoms'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1715865871494-6bba579c2dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE5NTQxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Vintage Denim Jeans',
    price: 599,
    category: 'Bottoms'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Passion & Purpose Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Passion & Purpose Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Passion & Purpose Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees'
  },
];

interface BestSellersProps {
  onNavigateShop: () => void;
}

export function BestSellers({ onNavigateShop }: BestSellersProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

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
    ...bestSellerProducts,
    ...bestSellerProducts,
    ...bestSellerProducts
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
    setCurrentIndex(bestSellerProducts.length);
  }, [itemsPerView]);

  // Handle infinite loop - check position after transition
  useEffect(() => {
    const carousel = carouselRef.current?.querySelector('.carousel-track') as HTMLElement;
    if (!carousel) return;

    const handleTransitionEnd = () => {
      // If we're at or past the end of the second set, jump to first set
      if (currentIndex >= bestSellerProducts.length * 2) {
        carousel.style.transition = 'none';
        setCurrentIndex(bestSellerProducts.length);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            carousel.style.transition = 'transform 500ms ease-out';
          });
        });
      }
      // If we're before the first set, jump to second set
      else if (currentIndex < bestSellerProducts.length) {
        carousel.style.transition = 'none';
        setCurrentIndex(bestSellerProducts.length * 2 - 1);
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

  return (
    <section id="best-sellers" className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-sm font-extrabold text-black tracking-widest uppercase">
              Best Sellers
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 relative">Most Loved Pieces</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Our community's favorites. These pieces sell out fast
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-10 sm:mb-14 flex items-center gap-4">
          {/* Left Navigation Button */}
          <button
            onClick={handlePrevious}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Track */}
          <div className="flex-1 overflow-hidden" ref={carouselRef}>
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
                  <ProductCard {...product} id={product.id} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={handleNext}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
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
            <span>Shop All Products</span>
            <ArrowRight className="w-2 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
