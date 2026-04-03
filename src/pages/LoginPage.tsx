import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Shield, LogIn, Eye, EyeOff, Search, ArrowRight } from 'lucide-react';

interface Props {
  onAdminLogin: () => void;
}

export default function LoginPage({ onAdminLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [trackingNum, setTrackingNum] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@deliverproof.com' && password === 'admin123') {
      onAdminLogin();
      navigate('/admin');
    } else {
      setError('Invalid credentials. Try admin@deliverproof.com / admin123');
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNum.trim()) {
      navigate(`/track?q=${encodeURIComponent(trackingNum.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 sm:mb-12 animate-fade-in">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-electric-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-electric-500/30">
          <Package className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">DeliverProof</h1>
          <p className="text-xs sm:text-sm text-slate-400">Digital Product Delivery System</p>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Admin Login Card */}
        <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-electric-400" />
            <h2 className="text-lg font-bold text-white">Admin Login</h2>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@deliverproof.com"
                className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
              />
            </div>
            <div className="relative">
              <label className="text-sm text-slate-400 mb-1.5 block">Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 bottom-3 text-slate-400 hover:text-white transition-colors">
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2 text-sm text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-electric-500 to-cyan-500 hover:from-electric-400 hover:to-cyan-400 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40"
            >
              <LogIn className="h-5 w-5" />
              Login to Dashboard
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-navy-700/50">
            <p className="text-xs text-slate-500 text-center">
              Demo: admin@deliverproof.com / admin123
            </p>
          </div>
        </div>

        {/* Tracking Lookup Card */}
        <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Track a Delivery</h2>
          </div>
          <p className="text-sm text-slate-400 mb-4">Enter your tracking number to check delivery status</p>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={trackingNum}
              onChange={e => setTrackingNum(e.target.value)}
              placeholder="DP-XXXXXX-XXXXXX"
              className="flex-1 bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500">
        <p>DeliverProof - Digital Product Delivery Tracking System</p>
        <p className="mt-1">Secure delivery verification for digital products</p>
      </div>
    </div>
  );
}
