import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 sm:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-md">
                <CheckSquare className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Task<span className="text-brand-400">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              A simple, secure, and modern task management platform designed for productive teams and high-performing individuals.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition">Task Management</a></li>
              <li><a href="#features" className="hover:text-white transition">Team Collaboration</a></li>
              <li><a href="#features" className="hover:text-white transition">Calendar Timeline</a></li>
              <li><a href="#features" className="hover:text-white transition">Analytics & Reporting</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="hover:text-white transition">User Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Admin Control Panel</Link></li>
              <li><a href="#about" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#about" className="hover:text-white transition">API Reference</a></li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Security</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Security Practices</a></li>
              <li><a href="#" className="hover:text-white transition">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, Node.js & MongoDB</span>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
