import { useState, useRef, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from './AuthContext';

const PRODUCTS_STORAGE_KEY = 'thread_trends_products';

export interface ProductDetailData {
  id: number;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  isSale?: boolean;
  category: string;
}

interface ProductDetailProps {
  product: ProductDetailData;
  onBack: () => void;
  onAddToCart?: (item: { product: ProductDetailData; size: string; qty: number }) => void;
  onNavigateCheckout?: () => void;
  onOpenProduct?: (product: any) => void;
}

export function ProductDetail({ product, onBack, onAddToCart, onNavigateCheckout, onOpenProduct }: ProductDetailProps) {
  const [activeSize, setActiveSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('S');
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const { user, openAuthWindow } = useAuth();

  // Load related products from localStorage
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        const allProducts = JSON.parse(storedProducts);
        // Filter out the current product and get up to 4 random products
        const filtered = allProducts.filter((p: any) => p.id !== product.id.toString() && p.id !== product.id);
        
        // Shuffle and get 4 random products
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedProducts(shuffled.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  }, [product.id]);

  const handleBuyNow = () => {
    if (!user) {
      alert('Please sign in to continue with your purchase');
      openAuthWindow();
      return;
    }
    
    // Prepare checkout data
    const checkoutData = {
      items: [
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          size: activeSize,
          quantity: qty
        }
      ],
      total: product.price * qty
    };

    // Save to localStorage for the checkout page
    localStorage.setItem('thread_trends_checkout_data', JSON.stringify(checkoutData));

    // Navigate to checkout
    if (onNavigateCheckout) {
      onNavigateCheckout();
    }
  };

  const sizes: Array<'S' | 'M' | 'L' | 'XL' | 'XXL'> = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <section className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Single Product Image */}
          <div>
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-normal text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-normal text-gray-900">
                  Rs. {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-normal mb-4 text-gray-900">SIZE</h3>
              <div className="flex gap-4 ">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`min-w-[80px] px-10 py-4 text-sm font-normal transition-all rounded-2xl
                      ${
                      activeSize === s 
                        ? 'bg-black text-white'  
                        : 'bg-white text-gray-900 border border-gray-300 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
<br></br>
            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button 
                    onClick={() => setQty((q) => Math.max(1, q - 1))} 
                    className="px-4 py-1 hover:bg-gray-50 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 text-base min-w-[60px] text-center">{qty}</span>
                  <button 
                    onClick={() => setQty((q) => q + 1)} 
                    className="px-4 py-2 hover:bg-gray-50 transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex-1 px-8 py-3 bg-black text-white font-normal rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  onClick={() => onAddToCart && onAddToCart({ product, size: activeSize, qty })}
                >
                  <ShoppingBag className="w-4 h-4 " />
                  Add to cart
                </button>
              </div>
            

              <button 
                className="w-full px-8 py-3 bg-black text-white font-normal rounded-2xl hover:bg-gray-800 transition-all"
                onClick={handleBuyNow}
              >
                Buy it now
              </button>
            </div>
<br></br><br></br>
            {/* Description */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-600 leading-relaxed text-sm">
                Crafted from luxurious 220gsm cotton, it delivers a soft yet-structured feel that holds its shape while giving you all-day comfort. The heavyweight fabric ensures durability without compromising breathability, making it perfect for any season.
              </p>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-normal mb-8 text-gray-900">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  {...relatedProduct} 
                  id={relatedProduct.id}
                  onClick={() => onOpenProduct && onOpenProduct(relatedProduct)}
                />
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        
        <div className="mt-24 mb-16">
          <br></br><br></br>
          <h2 className="text-2xl font-normal mb-10 text-gray-900">Frequently asked questions</h2>
          <div className="space-y-0 border-t border-gray-400 max-w-3xl mx-auto">
            <FaqItem question="What is the return policy?">
              If you receive a wrong or damaged product, just send us a photo with proof within 48 hours of delivery, and we will either refund or replace your item, whichever is possible.
            </FaqItem>
            <FaqItem question="Will the print crack or fade after washing?">
              No. The print is made with high-quality, durable material that won't crack or fade with proper care.
            </FaqItem>
            <FaqItem question="How long will shipping take?">
              We dispatch all orders within 48 hours. Delivery typically takes 3-7 business days depending on your location.
            </FaqItem>
            <FaqItem question="Can I iron over the print?">
              We recommend not ironing directly over the print. Turn the garment inside out or place a cloth over the print before ironing.
            </FaqItem>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-gray-300">
      {/* Button Row — text + icon perfectly centered */}
      <button
        className="flex items-center justify-between w-full py-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base text-gray-900 leading-tight flex items-center">
          {question}
        </span>
        <svg
          className="w-5 h-5 text-gray-500 transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="pb-4 text-gray-700 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}


