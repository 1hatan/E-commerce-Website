import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { show } = useToast();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { show('Passwords do not match', 'error'); return; }
    if (password.length < 6) { show('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      show(error, 'error');
    } else {
      show('Account created! Welcome to ShopVerse.', 'success');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ShopVerse and start your shopping journey">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" className="input pl-11" />
          </div>
        </div>
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
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="At least 6 characters" className="input pl-11 pr-11" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter password" className="input pl-11" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full">
          {loading ? 'Creating account...' : <>Create Account <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account? <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
