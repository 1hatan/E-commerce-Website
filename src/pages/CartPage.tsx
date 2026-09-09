import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getEffectivePrice } from '@/utils/format';
import EmptyState from '@/components/common/EmptyState';

export default function CartPage() {
  const { items, loading, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const discount = items.reduce((sum, item) => {
    if (!item.product) return sum;
    const orig = item.product.price * item.quantity;
    const eff = getEffectivePrice(item.product) * item.quantity;
    return sum + (orig - eff);
  }, 0);

  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  if (loading) return <div className="container-page py-20"><div className="animate-pulse text-center text-gray-400">Loading cart...</div></div>;

  if (!user) {
    return (
      <div className="container-page py-20">
        <EmptyState
          title="Please sign in to view your cart"
          description="Your cart items will be saved when you sign in."
          action={<Link to="/login" className="btn-accent">Sign In</Link>}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10 text-gray-400" />}
          title="Your cart is empty"
          description="Browse our products and add items to your cart."
          action={<Link to="/shop" className="btn-accent">Start Shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-8">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.product ? getEffectivePrice(item.product) : 0;
            const origPrice = item.product?.price ?? 0;
            return (
              <motion.div key={item.id} layout className="card p-4 flex gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {item.product && (
                  <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  {item.product?.brand && <p className="text-xs font-semibold text-gray-500 uppercase">{item.product.brand}</p>}
                  <Link to={`/product/${item.product?.slug ?? ''}`}>
                    <h3 className="font-semibold text-sm hover:text-orange-600 transition-colors line-clamp-1">{item.product?.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    {item.color && <span>Color: {item.color}</span>}
                    {item.size && <span>Size: {item.size}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">{formatPrice(price)}</span>
                    {item.product?.discount_price && item.product.discount_price < origPrice && (
                      <span className="text-xs text-gray-400 line-through">{formatPrice(origPrice)}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-gray-50 rounded-l-lg"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-3 text-sm font-semibold w-10 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-gray-50 rounded-r-lg"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (5%)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base"><span className="font-bold">Total</span><span className="font-bold font-display text-xl">{formatPrice(total)}</span></div>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-orange-600 mt-3 bg-orange-50 rounded-lg p-2 text-center">
                Add {formatPrice(2000 - subtotal)} more for FREE shipping!
              </p>
            )}
            <button onClick={() => navigate('/checkout')} className="btn-accent w-full mt-4">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
