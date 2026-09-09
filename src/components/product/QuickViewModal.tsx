import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount, getEffectivePrice } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { show } = useToast();

  if (!product) return null;

  const discount = calculateDiscount(product.price, product.discount_price);
  const effectivePrice = getEffectivePrice(product);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    if (!user) {
      show('Please sign in to add items to your cart', 'info');
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      show('Please select a color', 'info');
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      show('Please select a size', 'info');
      return;
    }
    try {
      await addItem(product, 1, selectedColor, selectedSize);
      show('Added to cart', 'success');
      onClose();
    } catch {
      show('Could not add to cart', 'error');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      show('Please sign in to use your wishlist', 'info');
      return;
    }
    try {
      await toggleItem(product);
      show(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch {
      show('Could not update wishlist', 'error');
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div>
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                  <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === i ? 'border-orange-500' : 'border-gray-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  {product.brand && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.brand}</p>}
                  <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="font-display text-2xl font-bold mb-3">{product.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-orange-500 text-orange-500' : 'fill-gray-200 text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{product.rating.toFixed(1)} ({product.review_count} reviews)</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-display text-3xl font-bold">{formatPrice(effectivePrice)}</span>
                  {product.discount_price && product.discount_price < product.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                      <span className="badge bg-orange-100 text-orange-700">-{discount}%</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{product.description}</p>

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Color: {selectedColor}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c, i) => {
                        const colorName = typeof c === 'string' ? c : c.name;
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedColor(colorName)}
                            className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
                              selectedColor === colorName ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {colorName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Size: {selectedSize}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[3rem] px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
                            selectedSize === size ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className={`badge ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 btn-primary">
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </button>
                  <button onClick={handleWishlist} className="btn-outline px-4">
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <Link to={`/product/${product.slug}`} onClick={onClose} className="text-center text-sm text-orange-600 hover:underline mt-3 font-medium">
                  View full details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
