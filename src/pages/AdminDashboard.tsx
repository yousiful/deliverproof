import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, LogOut, Search, Filter, Plus, Truck, CheckCircle2,
  Clock, AlertTriangle, Eye, Monitor, ArrowUpRight, BarChart3, Activity
} from 'lucide-react';
import { MOCK_DELIVERIES, MOCK_LOGIN_ATTEMPTS, generateTrackingNumber } from '../data';
import type { Delivery, DeliveryStatus, LoginAttempt } from '../types';

interface Props { onLogout: () => void; }

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: any }> = {
  pending: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', icon: Clock },
  shipped: { label: 'Shipped', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Truck },
  in_transit: { label: 'In Transit', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  accessed: { label: 'Accessed', color: 'text-electric-400', bg: 'bg-electric-500/10 border-electric-500/30', icon: Eye },
};

function StatusBadge({ status }: { status: DeliveryStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
      <Icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboard({ onLogout }: Props) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(MOCK_DELIVERIES);
  const [loginAttempts] = useState<LoginAttempt[]>(MOCK_LOGIN_ATTEMPTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'deliveries' | 'logins'>('deliveries');
  const [showNewModal, setShowNewModal] = useState(false);
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    delivered: deliveries.filter(d => d.status === 'delivered' || d.status === 'accessed').length,
    accessed: deliveries.filter(d => d.status === 'accessed').length,
    loginSuccess: loginAttempts.filter(l => l.success).length,
    loginFailed: loginAttempts.filter(l => !l.success).length,
  }), [deliveries, loginAttempts]);

  const filteredDeliveries = useMemo(() => {
    let list = deliveries;
    if (statusFilter !== 'all') list = list.filter(d => d.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.trackingNumber.toLowerCase().includes(q) ||
        d.customerName.toLowerCase().includes(q) ||
        d.customerEmail.toLowerCase().includes(q) ||
        d.productName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [deliveries, statusFilter, search]);

  const handleCreateDelivery = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newDelivery: Delivery = {
      id: `d${Date.now()}`,
      trackingNumber: generateTrackingNumber(),
      customerId: `c${Date.now()}`,
      customerName: fd.get('customerName') as string,
      customerEmail: fd.get('customerEmail') as string,
      productId: `p${Date.now()}`,
      productName: fd.get('productName') as string,
      productType: fd.get('productType') as Delivery['productType'],
      deliveryMethod: fd.get('deliveryMethod') as Delivery['deliveryMethod'],
      status: 'pending',
      createdAt: new Date().toISOString(),
      accessCount: 0,
    };
    setDeliveries(prev => [newDelivery, ...prev]);
    setShowNewModal(false);
  };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Header */}
      <header className="bg-navy-900/80 backdrop-blur-xl border-b border-navy-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-electric-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white hidden sm:block">DeliverProof</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewModal(true)}
              className="bg-gradient-to-r from-electric-500 to-cyan-500 hover:from-electric-400 hover:to-cyan-400 text-white font-semibold text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-electric-500/20"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Delivery</span>
            </button>
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-all"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total Deliveries', value: stats.total, icon: Package, color: 'from-electric-500 to-cyan-500', shadow: 'shadow-electric-500/20' },
            { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'from-emerald-500 to-emerald-400', shadow: 'shadow-emerald-500/20' },
            { label: 'Accessed / Confirmed', value: stats.accessed, icon: Eye, color: 'from-cyan-500 to-blue-500', shadow: 'shadow-cyan-500/20' },
            { label: 'Failed Logins', value: stats.loginFailed, icon: AlertTriangle, color: 'from-rose-500 to-amber-500', shadow: 'shadow-rose-500/20' },
          ].map((s, i) => (
            <div key={i} className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-xl p-4 sm:p-5 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center shadow-lg ${s.shadow}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <BarChart3 className="h-4 w-4 text-slate-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-navy-900/60 p-1 rounded-xl mb-6 w-fit border border-navy-700/40">
          {[
            { id: 'deliveries' as const, label: 'Deliveries', icon: Truck },
            { id: 'logins' as const, label: 'Login Attempts', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-electric-500 to-cyan-500 text-white shadow-lg shadow-electric-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'deliveries' && (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, tracking number..."
                  className="w-full bg-navy-900/60 border border-navy-700/40 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as DeliveryStatus | 'all')}
                  className="bg-navy-900/60 border border-navy-700/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-electric-500/50 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="accessed">Accessed</option>
                </select>
              </div>
            </div>

            {/* Deliveries Table */}
            <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-700/50">
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold">Tracking #</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden md:table-cell">Customer</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden lg:table-cell">Product</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold">Status</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden sm:table-cell">Method</th>
                      <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden lg:table-cell">Accessed</th>
                      <th className="text-right px-4 sm:px-6 py-4 text-slate-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((d, i) => (
                      <tr
                        key={d.id}
                        className="border-b border-navy-700/30 hover:bg-navy-800/50 transition-colors cursor-pointer animate-fade-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                        onClick={() => navigate(`/admin/delivery/${d.id}`)}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <span className="font-mono text-xs sm:text-sm text-electric-400">{d.trackingNumber}</span>
                          <p className="text-xs text-slate-500 mt-1 md:hidden">{d.customerName}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <p className="text-white font-medium">{d.customerName}</p>
                          <p className="text-xs text-slate-500">{d.customerEmail}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <p className="text-white">{d.productName}</p>
                          <p className="text-xs text-slate-500 capitalize">{d.productType}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4"><StatusBadge status={d.status} /></td>
                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                          <span className="capitalize text-slate-300 text-xs">{d.deliveryMethod.replace('_', ' ')}</span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <span className="text-white font-semibold">{d.accessCount}x</span>
                          {d.accessedAt && <p className="text-xs text-slate-500">{timeAgo(d.accessedAt)}</p>}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <button className="text-electric-400 hover:text-white p-1.5 rounded-lg hover:bg-navy-700 transition-all">
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredDeliveries.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No deliveries match your search</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'logins' && (
          <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-700/50">
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold">Customer</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden md:table-cell">Tracking #</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold">Status</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden sm:table-cell">IP Address</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold hidden lg:table-cell">Device</th>
                    <th className="text-left px-4 sm:px-6 py-4 text-slate-400 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {loginAttempts
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((la, i) => (
                    <tr key={la.id} className="border-b border-navy-700/30 hover:bg-navy-800/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                      <td className="px-4 sm:px-6 py-4">
                        <p className="text-white font-medium">{la.customerName}</p>
                        <p className="text-xs text-slate-500">{la.customerEmail}</p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        {la.trackingNumber ? (
                          <span className="font-mono text-xs text-electric-400">{la.trackingNumber}</span>
                        ) : (
                          <span className="text-slate-600 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {la.success ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Success
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-rose-500/10 border-rose-500/30 text-rose-400">
                            <AlertTriangle className="h-3 w-3" /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <span className="font-mono text-xs text-slate-300">{la.ipAddress}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Monitor className="h-3 w-3" />
                          {la.userAgent}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-slate-300 text-xs">{timeAgo(la.timestamp)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* New Delivery Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/50 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl animate-slide-in">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Plus className="h-5 w-5 text-electric-400" />
              Create New Delivery
            </h3>
            <form onSubmit={handleCreateDelivery} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Customer Name</label>
                  <input name="customerName" required className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/50 transition-all" />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Customer Email</label>
                  <input name="customerEmail" type="email" required className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1.5 block">Product Name</label>
                <input name="productName" required className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/50 transition-all" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Product Type</label>
                  <select name="productType" className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/50 transition-all">
                    <option value="membership">Membership</option>
                    <option value="course">Course</option>
                    <option value="ebook">eBook</option>
                    <option value="software">Software</option>
                    <option value="template">Template</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1.5 block">Delivery Method</label>
                  <select name="deliveryMethod" className="w-full bg-navy-800/60 border border-navy-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-electric-500/50 transition-all">
                    <option value="portal">Customer Portal</option>
                    <option value="email">Email</option>
                    <option value="download_link">Download Link</option>
                    <option value="api">API</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)} className="flex-1 bg-navy-800 hover:bg-navy-700 text-slate-300 font-semibold py-3 rounded-xl transition-all text-sm">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-electric-500 to-cyan-500 hover:from-electric-400 hover:to-cyan-400 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-electric-500/20 text-sm">
                  Create Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
