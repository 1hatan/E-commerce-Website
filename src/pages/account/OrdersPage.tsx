import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import AccountLayout from '@/components/layout/AccountLayout';
import EmptyState from '@/components/common/EmptyState';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setOrders((data as Order[]) ?? []); setLoading(false); });
  }, [user]);

  if (loading) return <AccountLayout><LoadingSpinner label="Loading orders..." /></AccountLayout>;

  return (
    <AccountLayout>
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState icon={<Package className="w-10 h-10 text-gray-400" />} title="No orders yet" description="When you place an order, it will appear here." action={<Link to="/shop" className="btn-accent">Start Shopping</Link>} />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card overflow-hidden">
              <button onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center"><Package className="w-6 h-6 text-gray-500" /></div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    <span className={`badge ${PAYMENT_COLORS[order.payment_status]}`}>{order.payment_status}</span>
                  </div>
                  <span className="font-bold">{formatPrice(order.total)}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order.id ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {expandedId === order.id && (
                <div className="border-t border-gray-100 p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-4 sm:hidden">
                    <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    <span className={`badge ${PAYMENT_COLORS[order.payment_status]}`}>{order.payment_status}</span>
                  </div>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-14 h-14 rounded-lg object-cover" />}
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product_name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}{item.color && ` · ${item.color}`}{item.size && ` · ${item.size}`}</p>
                        </div>
                        <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                    <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>{formatPrice(order.tax)}</span></div>
                    <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                  </div>
                  {order.shipping_address && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold mb-1">Shipping Address</p>
                      <p className="text-sm text-gray-600">{order.shipping_address.full_name}<br />{order.shipping_address.address_line1}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
