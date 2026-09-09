import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Check, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import type { Address } from '@/types';
import AccountLayout from '@/components/layout/AccountLayout';
import EmptyState from '@/components/common/EmptyState';

export default function AddressesPage() {
  const { user } = useAuth();
  const { show } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'India', is_default: false,
  });

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setAddresses((data as Address[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const resetForm = () => {
    setForm({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'India', is_default: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    }
    if (editingId) {
      const { error } = await supabase.from('addresses').update(form).eq('id', editingId);
      if (error) show('Could not update address', 'error');
      else show('Address updated', 'success');
    } else {
      const { error } = await supabase.from('addresses').insert({ ...form, user_id: user.id });
      if (error) show('Could not add address', 'error');
      else show('Address added', 'success');
    }
    resetForm();
    fetchAddresses();
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({ full_name: addr.full_name, phone: addr.phone, address_line1: addr.address_line1, address_line2: addr.address_line2 ?? '', city: addr.city, state: addr.state, postal_code: addr.postal_code, country: addr.country, is_default: addr.is_default });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    show('Address deleted', 'success');
    fetchAddresses();
  };

  return (
    <AccountLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">My Addresses</h1>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-accent py-2.5">
            <Plus className="w-4 h-4" /> Add Address
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <button type="button" onClick={resetForm}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1.5">Full Name</label><input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required className="input" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-semibold mb-1.5">Address Line 1</label><input value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required className="input" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-semibold mb-1.5">Address Line 2</label><input value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} className="input" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">City</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="input" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">State</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="input" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">Postal Code</label><input value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required className="input" /></div>
            <div><label className="block text-sm font-semibold mb-1.5">Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input" /></div>
          </div>
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
            <span className="text-sm font-medium">Set as default address</span>
          </label>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn-accent"><Check className="w-4 h-4" /> {editingId ? 'Update' : 'Save'} Address</button>
            <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <EmptyState icon={<MapPin className="w-10 h-10 text-gray-400" />} title="No addresses saved" description="Add a delivery address to speed up checkout." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="card p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  {addr.is_default && <span className="badge bg-green-100 text-green-700">Default</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(addr)} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <p className="font-semibold text-sm">{addr.full_name}</p>
              <p className="text-sm text-gray-600 mt-1">{addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}</p>
              <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postal_code}</p>
              <p className="text-sm text-gray-600">{addr.country}</p>
              <p className="text-sm text-gray-500 mt-2">Phone: {addr.phone}</p>
            </div>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
