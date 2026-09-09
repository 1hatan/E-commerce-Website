import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { show } = useToast();

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    show('Welcome to C-STYLE! Enjoy 10% off your first order.', 'success');
    setEmail('');
  };

  const linkSections = [
    {
      title: 'Shop',
      links: [
        { label: 'New Arrivals', to: '/shop?category=new-in' },
        { label: 'Women', to: '/shop?category=women' },
        { label: 'Men', to: '/shop?category=men' },
        { label: 'Shoes & Accessories', to: '/shop?category=shoes' },
        { label: 'Sale', to: '/shop?category=sale' },
      ],
    },
    {
      title: 'Customer Care',
      links: [
        { label: 'My Account', to: '/account' },
        { label: 'Track Order', to: '/account/orders' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Store Locator', to: '/shop' },
        { label: 'Help & FAQ', to: '/shop' },
      ],
    },
    {
      title: 'About C-STYLE',
      links: [
        { label: 'Our Story', to: '/' },
        { label: 'Sustainability', to: '/' },
        { label: 'Privacy Policy', to: '/' },
        { label: 'Terms of Service', to: '/' },
        { label: 'Contact Us', to: '/' },
      ],
    },
  ];

  return (
    <footer className="bg-[#121212] text-[#f8f6f0] mt-16 font-sans">
      {/* Newsletter Bar */}
      <div className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#d49a6f] block mb-2">STAY IN TOUCH</span>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Wear Your Confidence with C-STYLE</h3>
              <p className="text-[#a39e93] text-xs sm:text-sm max-w-md">Subscribe to get 10% off your first order, secret drops, and personal styling tips.</p>
            </div>
            <form onSubmit={subscribe} className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-full bg-[#1c1c1c] text-white placeholder-[#736e65] border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d49a6f] text-xs"
              />
              <button type="submit" className="bg-white text-black hover:bg-gray-200 px-7 py-3 text-xs font-bold uppercase tracking-widest rounded-full whitespace-nowrap transition-colors flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-serif text-sm font-bold text-white">
                C
              </div>
              <span className="font-serif text-xl font-bold tracking-[0.15em] text-white">C-STYLE</span>
            </Link>
            <p className="text-xs text-[#a39e93] leading-relaxed">
              Timeless silhouettes & high-fashion essentials. Designed for confidence.
            </p>
            <div className="space-y-2 text-xs text-[#a39e93] pt-2">
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#d49a6f]" /> support@c-style.com</div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#d49a6f]" /> +1 (800) 555-CSTYLE</div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#d49a6f]" /> New York, NY</div>
            </div>
          </div>

          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-sans font-bold text-white mb-4 text-xs uppercase tracking-widest">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-xs text-[#a39e93] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#736e65]">© 2026 C-STYLE. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-[#1c1c1c] hover:bg-[#2e2e2e] flex items-center justify-center transition-colors text-white" aria-label="Social">
                <Icon className="w-3.5 h-3.5 text-[#a39e93] hover:text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
