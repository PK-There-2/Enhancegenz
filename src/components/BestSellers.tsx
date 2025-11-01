import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

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
  }
];

interface BestSellersProps {
  onNavigateShop: () => void;
}

export function BestSellers({ onNavigateShop }: BestSellersProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with glossy effect */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <span className="text-sm tracking-widest uppercase bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ⚡ Best Sellers
            </span>
          </div>
          <h2 className="text-5xl sm:text-6xl mb-6 relative">
            Most Loved Pieces
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our community's favorites. These pieces sell out fast ⚡
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {bestSellerProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onNavigateShop}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
          >
            <span>Shop All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
