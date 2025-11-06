import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface ShopByChoiceProps {
  onNavigateShop: () => void;
}

const categories = [
  {
    id: 1,
    name: 'Graphic Tees',
    image: 'https://images.unsplash.com/photo-1760126130290-bbbc9b41292a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdHNoaXJ0JTIwbW9kZWx8ZW58MXx8fHwxNzYxOTg2MjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1702678839327-761d359c3c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3NjE5ODYyNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    name: 'Tank Tops',
    image: 'https://images.unsplash.com/photo-1621446511390-11c5e41c535c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YW5rJTIwdG9wJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NjE5ODYyNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 4,
    name: 'Bottoms',
    image: 'https://images.unsplash.com/photo-1726556267459-92384af28e30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VhdHBhbnRzJTIwYm90dG9tcyUyMGZhc2hpb258ZW58MXx8fHwxNzYxOTg2MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 5,
    name: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1623517621912-b03b457ddbbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdHJlZXR3ZWFyJTIwbW9kZWx8ZW58MXx8fHwxNzYxOTg2MjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 6,
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1665832102447-a853788f620c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMGNhc3VhbHxlbnwxfHx8fDE3NjE5ODU3NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function ShopByChoice({ onNavigateShop }: ShopByChoiceProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newScrollPosition = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-3 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 
            className="text-3xl sm:text-4xl"
            style={{
              fontFamily: '"Inter", "Segoe UI", "Helvetica Neue", Arial, "Liberation Sans", sans-serif',
              fontWeight: 250,
              letterSpacing: '-0.02em'
            }}
          >
            Shop by Choice
          </h1>
          
          {/* Navigation Arrows - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={onNavigateShop}
                className="flex-shrink-0 group"
              >
                <div className="w-[280px] sm:w-[320px]">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <div className="text-left">
                    <h3 className="text-lg group-hover:opacity-60 transition-opacity">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Gradient Overlays for better UX */}
          <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
