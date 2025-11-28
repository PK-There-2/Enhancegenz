import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="mb-4">Thread Trends</h3>
            <p className="text-white/60 text-sm">
              Emerging fashion trends and premium clothing for the modern wardrobe.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/60">
            {/* <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: { page: 'home', scrollTo: 'best-sellers' } });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">New Arrivals</a></li> */}
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: { page: 'home', scrollTo: 'best-sellers' } });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Best Sellers</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: { page: 'shop', filter: 'tshirts' } });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">T-Shirts</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: { page: 'shop', filter: 'hoodies' } });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Hoodies</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: { page: 'home', scrollTo: 'winter-collection' } });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Winter Collection</a></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: 'refund-policy-footer' });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Refund Policy</a></li>
              <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: 'privacy-policy-footer' });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
              {/* <li><a href="#" onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('navigate', { detail: 'contact-page' });
                window.dispatchEvent(event);
              }} className="hover:text-white transition-colors cursor-pointer">Contact Us</a></li> */}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-4">
              Get the latest drops and exclusive offers
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white"
              />
              <button className="px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © 2025 Thread Trends. Mritunjya Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/threadtrends.in?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-white/60 hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
