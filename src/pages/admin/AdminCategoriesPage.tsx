import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { slugify } from '@/utils/format';
import type { Category } from '@/types';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

const EMPTY_FORM = { name: '', slug: '', image_url: '', is_active: true };

export default function AdminCategoriesPage() {
  const { show } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories((data as Category[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, slug: form.slug || slugify(form.name), image_url: form.image_url || null, is_active: form.is_active };
    if (editingId) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
      if (error) show('Could not update category', 'error');
      else show('Category updated', 'success');
    } else {
      const { error } = await supabase.from('categories').insert(payload);
      if (error) show('Could not create category', 'error');
      else show('Category created', 'success');
    }
    setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, image_url: cat.image_url ?? '', is_active: cat.is_active });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) show('Could not delete category', 'error');
    else { show('Category deleted', 'success'); fetchCategories(); }
    setConfirmDelete(null);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Categories</h1>
          <p className="text-gray-500">{categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true); }} className="btn-accent">
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-bold">{editingId ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="block text-sm font-semibold mb-1.5">Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} required className="input" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className="input" /></div>
                <div><label className="block text-sm font-semibold mb-1.5">Image URL</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="input" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded text-orange-500" /><span className="text-sm font-medium">Active</span></label>
                <div className="flex gap-3"><button type="submit" className="btn-accent">{editingId ? 'Update' : 'Create'} Category</button><button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button></div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <h3 className="font-bold text-lg mb-2">Delete this category?</h3>
              <p className="text-gray-500 text-sm mb-6">Products in this category will be uncategorized.</p>
              <div className="flex gap-3"><button onClick={() => setConfirmDelete(null)} className="flex-1 btn-ghost">Cancel</button><button onClick={() => handleDelete(confirmDelete)} className="flex-1 btn bg-red-500 text-white hover:bg-red-600">Delete</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <LoadingSpinner label="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState icon={<Tag className="w-10 h-10 text-gray-400" />} title="No categories found" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card overflow-hidden group">
              <div className="aspect-video bg-gray-100 relative">
                {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleEdit(cat)} className="p-2 rounded-lg bg-white"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => setConfirmDelete(cat.id)} className="p-2 rounded-lg bg-white"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-gray-500">/{cat.slug}</p>
                <span className={`badge mt-1 ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
