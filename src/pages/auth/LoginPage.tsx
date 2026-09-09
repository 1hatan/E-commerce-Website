import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layout/AuthLayout';

export default function LoginPage() {
  const { signIn } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      show(error, 'error');
    } else {
      show('Welcome back!', 'success');
      const from = (location.state as { from?: string } | null)?.from || '/';
      navigate(from);
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue shopping">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input pl-11" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="input pl-11 pr-11" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-orange-600 font-semibold hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? 'Signing in...' : <>Sign In <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account? <Link to="/register" className="text-orange-600 font-semibold hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}
