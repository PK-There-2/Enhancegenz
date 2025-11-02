import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  category: string;
}

export function ProductCard({ image, name, price, originalPrice, isSale, category }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl w-full">
      {/* Image Container - Taller and Wider */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden mb-6">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />  
        
        {/* Sale Badge - Larger */}
        {isSale && (
          <span className="absolute top-5 left-5 bg-black text-white px-5 py-2.5 text-base font-bold tracking-wider shadow-xl">
            SALE
          </span>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-5 right-5 w-14 h-14 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white shadow-xl hover:scale-110">
          <Heart className="w-6 h-6" />
        </button>
      </div>

      {/* Product Info - Larger with Modern Typography */}
      <div className="px-4 pb-6 space-y-3">
        <p className="text-sm sm:text-base text-gray-600 uppercase tracking-widest font-semibold">
          {category}
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight min-h-[3.5rem]">
          {name}
        </h3>
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-base sm:text-lg text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
