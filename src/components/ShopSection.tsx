import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

// Sample product data
const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Passion & Purpose Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees',
    type: 'tshirts',
    gender: 'unisex'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1702609342206-c37562b99740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdGVlJTIwZGVzaWdufGVufDF8fHx8MTc2MTk3NzU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'The Cynosure Tee',
    price: 1299,
    originalPrice: 1899,
    isSale: true,
    category: 'Graphic Tees',
    type: 'tshirts',
    gender: 'men'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTAyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Lost in Space - Oversized Graphic Tee',
    price: 1299,
    originalPrice: 1999,
    isSale: true,
    category: 'Oversized',
    type: 'tshirts',
    gender: 'unisex'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Oversized Graphic T-Shirt',
    price: 899,
    originalPrice: 1499,
    isSale: true,
    category: 'Oversized',
    type: 'tshirts',
    gender: 'women'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1702609342206-c37562b99740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdGVlJTIwZGVzaWdufGVufDF8fHx8MTc2MTk3NzU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Minimal Black Tee',
    price: 999,
    category: 'Essentials',
    type: 'tshirts',
    gender: 'unisex'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTAyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Essential White Tee',
    price: 799,
    category: 'Essentials',
    type: 'tshirts',
    gender: 'men'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Streetwear Hoodie',
    price: 2499,
    category: 'Hoodies',
    type: 'hoodies',
    gender: 'unisex'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1702609342206-c37562b99740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdGVlJTIwZGVzaWdufGVufDF8fHx8MTc2MTk3NzU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Cargo Pants',
    price: 2999,
    category: 'Bottoms',
    type: 'pants',
    gender: 'women'
  }
];

export function ShopSection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.type !== selectedCategory) return false;
    if (selectedGender !== 'all' && product.gender !== selectedGender && product.gender !== 'unisex') return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <section id="shop" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl mb-4">Shop</h2>
          <p className="text-gray-600 max-w-2xl">
            Discover our curated collection of premium clothing designed for the modern wardrobe
          </p>
        </div>

        {/* Filters Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-black/10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{sortedProducts.length} products</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border border-black/10 px-4 py-2 pr-10 cursor-pointer hover:border-black/30 transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 p-6 bg-gray-50 border border-black/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <h3 className="mb-3">Category</h3>
                <div className="space-y-2">
                  {['all', 'tshirts', 'hoodies', 'pants'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{cat === 'all' ? 'All Products' : cat === 'tshirts' ? 'T-Shirts' : cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div>
                <h3 className="mb-3">Gender</h3>
                <div className="space-y-2">
                  {['all', 'men', 'women', 'unisex'].map((gender) => (
                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={selectedGender === gender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{gender === 'all' ? 'All' : gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Style Tags */}
              <div>
                <h3 className="mb-3">Style</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors text-sm">
                    Graphic
                  </button>
                  <button className="px-4 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors text-sm">
                    Minimal
                  </button>
                  <button className="px-4 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors text-sm">
                    Oversized
                  </button>
                  <button className="px-4 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors text-sm">
                    Vintage
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        {sortedProducts.length >= 8 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors">
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
