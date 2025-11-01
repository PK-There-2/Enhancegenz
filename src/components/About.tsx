import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Users, Sparkles, TrendingUp } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1719586902338-bbfa49db95fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjE5ODUyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-white mb-4">About Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Redefining fashion for the modern generation
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Thread Trends was born from a passion for bringing the latest fashion trends to style-conscious individuals. Founded in 2023, we've quickly become a destination for those who want to express their unique personality through clothing.
                </p>
                <p>
                  We believe that fashion should be accessible, sustainable, and most importantly, fun. Our carefully curated collections blend contemporary streetwear with timeless classics, ensuring there's something for everyone.
                </p>
                <p>
                  From graphic tees that make a statement to minimalist pieces that define elegance, every item in our store is handpicked with quality and style in mind.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1573612664822-d7d347da7b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJvdXRpcXVlfGVufDF8fHx8MTc2MTg5NTUzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Our Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl mb-4">What We Stand For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Quality */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl mb-3">Quality First</h3>
              <p className="text-gray-600">
                Premium materials and craftsmanship in every piece
              </p>
            </div>

            {/* Sustainability */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Committed to eco-friendly practices and materials
              </p>
            </div>

            {/* Community */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl mb-3">Community</h3>
              <p className="text-gray-600">
                Building a family of fashion-forward individuals
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-3">Innovation</h3>
              <p className="text-gray-600">
                Always ahead of the curve with the latest trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl mb-2">10k+</div>
              <div className="text-white/70">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl mb-2">500+</div>
              <div className="text-white/70">Products</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl mb-2">50+</div>
              <div className="text-white/70">Brands</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl mb-2">4.8★</div>
              <div className="text-white/70">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To empower individuals to express their unique style through high-quality, trend-setting fashion that doesn't compromise on sustainability or affordability. We're not just selling clothes – we're creating a movement where fashion meets purpose.
          </p>
        </div>
      </section>
    </div>
  );
}
