import { useEffect, useState } from 'react';
import { Search, Users, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/utils/format';
import AdminLayout from '@/components/layout/AdminLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data ?? []); setLoading(false); });
  }, []);

  const filtered = users.filter((u) =>
    !search || (u.full_name?.toLowerCase().includes(search.toLowerCase())) || (u.id?.includes(search))
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Users</h1>
        <p className="text-gray-500">{users.length} registered users</p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input pl-11" />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading users..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users className="w-10 h-10 text-gray-400" />} title="No users found" />
      ) : (
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                        {(u.full_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.full_name || 'Unknown'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    {u.id === '00000000-0000-0000-0000-000000000000' || u.full_name === 'Store Admin' ? (
                      <span className="badge bg-purple-100 text-purple-700"><ShieldCheck className="w-3 h-3 mr-1" /> Admin</span>
                    ) : (
                      <span className="badge bg-blue-100 text-blue-700">Customer</span>
                    )}
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
