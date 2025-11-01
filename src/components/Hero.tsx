import { Sparkles, TrendingUp, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onNavigateShop: () => void;
}

export function Hero({ onNavigateShop }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Light Mode Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-teal-300 to-emerald-300 rounded-full blur-3xl opacity-40 animate-float-delayed" />
      </div>

      {/* Floating Clothing Images - Left Side */}
      <div className="absolute left-4 sm:left-8 md:left-16 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl rotate-[-12deg] animate-float border-4 border-white">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb2xkZWQlMjB0c2hpcnQlMjB3aGl0ZXxlbnwxfHx8fDE3NjE5ODA5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="T-Shirt"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] animate-float-delayed ml-8 border-4 border-white">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1556366184-cc9bcb828ad8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMGhhbmdpbmd8ZW58MXx8fHwxNzYxOTgwOTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Jacket"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Floating Clothing Images - Right Side */}
      <div className="absolute right-4 sm:right-8 md:right-16 top-1/2 -translate-y-1/2 space-y-6 hidden lg:block">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-2xl rotate-[12deg] animate-float-delayed border-4 border-white">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759542890353-35f5568c1c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGZhc2hpb24lMjB3aGl0ZXxlbnwxfHx8fDE3NjE5ODA5MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Sneakers"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl rotate-[-8deg] animate-float mr-8 border-4 border-white">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1572858236188-145ddd374640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBzdHJlZXR3ZWFyJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjE5ODA5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Hoodie"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm tracking-wider">NEW DROPS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-cyan-200">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <span className="text-sm tracking-wider">TRENDING</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-teal-200">
            <Zap className="w-4 h-4 text-teal-600" />
            <span className="text-sm tracking-wider">LIMITED</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 tracking-tight bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
          THREAD TRENDS
        </h1>

        {/* Subheading */}
        <p className="text-2xl sm:text-3xl md:text-4xl mb-6 tracking-tight">
          YOUR STYLE, YOUR RULES
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Emerging fashion colors and styles shaping today's wardrobe.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onNavigateShop}
            className="px-8 py-4 bg-black text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore Now
          </button>
          <button
            onClick={onNavigateShop}
            className="px-8 py-4 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore Collections
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 animate-bounce">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-20px) rotate(var(--rotation, 0deg));
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(var(--rotation, 0deg));
          }
          50% {
            transform: translateY(-30px) rotate(var(--rotation, 0deg));
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
