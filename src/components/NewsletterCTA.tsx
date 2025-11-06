import { Mail } from 'lucide-react';
import backgroundImage from './hey.png';

export function NewsletterCTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated gradient background with hey.png overlay */}
      <div
        className="absolute inset-0 -z-10 animate-gradient"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <div className="absolute inset-0 bg-black/20 -z-10" />
      
     
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse-slow">
          <Sparkles className="w-8 h-8 text-white" />
        </div> */}

        {/* Content */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl mb-6 text-white">
          Join the Thread Fam
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Get early access to drops, exclusive deals, and style inspo straight to your inbox 
        </p>

        {/* Newsletter Form */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/20 text-black placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          <button className="px-8 py-4 bg-black text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group">
            <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Subscribe</span>
          </button>
        </div>

        <p className="text-sm text-white/70 mt-4">
          No spam, just good vibes
        </p>
      </div>

      <style>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
