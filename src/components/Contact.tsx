import { ContactSection } from './ContactSection';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Email */}
            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl mb-2">Email Us</h3>
              <p className="text-gray-600">support@threadtrends.com</p>
            </div>

            {/* Phone */}
            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl mb-2">Call Us</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>

            {/* Location */}
            <div className="text-center p-8 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Visit Us</h3>
              <p className="text-gray-600">Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* Additional Info */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-6">Business Hours</h2>
          <div className="space-y-2 text-gray-700">
            <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
            <p>Saturday: 10:00 AM - 6:00 PM</p>
            <p>Sunday: 11:00 AM - 5:00 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
}
