import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, MapPin, ChevronLeft, ChevronRight, Leaf, Heart, Users } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import QuickViewModal from '@/components/product/QuickViewModal';
import { fetchCategories, fetchProducts, fetchCollections, CStyleCategory, CStyleCollection } from '@/lib/api';
import type { Product } from '@/types';

export default function HomePage() {
  const [categories, setCategories] = useState<CStyleCategory[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [collections, setCollections] = useState<CStyleCollection[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts({ new_arrivals: true }).then(setNewArrivals);
    fetchCollections().then(setCollections);
  }, []);

  return (
    <div className="bg-[#FAF9F6] text-[#1c1917] font-sans pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative border-b border-gray-200/60 bg-[#F4F1EA] overflow-hidden py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Copy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1c1917] leading-[1.05]">
                WEAR YOUR <br />
                <span className="font-serif italic font-extrabold tracking-normal">CONFIDENCE</span>
              </h1>

              <p className="text-sm sm:text-base text-gray-600 max-w-md leading-relaxed font-normal">
                Trendy pieces. Timeless style. <br />
                C-Style has everything you need to look and feel your best.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="bg-[#1c1917] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-black transition-all shadow-sm"
                >
                  SHOP NEW IN
                </Link>
                <Link
                  to="/shop"
                  className="bg-transparent border border-gray-400 text-[#1c1917] text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-white transition-all"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>
            </motion.div>

            {/* Right Hero Banner Media Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-md">
                <img
                  src="https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=1000&w=1200"
                  alt="C-Style High Fashion Lookbook"
                  className="w-full h-full object-cover object-top"
                />

                {/* Central Floating Luxury Logo Card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F5EFE6]/95 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/60 shadow-2xl text-center max-w-[200px]">
                  <div className="w-10 h-10 mx-auto rounded-full border border-[#1c1917] flex items-center justify-center font-serif font-bold text-xl text-[#1c1917] mb-2">
                    C
                  </div>
                  <p className="font-serif font-bold text-sm tracking-[0.2em] text-[#1c1917]">C-STYLE</p>
                  <p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mt-1">
                    MAKE YOUR STATEMENT
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / FEATURE BAR (4 Floating Pill Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">FREE SHIPPING</p>
              <p className="text-[11px] text-gray-500">On orders over $75</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">EASY RETURNS</p>
              <p className="text-[11px] text-gray-500">30-day return policy</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">SECURE PAYMENT</p>
              <p className="text-[11px] text-gray-500">100% secure checkout</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">STORES NEAR YOU</p>
              <p className="text-[11px] text-gray-500">Find a C-Style store</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold tracking-widest text-[#1c1917] uppercase">
            SHOP BY CATEGORY
          </h2>
          <Link
            to="/shop"
            className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 7 Circular Category Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 sm:gap-6 text-center">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="group flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 p-1 bg-[#F4F2ED] group-hover:scale-105 transition-transform duration-300 shadow-xs border border-gray-200/50">
                {cat.is_sale ? (
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider shadow-inner">
                    SALE
                  </div>
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs font-semibold text-gray-800 group-hover:text-black transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#1c1917] uppercase mb-1">
              NEW ARRIVALS
            </h2>
            <p className="text-xs text-gray-500">Fresh styles. Just in.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/shop?category=new-in" className="text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              View all
            </Link>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {newArrivals.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* 5. PROMOTIONAL BANNERS GRID (3 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Banner 1: Student Discount */}
          <div className="bg-[#101010] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">STUDENTS GET</p>
              <h3 className="font-serif text-2xl font-bold">10% OFF</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Verify your student status and save more.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-3 bg-white text-black text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                GET DISCOUNT
              </Link>
            </div>
            <img
              src="https://images.pexels.com/photos/7703038/pexels-photo-7703038.jpeg?auto=compress&cs=tinysrgb&h=500&w=400"
              alt="Student discount"
              className="absolute right-0 bottom-0 top-0 w-1/2 object-cover opacity-80 mix-blend-luminosity"
            />
          </div>

          {/* Banner 2: New Season New Look */}
          <div className="bg-[#EBE5DB] text-gray-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">NEW SEASON</p>
              <h3 className="font-serif text-2xl font-bold">NEW LOOK</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Discover the latest trends curated for you.
              </p>
              <Link
                to="/shop"
                className="inline-block mt-3 bg-[#1c1917] text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-black transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
            <img
              src="https://images.pexels.com/photos/8619007/pexels-photo-8619007.jpeg?auto=compress&cs=tinysrgb&h=500&w=400"
              alt="New season"
              className="absolute right-0 bottom-0 top-0 w-1/2 object-cover"
            />
          </div>

          {/* Banner 3: Visit Us In Store */}
          <div className="bg-[#DFD9CE] text-gray-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">VISIT US IN STORE</p>
              <h3 className="font-serif text-xl font-bold">Find your nearest C-Style store.</h3>
              <Link
                to="/shop"
                className="inline-block mt-3 bg-white text-black border border-gray-300 text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                FIND STORE
              </Link>
            </div>
            <img
              src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=500&w=400"
              alt="Store Locator"
              className="absolute right-0 bottom-0 top-0 w-1/2 object-cover"
            />
          </div>

        </div>
      </section>

      {/* 6. EXPLORE COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#1c1917] uppercase mb-1">
              EXPLORE COLLECTIONS
            </h2>
            <p className="text-xs text-gray-500">Handpicked styles for every vibe.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/shop" className="text-xs font-semibold text-gray-600 hover:text-black transition-colors">
              View all
            </Link>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Collection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {collections.map((col) => (
            <div key={col.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-200">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="font-serif text-lg font-bold mb-1">{col.title}</h3>
                <p className="text-xs text-gray-300 mb-4">{col.subtitle}</p>
                <Link
                  to="/shop"
                  className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-xs text-white border border-white/40 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM TRUST FEATURES BAR */}
      <section className="border-t border-b border-gray-200 bg-[#F4F1EA] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                <Leaf className="w-4 h-4 text-emerald-700" />
                <span>SUSTAINABLE MATERIALS</span>
              </div>
              <p className="text-[11px] text-gray-500">Better for you. Better for the planet.</p>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                <Heart className="w-4 h-4 text-rose-700" />
                <span>ETHICAL PRODUCTION</span>
              </div>
              <p className="text-[11px] text-gray-500">Made with care and respect.</p>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-900">
                <Users className="w-4 h-4 text-amber-700" />
                <span>COMMUNITY FOCUSED</span>
              </div>
              <p className="text-[11px] text-gray-500">Fashion that gives back.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
