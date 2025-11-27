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
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // Number of items to show per view based on screen size (increased for smaller cards)
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 2.5; // mobile - show 2.5 cards
    if (window.innerWidth < 768) return 3.5; // tablet - show 3.5 cards
    if (window.innerWidth < 1024) return 4.5; // small desktop - show 4.5 cards
    return 6.0; // large desktop - show 5.5 cards
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

  // Handle infinite scroll loop with smooth repositioning
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      const scrollLeft = container.scrollLeft;
      const singleSetWidth = container.scrollWidth / 3; // Since we have 3 sets of products
      
      // If scrolled past the end of the second set, jump to first set
      if (scrollLeft >= singleSetWidth * 2 - 100) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = singleSetWidth;
        setTimeout(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        }, 50);
      }
      // If scrolled before the first set, jump to second set
      else if (scrollLeft <= 100) {
        isScrollingRef.current = true;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft = singleSetWidth * 2 - (container.scrollWidth / 3);
        setTimeout(() => {
          container.style.scrollBehavior = 'smooth';
          isScrollingRef.current = false;
        }, 50);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to middle set on mount to enable infinite scroll in both directions
  useEffect(() => {
    if (carouselRef.current) {
      const singleSetWidth = carouselRef.current.scrollWidth / 3;
      carouselRef.current.scrollLeft = singleSetWidth;
    }
  }, []);

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
      </div>

      {/* Carousel Track - Full Width */}
      <div 
        className="overflow-x-auto scrollbar-hide mb-6 scroll-smooth w-full"
        ref={carouselRef}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex w-max">
          {extendedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 px-2 sm:px-3 md:px-4"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              <div className="h-full">
                <ProductCard {...product} id={product.id} onClick={onNavigateShop} />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{padding : '2rem'}}>
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
