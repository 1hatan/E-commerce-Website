import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingBag, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/utils/format';
import type { Order, OrderStatus } from '@/types';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700', shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const { show } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    let q = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (statusFilter) q = q.eq('status', statusFilter);
    if (search) q = q.ilike('order_number', `%${search}%`);
    const { data } = await q;
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) show('Could not update order status', 'error');
    else { show('Order status updated', 'success'); fetchOrders(); if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status }); }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-gray-500">{orders.length} orders total</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            placeholder="Search order number..." className="input pl-11" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input max-w-xs">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState icon={<ShoppingBag className="w-10 h-10 text-gray-400" />} title="No orders found" />
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="px-4 py-3 font-semibold text-sm">{order.order_number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.order_items?.length ?? 0}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3"><span className={`badge ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.payment_status}</span></td>
                  <td className="px-4 py-3"><span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                  <td className="px-4 py-3 text-right"><ChevronRight className="w-4 h-4 text-gray-400 inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Order Number</span><span className="font-semibold">{selectedOrder.order_number}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-semibold">{formatDate(selectedOrder.created_at)}</span></div>

                <div>
                  <p className="text-sm font-semibold mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                        {item.product_image && <img src={item.product_image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                        <div className="flex-1"><p className="text-sm font-semibold">{item.product_name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm pt-2 border-t border-gray-100">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(selectedOrder.discount)}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{selectedOrder.shipping_cost === 0 ? 'FREE' : formatPrice(selectedOrder.shipping_cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(selectedOrder.tax)}</span></div>
                  <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{formatPrice(selectedOrder.total)}</span></div>
                </div>

                {selectedOrder.shipping_address && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-semibold mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-600">{selectedOrder.shipping_address.full_name}<br />{selectedOrder.shipping_address.address_line1}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postal_code}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm font-semibold mb-2">Update Order Status</p>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-colors ${selectedOrder.status === s ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
