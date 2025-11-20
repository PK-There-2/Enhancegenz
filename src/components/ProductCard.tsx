import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useWishlist } from './WishlistContext';
import { useState } from 'react';

interface ProductCardProps {
  id?: string | number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  category: string;
  onClick?: () => void;
}

export function ProductCard({ id, image, name, price, originalPrice, isSale, category, onClick }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const productId = id?.toString() || name;
  const isWishlisted = isInWishlist(productId);
  const [justAdded, setJustAdded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        productId,
        name,
        price,
        image,
        category
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };
  return (
    <div onClick={onClick} className="group relative bg-white rounded-none overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl w-full h-full flex flex-col cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />  
        {/* Gradient hover veil */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Sale Badge */}
        {isSale && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full tracking-wider shadow-md">
            Sale
          </span>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 w-10 h-10 border rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isWishlisted 
              ? 'bg-black border-black text-white opacity-100' 
              : 'bg-white/95 border-black/10 opacity-100 hover:bg-black hover:text-white'
          } ${justAdded ? 'animate-bounce' : ''}`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info */}
      <div className="px-4 py-3 space-y-1.5 mt-auto min-h-[140px] flex flex-col">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
          {category}
        </p>
        <h3
          className="text-sm sm:text-base font-semibold text-gray-900 leading-snug min-h-[3.2rem] overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {name}
        </h3>
        <div className="flex items-baseline gap-2 pt-0.5 min-h-[28px] mt-auto">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
              {/* <span className="ml-1 inline-flex items-center justify-center text-[10px] leading-none px-1.5 py-[2px] rounded-full whitespace-nowrap bg-black text-white">
                {Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100))}% off
              </span> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
