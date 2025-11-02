export function AnimatedMarquee() {
  const text = "NEW ARRIVALS • FRESH DROPS • TRENDING NOW • SHOP THE VIBE • ";

  return (
    <div
      // 🔧 Position controls
      // fixed → stays in place while scrolling
      // absolute → moves with layout
      className="
        absolute        /* or use 'absolute' if you want it to scroll */
        top-20     /* distance from top (adjust this to move up/down) */
        left-0 right-0 
        z-50
        bg-gradient-to-r 
        from-white-500 via-gray-400 via-white-400 via-gray-400 to-white-500 
        py-12
        overflow-hidden  
        transition-transform 
        duration-500 
        hover:-translate-y-1
        mt-5
      "
    >
      {/* Top glossy line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Scrolling text */}
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-blacl mx-4 text-lg tracking-wider font-semibold">
          {text.repeat(10)}
        </span>
      </div>

      {/* Bottom glossy line */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" /> */}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
