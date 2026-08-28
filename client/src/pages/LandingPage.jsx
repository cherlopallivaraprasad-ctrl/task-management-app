import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  TrendingUp,
  Flame,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  Calendar as CalendarIcon,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email, password) => {
    const res = await login(email, password);
    if (res?.success) {
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pb-32">
        {/* Background gradient decorative shapes */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-brand-200/50 via-indigo-100/40 to-transparent blur-3xl opacity-70" />
          <div className="absolute top-1/2 right-10 w-72 h-72 bg-purple-200/40 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs sm:text-sm font-bold mb-8 shadow-xs animate-in fade-in slide-in-from-bottom-3">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Next-Generation Productivity Platform</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6">
            Manage Your Tasks. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Achieve More.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            A simple and powerful task management platform to organize, track, and complete your work with role-based team management and intuitive calendar deadlines.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 active:scale-95 transition shadow-lg shadow-brand-500/25"
              >
                <span>Go to Your Workspace</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 active:scale-95 transition shadow-lg shadow-brand-500/25"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-base hover:bg-slate-50 transition shadow-sm"
                >
                  Login to Account
                </Link>
              </>
            )}
          </div>

          {/* Quick Demo Test Logins */}
          {!isAuthenticated && (
            <div className="inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white/90 backdrop-blur rounded-2xl border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-600">
              <span className="text-slate-400 pl-2">⚡ Quick Demo:</span>
              <button
                onClick={() => handleQuickLogin('user@example.com', 'User@123')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition"
              >
                👤 Try Demo User
              </button>
              <button
                onClick={() => handleQuickLogin('admin@example.com', 'Admin@123')}
                className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition"
              >
                👑 Try Demo Admin
              </button>
            </div>
          )}

          {/* Hero App Mockup Preview */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-3xl p-3 sm:p-4 bg-slate-900/5 ring-1 ring-slate-900/10 shadow-2xl backdrop-blur-xl">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                {/* Browser bar */}
                <div className="h-10 bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-xs font-mono text-slate-400">taskflow.app/dashboard</div>
                  <div className="w-12"></div>
                </div>

                {/* Dashboard Screenshot Mockup Content */}
                <div className="p-6 sm:p-8 bg-slate-50 text-left space-y-6">
                  {/* Stat Cards Mock */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-slate-500 font-semibold uppercase">Total Tasks</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">24</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-amber-600 font-semibold uppercase">Pending</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">8</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-blue-600 font-semibold uppercase">In Progress</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">6</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <p className="text-xs text-emerald-600 font-semibold uppercase">Completed</p>
                      <p className="text-2xl font-black text-slate-900 mt-1">10</p>
                    </div>
                  </div>

                  {/* Task items sample */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="font-bold text-sm text-slate-800">Recent Sprint Tasks</span>
                      <span className="text-xs text-brand-600 font-semibold">View all →</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Complete UI Wireframes & Layouts</p>
                          <p className="text-xs text-slate-400">Design • Due Tomorrow</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full">Urgent</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Implement MongoDB Mongoose Schema</p>
                          <p className="text-xs text-slate-400">Development • In Progress</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full">High</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-3">
              Power Packed Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to deliver high-impact results
            </h3>
            <p className="text-slate-600 mt-4 text-base sm:text-lg">
              Engineered with modern tools to keep you in flow state without the clutter of bloated enterprise software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-brand-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Task Management</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create, organize, categorize, update, and prioritize tasks with instantaneous reactivity and zero lag.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-indigo-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Team Collaboration & RBAC</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Distinct Admin and Normal User interfaces ensure clean separation of concerns and robust security.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-emerald-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Progress Tracking</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visual progress metrics, completion indicators, and comprehensive analytics charts keep goals on target.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-purple-500/20">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Calendar & Deadlines</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visual calendar schedule categorizes overdue, today, and upcoming milestones with clear urgency badges.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-rose-500/20">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Priority Management</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sort and filter seamlessly by Urgent, High, Medium, and Low priorities to focus on high-impact objectives.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-brand-300 transition group hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Secure Authentication</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Built-in JWT token verification, salted bcrypt password hashing, and protected route middlewares.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / STATS SECTION */}
      <section id="about" className="py-20 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-brand-400 mb-3">
                Why Choose TaskFlow?
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">
                Built for clarity, speed, and real-world results.
              </h3>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Traditional task apps often suffer from feature overload and sluggish interfaces. TaskFlow solves this by focusing on speed, responsiveness, and clear role separation.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Full-Stack REST Architecture</h5>
                    <p className="text-xs text-slate-400">Node.js Express backend coupled with MongoDB Mongoose for fast queries.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Separate Admin Control Center</h5>
                    <p className="text-xs text-slate-400">Comprehensive dashboard with interactive charts, user controls, and system statistics.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">100% Responsive Design</h5>
                    <p className="text-xs text-slate-400">Pixel-perfect experience on desktop monitors, laptops, iPads, and smartphones.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-800/60 p-8 rounded-3xl border border-slate-700/60">
              <div className="text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-4xl sm:text-5xl font-black text-brand-400 mb-2">99.9%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Uptime Reliability</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2">&lt;50ms</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">API Latency</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-4xl sm:text-5xl font-black text-amber-400 mb-2">2x</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Productivity Boost</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <p className="text-4xl sm:text-5xl font-black text-purple-400 mb-2">100%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Secure JWT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6">
            Ready to streamline your workflow?
          </h2>
          <p className="text-brand-100 text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Join productive teams and professionals using TaskFlow today. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-brand-700 font-extrabold text-base hover:bg-brand-50 active:scale-95 transition shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-800/80 text-white border border-brand-500/50 font-bold text-base hover:bg-brand-800 transition"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
