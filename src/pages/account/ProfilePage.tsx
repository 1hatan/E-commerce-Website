import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import AccountLayout from '@/components/layout/AccountLayout';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { show } = useToast();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName,
      phone,
    });
    if (error) show('Could not update profile', 'error');
    else { show('Profile updated', 'success'); await refreshProfile(); }
    setLoading(false);
  };

  return (
    <AccountLayout>
      <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>
      <div className="card p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input pl-11" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={user?.email ?? ''} disabled className="input pl-11 bg-gray-50" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="input pl-11" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-accent">
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
