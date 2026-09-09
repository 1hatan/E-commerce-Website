import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ArrowLeft, CreditCard, MapPin, Package, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { formatPrice, getEffectivePrice, generateOrderNumber } from '@/utils/format';
import type { Address, Order } from '@/types';
import EmptyState from '@/components/common/EmptyState';

const STEPS = ['Shipping', 'Review', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, refreshCart } = useCart();
  const { user } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const discount = items.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + (item.product.price - getEffectivePrice(item.product)) * item.quantity;
  }, 0);
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!user) return;
    supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false })
      .then(({ data }) => {
        setAddresses((data as Address[]) ?? []);
        if (data && data.length > 0) setSelectedAddressId(data[0].id);
      });
  }, [user]);

  if (!user) {
    return <div className="container-page py-20"><EmptyState title="Please sign in to checkout" action={<Link to="/login" className="btn-accent">Sign In</Link>} /></div>;
  }

  if (items.length === 0 && !placedOrder) {
    return <div className="container-page py-20"><EmptyState title="Your cart is empty" action={<Link to="/shop" className="btn-accent">Start Shopping</Link>} /></div>;
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const placeOrder = async () => {
    if (!user || !selectedAddress) { show('Please select a shipping address', 'error'); return; }
    setLoading(true);
    const orderNumber = generateOrderNumber();

    const { data: order, error: orderError } = await supabase.from('orders').insert({
      user_id: user.id,
      order_number: orderNumber,
      status: 'confirmed',
      payment_status: 'paid',
      payment_method: 'cash_on_delivery',
      subtotal,
      discount,
      shipping_cost: shipping,
      tax,
      total,
      shipping_address: {
        full_name: selectedAddress.full_name,
        phone: selectedAddress.phone,
        address_line1: selectedAddress.address_line1,
        address_line2: selectedAddress.address_line2 ?? '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postal_code: selectedAddress.postal_code,
        country: selectedAddress.country,
      },
    }).select('*').single();

    if (orderError || !order) {
      show('Could not place order. Please try again.', 'error');
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product?.name ?? 'Unknown Product',
      product_image: item.product?.images[0] ?? null,
      price: item.product ? getEffectivePrice(item.product) : 0,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      show('Order placed but items could not be saved. Contact support.', 'error');
    }

    await clearCart();
    await refreshCart();
    setPlacedOrder(order as Order);
    setStep(3);
    setLoading(false);
    show('Order placed successfully!', 'success');
  };

  return (
    <div className="container-page py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < step ? 'bg-orange-500 text-white' : i === step ? 'border-2 border-orange-500 text-orange-600' : 'border-2 border-gray-200'}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-sm font-semibold hidden sm:block">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-orange-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5" /> Shipping Address</h2>
                {addresses.length === 0 ? (
                  <div className="card p-6 text-center">
                    <p className="text-gray-600 mb-3">No addresses saved yet. Add one to continue.</p>
                    <Link to="/account/addresses" className="btn-accent">Add Address</Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label key={addr.id} className={`card p-5 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-2 border-orange-500' : ''}`}>
                        <div className="flex items-start gap-3">
                          <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 w-4 h-4 text-orange-500 focus:ring-orange-500" />
                          <div>
                            <p className="font-semibold text-sm">{addr.full_name} {addr.is_default && <span className="badge bg-green-100 text-green-700 ml-2">Default</span>}</p>
                            <p className="text-sm text-gray-600 mt-1">{addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}</p>
                            <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postal_code}</p>
                            <p className="text-sm text-gray-500 mt-1">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                    <Link to="/account/addresses" className="text-sm text-orange-600 font-semibold hover:underline">+ Add new address</Link>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => navigate('/cart')} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back to Cart</button>
                  <button onClick={() => selectedAddress && setStep(1)} disabled={!selectedAddress} className="btn-accent">Continue to Review <ChevronRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 1: Review */}
            {step === 1 && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5" /> Order Review</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => {
                    const price = item.product ? getEffectivePrice(item.product) : 0;
                    return (
                      <div key={item.id} className="card p-4 flex items-center gap-4">
                        {item.product && <img src={item.product.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product?.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}{item.color && ` · ${item.color}`}{item.size && ` · ${item.size}`}</p>
                        </div>
                        <span className="font-semibold">{formatPrice(price * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>
                {selectedAddress && (
                  <div className="card p-4 mb-4">
                    <p className="text-sm font-semibold mb-1">Delivering to:</p>
                    <p className="text-sm text-gray-600">{selectedAddress.full_name}, {selectedAddress.address_line1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={() => setStep(2)} className="btn-accent">Proceed to Payment <ChevronRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
                <div className="card p-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-orange-500 bg-orange-50 mb-4">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-4">
                    <p className="flex items-center gap-2"><Lock className="w-4 h-4" /> This is a demo checkout. No real payment will be processed.</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-ghost"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={placeOrder} disabled={loading} className="btn-accent">
                    {loading ? 'Placing order...' : <>Place Order - {formatPrice(total)}</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && placedOrder && (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="text-center py-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="font-display text-3xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-1">Thank you for your purchase.</p>
                  <p className="text-sm text-gray-500 mb-6">Order number: <span className="font-bold text-gray-900">{placedOrder.order_number}</span></p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/account/orders" className="btn-accent">View My Orders</Link>
                    <Link to="/shop" className="btn-outline">Continue Shopping</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold mb-4">Price Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Items ({items.length})</span><span className="font-semibold">{formatPrice(subtotal + discount)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Tax (5%)</span><span className="font-semibold">{formatPrice(tax)}</span></div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base"><span className="font-bold">Total</span><span className="font-bold font-display text-xl">{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
