import React, { useState } from 'react';
import { mockInventory } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, RefreshCw, Download } from 'lucide-react';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockInventory.filter(item => {
    const matchesSearch = item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || item.fulfillmentChannel === channelFilter;
    const matchesMarket = marketFilter === 'all' || item.marketplace === marketFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesChannel && matchesMarket && matchesStatus;
  });

  const totalUnits = filtered.reduce((a, b) => a + b.unitsOnHand, 0);
  const totalInTransit = filtered.reduce((a, b) => a + b.unitsInTransit, 0);
  const avgCover = filtered.length > 0 ? Math.round(filtered.reduce((a, b) => a + b.daysOfCover, 0) / filtered.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time inventory across all channels and markets</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <RefreshCw size={14} /> Sync
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total On Hand</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalUnits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">In Transit</p>
          <p className="text-xl font-bold text-blue-600 mt-1">{totalInTransit.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Avg Days of Cover</p>
          <p className={`text-xl font-bold mt-1 ${avgCover < 14 ? 'text-red-600' : avgCover < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>{avgCover} days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search SKU, ASIN, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option value="all">All Channels</option>
              <option value="FBA">FBA</option>
              <option value="AWD">AWD</option>
              <option value="WFS">WFS</option>
              <option value="FBT">FBT</option>
            </select>
            <select value={marketFilter} onChange={(e) => setMarketFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option value="all">All Markets</option>
              <option value="US">US</option>
              <option value="CA">Canada</option>
              <option value="UK">UK</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option value="all">All Status</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
              <option value="overstock">Overstock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Market</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Channel</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">On Hand</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">In Transit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inbound</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Velocity/Day</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Days Cover</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-800">{item.productName}</p>
                      <p className="text-xs text-slate-500">{item.sku} • {item.asin}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">{item.marketplace}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{item.fulfillmentChannel}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{item.unitsOnHand.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-blue-600">{item.unitsInTransit.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-violet-600">{item.unitsInbound.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-700">{item.dailyVelocity}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono font-semibold ${item.daysOfCover < 14 ? 'text-red-600' : item.daysOfCover < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {item.daysOfCover}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          Showing {filtered.length} of {mockInventory.length} items • Last synced: 2026-01-15 14:30 UTC
        </div>
      </div>
    </div>
  );
}
