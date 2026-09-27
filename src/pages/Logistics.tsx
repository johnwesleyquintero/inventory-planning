import { mockQuotes } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import { Ship, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Logistics() {
  const lanes = ['China → US (AWD)', 'China → Canada', 'China → UK'];

  const comparisonData = [
    { forwarder: 'AGL', 'China → US': 0.85, 'China → Canada': 0.92, 'China → UK': 1.05 },
    { forwarder: 'Flexport', 'China → US': 1.55, 'China → Canada': 1.40, 'China → UK': 1.60 },
    { forwarder: 'Freightos', 'China → US': 1.42, 'China → Canada': 1.30, 'China → UK': 1.50 },
    { forwarder: 'SSD Logistix', 'China → US': 1.20, 'China → Canada': 1.15, 'China → UK': 1.10 },
  ];

  const tcoBreakdown = [
    { factor: 'Base Freight Rate', agl: 0.85, flexport: 0.72, freightos: 0.78 },
    { factor: 'Placement Fee Impact', agl: 0, flexport: 0.83, freightos: 0.64 },
    { factor: 'AWD Auto-Replenish Value', agl: 0, flexport: 0.15, freightos: 0.15 },
    { factor: 'Total Landed Cost', agl: 0.85, flexport: 1.55, freightos: 1.42 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Logistics Optimization (R7)</h1>
        <p className="text-slate-500 text-sm mt-1">Multi-forwarder quoting & total cost of ownership analysis</p>
      </div>

      {/* R7 Milestone Tracker */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-5">
        <h3 className="text-sm font-semibold text-indigo-800 mb-3">R7 Milestone Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MilestoneCard
            month="October"
            title="Build Quoting Infrastructure"
            status="not_started"
            progress={0}
            tasks={['Contact AGL', 'Contact 2+ alternatives', 'Build comparison framework', 'Begin competitive quotes']}
          />
          <MilestoneCard
            month="November"
            title="TCO Analysis"
            status="not_started"
            progress={0}
            tasks={['Compare AGL vs alternatives', 'Quantify ecosystem benefits', 'Document analysis', 'Deliver to Justin']}
          />
          <MilestoneCard
            month="December"
            title="Execute & Validate"
            status="not_started"
            progress={0}
            tasks={['Execute shipment via new framework', 'Compare actual vs quoted costs', 'Document end-to-end process', 'Final recommendation']}
          />
        </div>
      </div>

      {/* Current Freight Structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Current Freight Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide">China → US</p>
            <p className="text-lg font-bold text-slate-800 mt-1">AGL → AWD</p>
            <p className="text-xs text-slate-500 mt-1">Primary lane, auto-replenishment enabled</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide">China → Canada</p>
            <p className="text-lg font-bold text-slate-800 mt-1">AGL → Vancouver FBA</p>
            <p className="text-xs text-slate-500 mt-1">Direct to Vancouver fulfillment</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wide">China → UK</p>
            <p className="text-lg font-bold text-slate-800 mt-1">SSD Logistix</p>
            <p className="text-xs text-slate-500 mt-1">UK-specific forwarder</p>
          </div>
        </div>
      </div>

      {/* Amazon Ecosystem Benefits */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" />
          Amazon Ecosystem Benefits (at risk with alternatives)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
            <DollarSign size={20} className="text-emerald-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">Inbound Placement Fee Waiver</p>
            <p className="text-xs text-slate-600 mt-1">~$0.27–$1.58/unit savings when using AGL</p>
            <div className="mt-2 px-2 py-1 bg-emerald-100 rounded text-xs text-emerald-700 font-medium inline-block">
              HIGH IMPACT
            </div>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <TrendingDown size={20} className="text-blue-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">AGL Discount vs Market</p>
            <p className="text-xs text-slate-600 mt-1">Estimated 10–20% discount on freight rates</p>
            <div className="mt-2 px-2 py-1 bg-blue-100 rounded text-xs text-blue-700 font-medium inline-block">
              MODERATE IMPACT
            </div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <Ship size={20} className="text-purple-600 mb-2" />
            <p className="text-sm font-semibold text-slate-800">AWD Auto-Replenishment</p>
            <p className="text-xs text-slate-600 mt-1">Automatic distribution to FBA from AWD</p>
            <div className="mt-2 px-2 py-1 bg-purple-100 rounded text-xs text-purple-700 font-medium inline-block">
              OPERATIONAL VALUE
            </div>
          </div>
        </div>
      </div>

      {/* Quote Comparison Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Total Landed Cost by Lane ($/unit)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="forwarder" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="China → US" fill="#6366f1" radius={[2, 2, 0, 0]} />
            <Bar dataKey="China → Canada" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="China → UK" fill="#f59e0b" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TCO Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-amber-600" />
          Total Cost of Ownership Breakdown (China → US lane)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cost Factor</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">AGL</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Flexport</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Freightos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tcoBreakdown.map((row, idx) => (
                <tr key={idx} className={idx === tcoBreakdown.length - 1 ? 'bg-slate-50 font-semibold' : ''}>
                  <td className="px-4 py-3 text-xs">{row.factor}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">${row.agl.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">${row.flexport.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">${row.freightos.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            <strong>Key Insight:</strong> While Flexport and Freightos offer lower base rates, AGL's total landed cost is significantly lower when accounting for placement fee waivers and Amazon ecosystem benefits. The face-value rate comparison is misleading.
          </p>
        </div>
      </div>

      {/* Active Quotes Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Active Quotes & Rate Cards</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Forwarder</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Lane</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">$/Unit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">$/Kg</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Transit</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Placement Waiver</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">AWD Auto</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">TCO</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Valid Until</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{q.forwarder}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{q.lane}</td>
                  <td className="px-4 py-3 text-right font-mono">${q.ratePerUnit.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono">${q.ratePerKg.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-xs">{q.transitTimeDays}d</td>
                  <td className="px-4 py-3 text-center">
                    {q.placementFeeWaiver ? (
                      <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-xs text-red-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {q.awdAutoReplenish ? (
                      <CheckCircle size={16} className="text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-xs text-red-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">${q.totalLandedCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{q.validUntil}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ month, title, status, progress, tasks }: {
  month: string;
  title: string;
  status: string;
  progress: number;
  tasks: string[];
}) {
  return (
    <div className="bg-white rounded-lg border border-indigo-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-indigo-600 uppercase">{month}</span>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <div className="mt-3 space-y-1.5">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-slate-300 flex-shrink-0" />
            <span className="text-xs text-slate-600">{task}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] text-slate-500">{progress}%</span>
      </div>
    </div>
  );
}
