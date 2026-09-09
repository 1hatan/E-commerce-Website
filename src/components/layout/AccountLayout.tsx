import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: '/account', label: 'Profile', icon: User },
    { to: '/account/orders', label: 'My Orders', icon: Package },
    { to: '/account/addresses', label: 'Addresses', icon: MapPin },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <div className="container-page py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{profile?.full_name || 'My Account'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
          <nav className="card p-2 space-y-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <link.icon className="w-4 h-4" /> {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
            <button onClick={() => { signOut(); navigate('/'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
