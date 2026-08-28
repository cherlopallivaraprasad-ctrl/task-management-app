import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-brand-600 mb-2">404</p>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
