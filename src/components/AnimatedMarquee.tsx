export function AnimatedMarquee() {
  const text = "NEW ARRIVALS • FRESH DROPS • TRENDING NOW • SHOP THE VIBE • ";
  
  return (
    <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 py-4 overflow-hidden shadow-lg">
      {/* Top glossy line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-white mx-4 text-lg tracking-wider">
          {text.repeat(10)}
        </span>
      </div>

      {/* Bottom glossy line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
