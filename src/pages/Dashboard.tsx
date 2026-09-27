import { mockInventory, mockShipments, mockForecast, mockMilestones } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import {
  Package,
  AlertTriangle,
  Truck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const criticalItems = mockInventory.filter(i => i.status === 'critical');
  const warningItems = mockInventory.filter(i => i.status === 'warning');
  const activeShipments = mockShipments.filter(s => !['arrived', 'received'].includes(s.status));
  const highPriorityForecasts = mockForecast.filter(f => f.priority === 'high');

  const inventoryByChannel = [
    { name: 'FBA US', value: mockInventory.filter(i => i.fulfillmentChannel === 'FBA' && i.marketplace === 'US').reduce((a, b) => a + b.unitsOnHand, 0) },
    { name: 'AWD', value: mockInventory.filter(i => i.fulfillmentChannel === 'AWD').reduce((a, b) => a + b.unitsOnHand, 0) },
    { name: 'WFS', value: mockInventory.filter(i => i.fulfillmentChannel === 'WFS').reduce((a, b) => a + b.unitsOnHand, 0) },
    { name: 'FBT', value: mockInventory.filter(i => i.fulfillmentChannel === 'FBT').reduce((a, b) => a + b.unitsOnHand, 0) },
    { name: 'FBA CA', value: mockInventory.filter(i => i.fulfillmentChannel === 'FBA' && i.marketplace === 'CA').reduce((a, b) => a + b.unitsOnHand, 0) },
    { name: 'FBA UK', value: mockInventory.filter(i => i.fulfillmentChannel === 'FBA' && i.marketplace === 'UK').reduce((a, b) => a + b.unitsOnHand, 0) },
  ];

  const velocityData = mockForecast.slice(0, 5).map(f => ({
    sku: f.sku.split('-').slice(1).join('-'),
    velocity: f.avgDailySales,
    cover: f.daysOfCover,
  }));

  const statusDistribution = [
    { name: 'Healthy', value: mockInventory.filter(i => i.status === 'healthy').length, color: '#10b981' },
    { name: 'Warning', value: mockInventory.filter(i => i.status === 'warning').length, color: '#f59e0b' },
    { name: 'Critical', value: mockInventory.filter(i => i.status === 'critical').length, color: '#ef4444' },
    { name: 'Overstock', value: mockInventory.filter(i => i.status === 'overstock').length, color: '#3b82f6' },
  ];

  const upcomingMilestones = mockMilestones
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Inventory overview & key metrics across all channels</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Units On Hand"
          value={mockInventory.reduce((a, b) => a + b.unitsOnHand, 0).toLocaleString()}
          icon={<Package className="text-emerald-600" size={20} />}
          trend="+12%"
          trendUp={true}
          bgColor="bg-emerald-50"
        />
        <KPICard
          title="Critical SKUs"
          value={criticalItems.length.toString()}
          icon={<AlertTriangle className="text-red-600" size={20} />}
          trend={`${warningItems.length} warnings`}
          trendUp={false}
          bgColor="bg-red-50"
        />
        <KPICard
          title="Active Shipments"
          value={activeShipments.length.toString()}
          icon={<Truck className="text-blue-600" size={20} />}
          trend={`${mockShipments.filter(s => s.status === 'arrived').length} arrived`}
          trendUp={true}
          bgColor="bg-blue-50"
        />
        <KPICard
          title="High Priority Reorders"
          value={highPriorityForecasts.length.toString()}
          icon={<TrendingUp className="text-amber-600" size={20} />}
          trend="Action needed"
          trendUp={false}
          bgColor="bg-amber-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Channel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Inventory by Fulfillment Channel</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={inventoryByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Velocity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Sales Velocity (Units/Day)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="sku" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="velocity" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Inventory Health</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-1 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Active Shipments Pipeline</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 text-slate-500 font-medium">Shipment</th>
                  <th className="text-left py-2 text-slate-500 font-medium">SKU</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Route</th>
                  <th className="text-left py-2 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-2 text-slate-500 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody>
                {activeShipments.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50">
                    <td className="py-2 font-mono text-xs">{s.shipmentId}</td>
                    <td className="py-2 text-xs">{s.sku}</td>
                    <td className="py-2 text-xs">{s.origin} → {s.destination}</td>
                    <td className="py-2"><StatusBadge status={s.status} /></td>
                    <td className="py-2 text-xs text-slate-600">{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Upcoming Milestones</h3>
        <div className="space-y-3">
          {upcomingMilestones.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
              <div className="flex-shrink-0">
                {m.status === 'completed' ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Clock size={18} className="text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{m.milestone}</p>
                <p className="text-xs text-slate-500">{m.project} • Due: {m.dueDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${m.progress}%` }} />
                </div>
                <span className="text-xs text-slate-500 w-8">{m.progress}%</span>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, trendUp, bgColor }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  );
}
