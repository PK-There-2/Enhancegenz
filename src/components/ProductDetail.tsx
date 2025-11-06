import { useState, useRef } from 'react';
import { ProductCard } from './ProductCard';

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
}

export function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [activeSize, setActiveSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('S');
  const [qty, setQty] = useState(1);

  const sizes: Array<'S' | 'M' | 'L' | 'XL' | 'XXL'> = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={onBack} className="mb-6 text-sm underline">Back to products</button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Gallery */}
          <div className="space-y-4 lg:sticky lg:top-24">
            <div className="w-full overflow-hidden border border-black/10">
              <img src={product.image} alt={product.name} className="w-full aspect-[4/5] object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden border border-black/10">
                <img src={product.image} alt="alt" className="w-full aspect-square object-cover" />
              </div>
              <div className="overflow-hidden border border-black/10">
                <img src={product.image} alt="alt" className="w-full aspect-square object-cover" />
              </div>
            </div>
          </div>

          {/* Buy section */}
          <div>
            <h1 className="text-3xl sm:text-4xl mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`w-12 h-10 border rounded ${activeSize === s ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center border border-black/20">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
                <span className="px-4">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
              </div>
              <button
                className="flex-1 px-6 py-3 bg-black text-white hover:opacity-90"
                onClick={() => onAddToCart && onAddToCart({ product, size: activeSize, qty })}
              >
                Add to cart
              </button>
            </div>

            <button className="w-full px-6 py-3 border border-black hover:bg-black hover:text-white transition">Buy it now</button>

            {/* Description */}
            <div className="mt-10 space-y-4 text-gray-700">
              <p>
                Crafted from luxurious 220gsm cotton, it delivers a soft yet-structured feel that holds its shape while giving you all-day
                comfort. The heavyweight fabric ensures durability without compromising breathability, making it perfect for any season.
              </p>
            </div>
          </div>
        </div>

        {/* You may also like */}
        <div className="mt-16">
          <h2 className="text-2xl mb-6">You may also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-black/10">
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 mb-10">
          <h2 className="text-2xl mb-10">Frequently asked questions</h2>
          <div className="divide-y border border-black/10 rounded-md overflow-hidden">
            <FaqItem question="What is the return policy?">
              If you receive a wrong or damaged product, send us a photo with proof within 48 hours of delivery—we'll refund or replace it.
            </FaqItem>
            <FaqItem question="Will the print crack or fade after washing?">
              No. The print is made with high‑quality, durable material that won’t crack or fade with proper care.
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
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  return (
    <div className="bg-white/70">
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-center bg-white hover:bg-black/5 transition focus:outline-none focus:ring-2 focus:ring-black/20"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (contentRef.current) {
            const h = contentRef.current.scrollHeight || 0;
            setMaxH(next ? h : 0);
          }
        }}
      >
        <span className="font-medium pr-4">{question}</span>
        <svg
          className={`w-5 h-5 transition-transform ${open ? 'rotate-45' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      <div
        style={{ maxHeight: open ? maxH : 0 }}
        className={`px-5 overflow-hidden transition-[max-height] duration-300 ease-in-out ${open ? 'pb-4' : ''}`}
      >
        <div ref={contentRef} className="text-gray-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}


