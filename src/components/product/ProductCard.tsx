import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import type { Product } from '@/types';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  index?: number;
}

export default function ProductCard({ product, onQuickView, index = 0 }: ProductCardProps) {
  const { isWishlisted, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const { show } = useToast();
  const [activeColorIdx, setActiveColorIdx] = useState(0);

  const inWishlist = isWishlisted(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleItem(product);
      show(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch {
      show('Please sign in to update your wishlist', 'info');
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let selectedColor: string | undefined;
    if (product.colors && product.colors.length > 0) {
      const c = product.colors[activeColorIdx];
      selectedColor = typeof c === 'string' ? c : c.name;
    }

    const selectedSize = product.sizes?.[0];
    try {
      await addItem(product, 1, selectedColor, selectedSize);
      show(`Added ${product.name} to cart`, 'success');
    } catch {
      show(`Added ${product.name} to local cart preview`, 'info');
    }
  };

  const formattedPrice = `$${product.price.toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col font-sans"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#f4f2ed] mb-3 border border-gray-100/80">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 shadow-xs ${
            inWishlist
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-black backdrop-blur-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick View / Add to Cart Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#1c1917] text-white text-xs font-semibold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-black transition-colors shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2.5 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-md"
              aria-label="Quick view"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 px-1">
        <Link
          to={`/product/${product.slug}`}
          className="text-xs font-semibold text-gray-900 group-hover:text-black transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="text-xs font-bold text-gray-900">{formattedPrice}</p>

        {/* Color Swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1">
            {product.colors.map((color, i) => {
              const hex = typeof color === 'string' ? '#333' : color.hex;
              const name = typeof color === 'string' ? color : color.name;
              return (
                <button
                  key={i}
                  onClick={() => setActiveColorIdx(i)}
                  style={{ backgroundColor: hex }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    activeColorIdx === i ? 'ring-2 ring-gray-900 ring-offset-1 border-transparent' : 'border-gray-300'
                  }`}
                  title={name}
                />
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
