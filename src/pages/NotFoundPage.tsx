import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-8xl font-extrabold text-gray-200 mb-4">404</p>
      <h1 className="font-display text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link to="/" className="btn-accent"><Home className="w-4 h-4" /> Go Home</Link>
        <Link to="/shop" className="btn-outline"><ArrowLeft className="w-4 h-4" /> Browse Products</Link>
      </div>
    </div>
  );
}
