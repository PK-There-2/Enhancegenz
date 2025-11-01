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
    image: 'https://images.unsplash.com/photo-1711387718409-a05f62a3dc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MTk3NjI0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Urban Hoodie Black',
    price: 2499,
    category: 'Hoodies',
    type: 'hoodies',
    gender: 'unisex'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1715865871494-6bba579c2dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE5NTQxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Vintage Denim Jeans',
    price: 2999,
    category: 'Bottoms',
    type: 'pants',
    gender: 'unisex'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTc4NzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Retro Windbreaker',
    price: 3499,
    category: 'Jackets',
    type: 'jackets',
    gender: 'unisex'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1617229378071-daa5eeff0db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc2MTk3ODc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Minimalist Backpack',
    price: 1999,
    category: 'Accessories',
    type: 'accessories',
    gender: 'unisex'
  },
  {
    id: 9,
    image: 'https://images.unsplash.com/photo-1702609342206-c37562b99740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwdGVlJTIwZGVzaWdufGVufDF8fHx8MTc2MTk3NzU5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Essential White Tee',
    price: 799,
    category: 'Essentials',
    type: 'tshirts',
    gender: 'men'
  },
  {
    id: 10,
    image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTAyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Minimal Black Tee',
    price: 799,
    category: 'Essentials',
    type: 'tshirts',
    gender: 'women'
  },
  {
    id: 11,
    image: 'https://images.unsplash.com/photo-1711387718409-a05f62a3dc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc2MTk3NjI0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Oversized Hoodie Grey',
    price: 2699,
    category: 'Hoodies',
    type: 'hoodies',
    gender: 'unisex'
  },
  {
    id: 12,
    image: 'https://images.unsplash.com/photo-1715865871494-6bba579c2dc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjE5NTQxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    name: 'Straight Fit Jeans',
    price: 2499,
    category: 'Bottoms',
    type: 'pants',
    gender: 'women'
  }
];

export function Shop() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(true);

  const toggleCategory = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== 'all'), category];
      setSelectedCategories(newCategories.length === 0 ? ['all'] : newCategories);
    }
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setSelectedCategories(['all']);
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSortBy('featured');
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (!selectedCategories.includes('all')) {
      const categoryMatch = selectedCategories.some(cat => {
        if (cat === 'streetwear') return product.category.toLowerCase().includes('graphic') || product.category.toLowerCase().includes('urban');
        if (cat === 'men') return product.gender === 'men' || product.gender === 'unisex';
        if (cat === 'women') return product.gender === 'women' || product.gender === 'unisex';
        if (cat === 'accessories') return product.type === 'accessories';
        return false;
      });
      if (!categoryMatch) return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
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
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-4">Shop All</h1>
          <p className="text-gray-600 max-w-2xl text-lg">
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
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
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

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    <h3 className="text-xl">Filters</h3>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="text-sm hover:opacity-60 transition-opacity"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="mb-4">Category</h4>
                    <div className="space-y-3">
                      {[
                        { value: 'all', label: 'All Products' },
                        { value: 'streetwear', label: 'Streetwear' },
                        { value: 'men', label: 'Men' },
                        { value: 'women', label: 'Women' },
                        { value: 'accessories', label: 'Accessories' }
                      ].map((cat) => (
                        <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.value)}
                              onChange={() => toggleCategory(cat.value)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-all flex items-center justify-center">
                              {selectedCategories.includes(cat.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="group-hover:opacity-60 transition-opacity">{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="mb-4">Price Range</h4>
                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="100"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                          style={{
                            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${(priceRange[1] / 5000) * 100}%, #e5e7eb ${(priceRange[1] / 5000) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rs. {priceRange[0]}</span>
                        <span className="text-sm">Rs. {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div>
                    <h4 className="mb-4">Size</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`py-3 border-2 rounded-lg transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-pink-500 bg-pink-50 text-pink-600'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm hover:opacity-60 transition-opacity"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="mb-3">Category</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Products' },
                        { value: 'streetwear', label: 'Streetwear' },
                        { value: 'men', label: 'Men' },
                        { value: 'women', label: 'Women' }
                      ].map((cat) => (
                        <label key={cat.value} className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat.value)}
                              onChange={() => toggleCategory(cat.value)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-pink-500 peer-checked:border-pink-500 transition-all flex items-center justify-center">
                              {selectedCategories.includes(cat.value) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="mb-3">Price Range</h4>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-pink-500"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span>Rs. {priceRange[0]}</span>
                      <span>Rs. {priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Load More */}
            {sortedProducts.length >= 8 && (
              <div className="mt-12 text-center">
                <button className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
