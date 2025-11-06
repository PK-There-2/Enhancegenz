export function AnimatedMarquee() {
  const text = "NEW ARRIVALS • FRESH DROPS • TRENDING NOW • SHOP THE VIBE • ";

  return (
    <div
      className="
        relative w-full
        z-10
        bg-gradient-to-r 
        from-white-500 via-gray-400 via-white-400 via-gray-400 to-white-500 
        py-2
        overflow-hidden
      "
    >
      {/* Top glossy line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Scrolling text */}
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-black mx-4 text-lg tracking-wider font-semibold">
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
