import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Minus, Plus, Truck, ShieldCheck, RotateCcw, ChevronRight, Home } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product, Review } from '@/types';
import { formatPrice, calculateDiscount, getEffectivePrice, formatDate } from '@/utils/format';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ProductCard from '@/components/product/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const { show } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setSelectedImage(0);
    setQuantity(1);

    supabase.from('products').select('*, category:categories(*)').eq('slug', slug).maybeSingle()
      .then(({ data }) => {
        const prod = data as Product | null;
        setProduct(prod);
          if (prod && prod.colors && prod.colors.length > 0) {
            const firstC = prod.colors[0];
            setSelectedColor(typeof firstC === 'string' ? firstC : firstC.name);
          }
          if (prod && prod.sizes && prod.sizes.length > 0) {
            setSelectedSize(prod.sizes[0]);
          }

          if (prod) {
            supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', prod.id).order('created_at', { ascending: false })
              .then(({ data: rData }) => setReviews((rData as Review[]) ?? []));
          }

          if (prod && prod.category_id) {
            supabase.from('products').select('*, category:categories(*)').eq('category_id', prod.category_id).neq('id', prod.id).limit(4)
              .then(({ data: relData }) => setRelated((relData as Product[]) ?? []));
          }
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { show('Please sign in to add items to your cart', 'info'); return; }
    if (!product) return;
    if (product.colors.length > 0 && !selectedColor) { show('Please select a color', 'info'); return; }
    if (product.sizes.length > 0 && !selectedSize) { show('Please select a size', 'info'); return; }
    try {
      await addItem(product, quantity, selectedColor, selectedSize);
      show('Added to cart', 'success');
    } catch { show('Could not add to cart', 'error'); }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!user) { show('Please sign in to use your wishlist', 'info'); return; }
    if (!product) return;
    try {
      await toggleItem(product);
      show(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch { show('Could not update wishlist', 'error'); }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    if (!newReview.comment.trim()) { show('Please write a comment', 'info'); return; }
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: product.id,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
    });
    if (error) {
      show(error.message.includes('duplicate') ? 'You have already reviewed this product' : 'Could not submit review', 'error');
    } else {
      show('Review submitted', 'success');
      setNewReview({ rating: 5, comment: '' });
      const { data } = await supabase.from('reviews').select('*, profiles(full_name)').eq('product_id', product.id).order('created_at', { ascending: false });
      setReviews((data as Review[]) ?? []);
    }
    setSubmittingReview(false);
  };

  if (loading) return <LoadingSpinner label="Loading product..." />;
  if (!product) return <EmptyState title="Product not found" description="This product may have been removed." action={<Link to="/shop" className="btn-accent">Browse Products</Link>} />;

  const discount = calculateDiscount(product.price, product.discount_price);
  const effectivePrice = getEffectivePrice(product);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-gray-900 flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-gray-900">Shop</Link>
        {product.category && <>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/shop?category=${product.category.slug}`} className="hover:text-gray-900">{product.category.name}</Link>
        </>}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Product Main */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Gallery */}
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 zoom-container"
          >
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">{product.brand}</p>}
          <h1 className="font-display text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-orange-500 text-orange-500' : 'fill-gray-200 text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
            <button onClick={() => setActiveTab('reviews')} className="text-sm text-gray-500 hover:underline">
              {product.review_count} reviews
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold">{formatPrice(effectivePrice)}</span>
            {product.discount_price && product.discount_price < product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-orange-100 text-orange-700 text-sm">-{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">Color: <span className="text-gray-600">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => {
                  const colorName = typeof c === 'string' ? c : c.name;
                  return (
                    <button key={i} onClick={() => setSelectedColor(colorName)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${selectedColor === colorName ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      {colorName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2">Size: <span className="text-gray-600">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${selectedSize === size ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Stock */}
          <div className="flex items-center gap-6 mb-6">
            <div>
              <p className="text-sm font-semibold mb-2">Quantity</p>
              <div className="flex items-center border-2 border-gray-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 rounded-l-lg"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-semibold w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-50 rounded-r-lg"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <span className={`badge ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 btn-primary">
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock <= 0} className="flex-1 btn-accent">
              Buy Now
            </button>
            <button onClick={handleWishlist} className="btn-outline px-4">
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="w-6 h-6 text-gray-700" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="w-6 h-6 text-gray-700" />
              <p className="text-xs text-gray-600">Secure Payment</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RotateCcw className="w-6 h-6 text-gray-700" />
              <p className="text-xs text-gray-600">7-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex gap-2 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
          {([
            { key: 'description', label: 'Description' },
            { key: 'specs', label: 'Specifications' },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
          ] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Experience premium quality with the {product.name}. Crafted with attention to detail, this product combines style,
              functionality, and durability. Perfect for everyday use, it meets the highest standards of quality and design.
            </p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
            {product.sku && <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-semibold text-gray-700">SKU</span><span className="text-gray-600">{product.sku}</span></div>}
            {product.brand && <div className="flex justify-between py-3 border-b border-gray-100"><span className="font-semibold text-gray-700">Brand</span><span className="text-gray-600">{product.brand}</span></div>}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {/* Write review */}
            {user ? (
              <form onSubmit={submitReview} className="card p-6 mb-8">
                <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Your Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })}>
                        <Star className={`w-7 h-7 ${s <= newReview.rating ? 'fill-orange-500 text-orange-500' : 'fill-gray-200 text-gray-200'} hover:fill-orange-300`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  className="input mb-4"
                />
                <button type="submit" disabled={submittingReview} className="btn-accent">Submit Review</button>
              </form>
            ) : (
              <div className="card p-6 mb-8 text-center">
                <p className="text-gray-600 mb-3">Please sign in to write a review</p>
                <Link to="/login" className="btn-accent">Sign In</Link>
              </div>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
              <EmptyState title="No reviews yet" description="Be the first to review this product." />
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                          {(review.profiles?.full_name || 'A').charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{review.profiles?.full_name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
