import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, getEffectivePrice } from '@/utils/format';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function WishlistPage() {
  const { items, loading, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { show } = useToast();

  const handleMoveToCart = async (product: Product) => {
    if (!user) { show('Please sign in', 'info'); return; }
    try {
      await addItem(product, 1, product.colors[0] ?? undefined, product.sizes[0] ?? undefined);
      await removeItem(product.id);
      show('Moved to cart', 'success');
    } catch { show('Could not move to cart', 'error'); }
  };

  if (loading) return <LoadingSpinner label="Loading wishlist..." />;

  if (!user) {
    return (
      <div className="container-page py-20">
        <EmptyState title="Please sign in to view your wishlist" action={<Link to="/login" className="btn-accent">Sign In</Link>} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={<Heart className="w-10 h-10 text-gray-400" />}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist for easy access later."
          action={<Link to="/shop" className="btn-accent">Browse Products</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-bold mb-2">My Wishlist</h1>
      <p className="text-gray-500 mb-8">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;
          const price = getEffectivePrice(product);
          return (
            <div key={item.id} className="card overflow-hidden">
              <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden bg-gray-50">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-4">
                {product.brand && <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{product.brand}</p>}
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-sm hover:text-orange-600 transition-colors line-clamp-2 mb-2">{product.name}</h3>
                </Link>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold">{formatPrice(price)}</span>
                  {product.discount_price && product.discount_price < product.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleMoveToCart(product)} className="flex-1 btn-primary py-2.5 text-sm">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                  <button onClick={() => removeItem(product.id)} className="btn-outline px-3 py-2.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
