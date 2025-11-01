import { ArrowRight } from 'lucide-react';

interface CollectionsGridProps {
  onNavigateShop: () => void;
}

export function CollectionsGrid({ onNavigateShop }: CollectionsGridProps) {
  const collections = [
    {
      title: 'Streetwear',
      description: 'Urban essentials',
      image: 'https://images.unsplash.com/photo-1613372281199-ec69ace5e926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwdXJiYW58ZW58MXx8fHwxNzYxOTc3NTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      gradient: 'from-blue-600/80 to-purple-600/80'
    },
    {
      title: 'Minimalist',
      description: 'Clean & simple',
      image: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTAyMjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      gradient: 'from-gray-900/80 to-gray-700/80'
    },
    {
      title: 'Vintage',
      description: 'Retro vibes',
      image: 'https://images.unsplash.com/photo-1614990354198-b06764dcb13c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYxOTc4NzQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      gradient: 'from-orange-600/80 to-red-600/80'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-5xl sm:text-6xl mb-4">Shop by Vibe</h2>
          <p className="text-gray-600 text-lg max-w-2xl">
            Find your style, express yourself 🎨
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <button
              key={index}
              onClick={onNavigateShop}
              className="group relative h-80 overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${collection.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} transition-opacity duration-300 group-hover:opacity-90`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-start justify-end p-8 text-white">
                <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <p className="text-sm uppercase tracking-widest mb-2 opacity-90">
                    {collection.description}
                  </p>
                  <h3 className="text-3xl mb-4">{collection.title}</h3>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Glossy line effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
