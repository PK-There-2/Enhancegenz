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
    <div className="group relative">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden mb-4">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Sale Badge */}
        {isSale && (
          <span className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-xs tracking-wider">
            SALE
          </span>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black hover:text-white">
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add Button */}
        <button className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          Quick Add
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{category}</p>
        <h3 className="text-sm">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
