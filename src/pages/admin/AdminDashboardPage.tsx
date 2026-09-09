import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Package, Users, ShoppingBag, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, Product } from '@/types';
import { formatPrice, formatDate } from '@/utils/format';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0, pending: 0, completed: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('orders').select('total, status, payment_status'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: false }).limit(5),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(5),
    ]).then(([ordersRes, usersRes, productsRes, recentOrdersRes]) => {
      const orders = (ordersRes.data as Order[]) ?? [];
      const revenue = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total), 0);
      const pending = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing').length;
      const completed = orders.filter((o) => o.status === 'delivered').length;

      setStats({
        revenue,
        orders: orders.length,
        users: usersRes.count ?? 0,
        products: productsRes.count ?? 0,
        pending,
        completed,
      });
      setRecentOrders((recentOrdersRes.data as Order[]) ?? []);
      setTopProducts(((productsRes.data as Product[]) ?? []).sort((a, b) => (b.review_count || 0) - (a.review_count || 0)));
      setLoading(false);
    });
  }, []);

  if (loading) return <AdminLayout><LoadingSpinner label="Loading dashboard..." /></AdminLayout>;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-emerald-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-orange-500' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Completed Orders', value: stats.completed, icon: CheckCircle2, color: 'bg-teal-500' },
  ];

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome back! Here's what's happening in your store.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold font-display">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-sm">{order.order_number}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)} · {order.order_items?.length ?? 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                    <span className={`badge ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold">Top Products</h2>
            <Link to="/admin/products" className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i: number) => (
              <div key={product.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.review_count} reviews · {product.rating}★</p>
                </div>
                <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
