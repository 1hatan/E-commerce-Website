import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { formatPrice, slugify, getEffectivePrice } from '@/utils/format';
import type { Product, Category } from '@/types';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

const EMPTY_FORM = {
  name: '', slug: '', description: '', price: '', discount_price: '', stock: '', sku: '', brand: '',
  category_id: '', images: '', colors: '', sizes: '', featured: false, is_active: true,
};

export default function AdminProductsPage() {
  const { show } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProducts = async () => {
    let q = supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false });
    if (search) q = q.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
    const { data } = await q;
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories((data as Category[]) ?? []));
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name, slug: product.slug, description: product.description ?? '', price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : '', stock: String(product.stock),
      sku: product.sku ?? '', brand: product.brand ?? '', category_id: product.category_id ?? '',
      images: product.images.join(', '), colors: product.colors.join(', '), sizes: product.sizes.join(', '),
      featured: product.featured, is_active: product.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      price: parseFloat(form.price) || 0,
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      stock: parseInt(form.stock) || 0,
      sku: form.sku || null,
      brand: form.brand || null,
      category_id: form.category_id || null,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) show('Could not update product', 'error');
      else show('Product updated', 'success');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) show('Could not create product', 'error');
      else show('Product created', 'success');
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) show('Could not delete product', 'error');
    else { show('Product deleted', 'success'); fetchProducts(); }
    setConfirmDelete(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-gray-500">{products.length} products in catalog</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="btn-accent">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
          placeholder="Search products..." className="input pl-11" />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-1.5">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} required className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="input" /></div>
                  <div className="sm:col-span-2"><label className="block text-sm font-semibold mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Price *</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Discount Price</label><input type="number" step="0.01" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">SKU</label><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Brand</label><input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Category</label>
                    <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
                      <option value="">None</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2"><label className="block text-sm font-semibold mb-1.5">Image URLs (comma-separated)</label><input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Colors (comma-separated)</label><input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input" /></div>
                  <div><label className="block text-sm font-semibold mb-1.5">Sizes (comma-separated)</label><input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input" /></div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded text-orange-500" /><span className="text-sm font-medium">Featured</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-orange-500" /><span className="text-sm font-medium">Active</span></label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-accent">{saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <h3 className="font-bold text-lg mb-2">Delete this product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 btn-ghost">Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 btn bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState icon={<Package className="w-10 h-10 text-gray-400" />} title="No products found" action={<button onClick={() => { setForm(EMPTY_FORM); setShowForm(true); }} className="btn-accent">Add Product</button>} />
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{formatPrice(getEffectivePrice(product))}</td>
                  <td className="px-4 py-3 text-sm"><span className={product.stock <= 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>{product.stock}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {product.featured && <span className="badge bg-orange-100 text-orange-700">Featured</span>}
                      <span className={`badge ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                      <button onClick={() => setConfirmDelete(product.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
