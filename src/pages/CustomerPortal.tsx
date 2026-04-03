import { useParams, useNavigate } from 'react-router-dom';
import { Package, CheckCircle2, Download, Clock, Shield, ArrowLeft, ExternalLink } from 'lucide-react';
import { MOCK_DELIVERIES } from '../data';

function formatDate(d?: string) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CustomerPortal() {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const delivery = MOCK_DELIVERIES.find(d => d.trackingNumber === trackingNumber);
  const accessTime = new Date().toISOString();

  if (!delivery) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-slate-600" />
          <h2 className="text-xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-slate-400 text-sm mb-4">This tracking number doesn't match any delivery.</p>
          <button onClick={() => navigate('/')} className="text-electric-400 hover:text-electric-300 text-sm">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Access Confirmation */}
        <div className="bg-gradient-to-br from-electric-500/10 to-cyan-500/10 border border-electric-500/30 rounded-2xl p-6 sm:p-8 mb-6 animate-fade-in text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30 animate-pulse-glow">
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Product Accessed Successfully</h2>
          <p className="text-slate-400 text-sm mb-4">
            Your access has been recorded. This serves as proof of delivery for your digital product.
          </p>
          <div className="bg-navy-900/80 rounded-xl p-4 inline-block">
            <p className="text-xs text-slate-400 mb-1">TRACKING NUMBER</p>
            <p className="font-mono text-electric-400 font-bold">{delivery.trackingNumber}</p>
          </div>
        </div>

        {/* Product Card */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl overflow-hidden mb-6 animate-fade-in">
          <div className="bg-gradient-to-r from-electric-500/20 to-cyan-500/20 px-6 py-4 border-b border-navy-700/40">
            <h3 className="text-white font-bold text-lg">{delivery.productName}</h3>
            <p className="text-slate-400 text-sm capitalize mt-1">{delivery.productType} - Delivered via {delivery.deliveryMethod.replace('_', ' ')}</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-navy-800/40 rounded-xl p-4">
                <Download className="h-8 w-8 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white font-medium">Your Product Is Ready</p>
                  <p className="text-xs text-slate-400 mt-1">Click below to access your digital product content</p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-electric-500 to-cyan-500 hover:from-electric-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-electric-500/25 hover:shadow-electric-500/40 flex items-center justify-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Open Product Content
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Receipt */}
        <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-400">DELIVERY RECEIPT</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">This receipt confirms you have received and accessed your digital product.</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-navy-700/30">
              <span className="text-slate-400">Product</span>
              <span className="text-white font-medium">{delivery.productName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-navy-700/30">
              <span className="text-slate-400">Tracking Number</span>
              <span className="text-electric-400 font-mono text-xs">{delivery.trackingNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-navy-700/30">
              <span className="text-slate-400">Delivery Date</span>
              <span className="text-white">{formatDate(delivery.deliveredAt)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-navy-700/30">
              <span className="text-slate-400">Access Time</span>
              <span className="text-emerald-400">{formatDate(accessTime)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-navy-700/30">
              <span className="text-slate-400">Total Access Count</span>
              <span className="text-white font-bold">{delivery.accessCount + 1}x</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Delivery Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> CONFIRMED
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            Access recorded at {formatDate(accessTime)}
          </p>
          <p className="mt-1">Powered by DeliverProof - Digital Product Delivery Verification</p>
        </div>
      </div>
    </div>
  );
}
