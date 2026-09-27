import { mockForecast } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import { AlertTriangle, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Forecasting() {
  const highPriority = mockForecast.filter(f => f.priority === 'high');
  const needsAction = mockForecast.filter(f => f.recommendedAction !== 'none');

  const velocityTrend = mockForecast.map(f => ({
    sku: f.sku.split('-').slice(1).join('-'),
    week1: f.weeklyVelocity[0],
    week2: f.weeklyVelocity[1],
    week3: f.weeklyVelocity[2],
    week4: f.weeklyVelocity[3],
    avg: f.avgDailySales,
  }));

  const coverProjection = mockForecast.map(f => ({
    sku: f.sku.split('-').slice(1).join('-'),
    daysOfCover: f.daysOfCover,
    safetyStock: f.safetyStockDays,
    leadTime: f.leadTimeDays,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Forecasting & Replenishment</h1>
        <p className="text-slate-500 text-sm mt-1">Sales velocity tracking, days of cover, and reorder window analysis</p>
      </div>

      {/* Alert Banner */}
      {highPriority.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">{highPriority.length} SKU(s) require immediate attention</p>
            <p className="text-xs text-red-600 mt-1">
              {highPriority.map(f => f.sku).join(', ')} — Stockout risk within {Math.min(...highPriority.map(f => f.daysOfCover))} days
            </p>
          </div>
        </div>
      )}

      {/* Core Logic Display */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Replenishment Logic</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">Sales Velocity</span>
          <span className="text-slate-400">+</span>
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Current Stock</span>
          <span className="text-slate-400">+</span>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-medium">Inbound Inventory</span>
          <span className="text-slate-400">+</span>
          <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg font-medium">Lead Time</span>
          <ArrowRight size={14} className="text-slate-400" />
          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg font-medium">Reorder Window / Stockout Risk</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Weekly Velocity Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={velocityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sku" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="week1" stroke="#94a3b8" strokeWidth={1} dot={false} name="Week 1" />
              <Line type="monotone" dataKey="week2" stroke="#64748b" strokeWidth={1} dot={false} name="Week 2" />
              <Line type="monotone" dataKey="week3" stroke="#475569" strokeWidth={1} dot={false} name="Week 3" />
              <Line type="monotone" dataKey="week4" stroke="#1e293b" strokeWidth={2} dot={false} name="Week 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Days of Cover vs Lead Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={coverProjection}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sku" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="daysOfCover" stroke="#10b981" fill="#10b98120" name="Days of Cover" />
              <Area type="monotone" dataKey="leadTime" stroke="#f59e0b" fill="#f59e0b20" name="Lead Time" />
              <Area type="monotone" dataKey="safetyStock" stroke="#ef4444" fill="#ef444420" name="Safety Stock" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Replenishment Forecast</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Market</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Avg Daily</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Days Cover</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Lead Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stockout Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Reorder By</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockForecast.map((f) => (
                <tr key={f.id} className={`hover:bg-slate-50 ${f.priority === 'high' ? 'bg-red-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{f.sku}</p>
                    <p className="text-xs text-slate-500">{f.asin}</p>
                  </td>
                  <td className="px-4 py-3 text-xs">{f.marketplace}</td>
                  <td className="px-4 py-3 text-right font-mono">{f.avgDailySales}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono font-semibold ${f.daysOfCover < 14 ? 'text-red-600' : f.daysOfCover < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {f.daysOfCover}d
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600">{f.leadTimeDays}d</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{f.projectedStockoutDate}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{f.reorderDate}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={f.recommendedAction} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={f.priority} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-emerald-600" />
          Recommended Actions
        </h3>
        <div className="space-y-3">
          {needsAction.map((f) => (
            <div key={f.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${f.priority === 'high' ? 'bg-red-500' : f.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">{f.sku} — {f.marketplace}</p>
                <p className="text-xs text-slate-500">
                  {f.recommendedAction === 'transfer' && 'Transfer from upstream inventory to cover shortfall'}
                  {f.recommendedAction === 'fba_shipment' && 'Create FBA shipment to replenish fulfillment center'}
                  {f.recommendedAction === 'supplier_reorder' && 'Place supplier reorder — lead time exceeds cover'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={12} />
                {f.reorderDate}
              </div>
              <StatusBadge status={f.priority} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
