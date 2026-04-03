import { useParams, useNavigate } from 'react-router-dom';
import {
  Package, ArrowLeft, Copy, CheckCircle2, Clock, Truck, Eye,
  Monitor, Calendar, Hash, User, Mail, Download, Shield
} from 'lucide-react';
import { MOCK_DELIVERIES, MOCK_LOGIN_ATTEMPTS } from '../data';
import type { DeliveryStatus } from '../types';

const STATUS_STEPS: { status: DeliveryStatus; label: string; icon: any }[] = [
  { status: 'pending', label: 'Created', icon: Clock },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  { status: 'accessed', label: 'Accessed', icon: Eye },
];

const STATUS_ORDER: Record<DeliveryStatus, number> = { pending: 0, shipped: 1, in_transit: 1, delivered: 2, accessed: 3 };

function formatDate(d?: string) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function DeliveryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const delivery = MOCK_DELIVERIES.find(d => d.id === id);
  const relatedLogins = MOCK_LOGIN_ATTEMPTS.filter(la => la.deliveryId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!delivery) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold mb-2">Delivery Not Found</h2>
          <button onClick={() => navigate('/admin')} className="text-electric-400 hover:text-electric-300 text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const currentStep = STATUS_ORDER[delivery.status];
  const copyTracking = () => navigator.clipboard.writeText(delivery.trackingNumber);

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="bg-navy-900/80 backdrop-blur-xl border-b border-navy-700/50 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">Delivery Details</h1>
            <p className="text-xs text-slate-400 font-mono truncate">{delivery.trackingNumber}</p>
          </div>
          <button onClick={copyTracking} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-all" title="Copy tracking number">
            <Copy className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Progress Tracker */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 sm:p-8 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-400 mb-6">DELIVERY PROGRESS</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-navy-700" />
            <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-electric-500 to-cyan-500 transition-all duration-500" style={{ width: `${(currentStep / 3) * 100}%` }} />
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep;
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" /> CUSTOMER
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-electric-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                  {delivery.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{delivery.customerName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {delivery.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 animate-fade-in">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" /> PRODUCT
            </h3>
            <div className="space-y-2">
              <p className="text-white font-semibold text-lg">{delivery.productName}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-electric-500/10 border border-electric-500/30 text-electric-400 text-xs px-2.5 py-1 rounded-full capitalize">{delivery.productType}</span>
                <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs px-2.5 py-1 rounded-full capitalize">{delivery.deliveryMethod.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> DELIVERY TIMELINE
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Created', date: delivery.createdAt, icon: Hash },
              { label: 'Shipped', date: delivery.shippedAt, icon: Truck },
              { label: 'Delivered', date: delivery.deliveredAt, icon: Download },
              { label: 'First Accessed', date: delivery.accessedAt, icon: Eye },
            ].filter(t => t.date).map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-electric-500/10 border border-electric-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <t.icon className="h-4 w-4 text-electric-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.label}</p>
                  <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Proof */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4" /> PROOF OF DELIVERY
          </h3>
          <p className="text-xs text-slate-500 mb-4">This log serves as evidence that the digital product was delivered and accessed by the customer.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-navy-800/60 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-white">{delivery.accessCount}</p>
              <p className="text-xs text-slate-400">Total Access</p>
            </div>
            <div className="bg-navy-800/60 rounded-xl p-3 text-center">
              <p className="text-sm font-mono text-electric-400 truncate">{delivery.ipAddress || 'N/A'}</p>
              <p className="text-xs text-slate-400">Last IP</p>
            </div>
            <div className="bg-navy-800/60 rounded-xl p-3 text-center">
              <p className="text-sm text-cyan-400 truncate">{delivery.userAgent || 'N/A'}</p>
              <p className="text-xs text-slate-400">Device</p>
            </div>
            <div className="bg-navy-800/60 rounded-xl p-3 text-center">
              <p className="text-sm text-emerald-400">{formatDate(delivery.accessedAt)}</p>
              <p className="text-xs text-slate-400">Last Access</p>
            </div>
          </div>

          {/* Login History for this delivery */}
          {relatedLogins.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 mb-3">LOGIN HISTORY</h4>
              <div className="space-y-2">
                {relatedLogins.map(la => (
                  <div key={la.id} className="flex items-center gap-3 bg-navy-800/40 rounded-lg p-3 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-white">{la.customerEmail}</span>
                      <span className="text-slate-500 mx-2">from</span>
                      <span className="text-slate-300 font-mono">{la.ipAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
                      <Monitor className="h-3 w-3" />
                      <span className="hidden sm:inline">{la.userAgent}</span>
                    </div>
                    <span className="text-slate-500 flex-shrink-0">{formatDate(la.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
