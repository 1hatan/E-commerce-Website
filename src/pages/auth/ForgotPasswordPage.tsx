import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import AuthLayout from '@/components/layout/AuthLayout';

export default function ForgotPasswordPage() {
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      show(error.message, 'error');
    } else {
      setSent(true);
      show('Password reset link sent to your email', 'success');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a password reset link">
      {sent ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Check Your Email</h3>
          <p className="text-gray-600 mb-6">We've sent a password reset link to <span className="font-semibold">{email}</span></p>
          <Link to="/login" className="btn-accent">Back to Sign In</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="input pl-11" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full">
            {loading ? 'Sending...' : <>Send Reset Link <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>
      )}
      <p className="text-center text-sm text-gray-600 mt-6">
        Remember your password? <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
