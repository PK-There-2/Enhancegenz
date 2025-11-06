import { Sparkles, Heart, Users } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Intentional design',
      description: 'Everything we do starts with why'
    },
    {
      icon: Heart,
      title: 'Made with care',
      description: 'We believe in building better'
    },
    {
      icon: Users,
      title: 'A team with a goal',
      description: 'Real people making great products'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
