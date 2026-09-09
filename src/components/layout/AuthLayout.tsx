import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
            </div>
            <span className="font-display font-extrabold text-2xl">ShopVerse</span>
          </Link>
          <h1 className="font-display text-3xl font-bold mb-2">{title}</h1>
          <p className="text-gray-500 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative flex flex-col justify-center px-16 text-white">
          <h2 className="font-display text-4xl font-bold mb-6 max-w-md">Your premium shopping destination</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-md">Join thousands of happy customers who shop with us for quality products, great prices, and exceptional service.</p>
          <div className="space-y-4">
            {[
              { icon: Truck, text: 'Free shipping on orders over ₹2,000' },
              { icon: ShieldCheck, text: '100% secure payment processing' },
              { icon: RotateCcw, text: 'Easy 7-day returns and exchanges' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-gray-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
