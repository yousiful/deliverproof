import { useSearchParams, useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, CheckCircle2, Clock, Truck, Eye, Search } from 'lucide-react';
import { MOCK_DELIVERIES } from '../data';
import { useState } from 'react';
import type { DeliveryStatus } from '../types';

const STATUS_STEPS: { status: DeliveryStatus; label: string; icon: any }[] = [
  { status: 'pending', label: 'Created', icon: Clock },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  { status: 'accessed', label: 'Accessed', icon: Eye },
];

const STATUS_ORDER: Record<DeliveryStatus, number> = { pending: 0, shipped: 1, in_transit: 1, delivered: 2, accessed: 3 };

function formatDate(d?: string) {
  if (!d) return 'Pending';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function TrackingLookup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') || '';
  const [searchInput, setSearchInput] = useState(q);

  const delivery = MOCK_DELIVERIES.find(d => d.trackingNumber.toLowerCase() === q.toLowerCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        {/* Search */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Track Your Delivery</h2>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="DP-XXXXXX-XXXXXX"
              className="flex-1 bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
            />
            <button type="submit" className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 text-sm">
              Track
            </button>
          </form>
        </div>

        {q && !delivery && (
          <div className="bg-navy-900/60 backdrop-blur-sm border border-rose-500/30 rounded-2xl p-8 text-center animate-fade-in">
            <Package className="h-16 w-16 mx-auto mb-4 text-slate-600" />
            <h3 className="text-xl font-bold text-white mb-2">Tracking Number Not Found</h3>
            <p className="text-slate-400 text-sm">We couldn't find a delivery with tracking number: <span className="font-mono text-rose-400">{q}</span></p>
            <p className="text-slate-500 text-xs mt-2">Please check the number and try again.</p>
          </div>
        )}

        {delivery && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Card */}
            <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400 mb-1">TRACKING NUMBER</p>
                  <p className="font-mono text-electric-400 font-bold text-sm sm:text-base">{delivery.trackingNumber}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  delivery.status === 'accessed' ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30' :
                  delivery.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {delivery.status.toUpperCase().replace('_', ' ')}
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center justify-between relative mb-2">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-navy-700" />
                <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-electric-500 to-cyan-500 transition-all duration-500" style={{ width: `${(STATUS_ORDER[delivery.status] / 3) * 100}%` }} />
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= STATUS_ORDER[delivery.status];
                  const Icon = step.icon;
                  return (
                    <div key={step.status} className="flex flex-col items-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        done
                          ? 'bg-gradient-to-br from-electric-500 to-cyan-500 border-electric-400 shadow-lg shadow-electric-500/30'
                          : 'bg-navy-800 border-navy-600'
                      }`}>
                        <Icon className={`h-5 w-5 ${done ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${done ? 'text-white' : 'text-slate-500'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4">DELIVERY DETAILS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product</span>
                  <span className="text-white font-medium">{delivery.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type</span>
                  <span className="text-white capitalize">{delivery.productType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Method</span>
                  <span className="text-white capitalize">{delivery.deliveryMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created</span>
                  <span className="text-white">{formatDate(delivery.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shipped</span>
                  <span className="text-white">{formatDate(delivery.shippedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivered</span>
                  <span className="text-white">{formatDate(delivery.deliveredAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Times Accessed</span>
                  <span className="text-electric-400 font-bold">{delivery.accessCount}x</span>
                </div>
              </div>
            </div>

            {/* Access Button */}
            <button
              onClick={() => navigate(`/portal/${delivery.trackingNumber}`)}
              className="w-full bg-gradient-to-r from-electric-500 to-cyan-500 hover:from-electric-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 text-sm sm:text-base"
            >
              Access My Digital Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
