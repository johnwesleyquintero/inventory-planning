import React, { useState } from 'react';
import { mockShipments } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import { MapPin, Calendar, Package, Truck } from 'lucide-react';

export default function Shipments() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? mockShipments : mockShipments.filter(s => s.status === statusFilter);

  const pipeline = [
    { status: 'at_supplier', label: 'At Supplier', color: 'bg-slate-400' },
    { status: 'on_water', label: 'On Water', color: 'bg-cyan-500' },
    { status: 'at_port', label: 'At Port', color: 'bg-indigo-500' },
    { status: 'en_route', label: 'En Route', color: 'bg-violet-500' },
    { status: 'arrived', label: 'Arrived', color: 'bg-emerald-500' },
    { status: 'received', label: 'Received', color: 'bg-green-600' },
  ];

  const pipelineCounts = pipeline.map(p => ({
    ...p,
    count: mockShipments.filter(s => s.status === p.status).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shipments & Inbound</h1>
          <p className="text-slate-500 text-sm mt-1">Track all inbound inventory across the supply chain</p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Shipment Pipeline</h3>
        <div className="flex items-center gap-1">
          {pipelineCounts.map((stage, idx) => (
            <div key={stage.status} className="flex-1 flex items-center">
              <div
                className={`flex-1 text-center py-3 rounded-lg ${stage.color} text-white cursor-pointer hover:opacity-90 transition-opacity ${statusFilter === stage.status ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                onClick={() => setStatusFilter(statusFilter === stage.status ? 'all' : stage.status)}
              >
                <p className="text-lg font-bold">{stage.count}</p>
                <p className="text-[10px] uppercase tracking-wide opacity-90">{stage.label}</p>
              </div>
              {idx < pipelineCounts.length - 1 && (
                <div className="w-4 h-0.5 bg-slate-200 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
        {statusFilter !== 'all' && (
          <button onClick={() => setStatusFilter('all')} className="mt-3 text-xs text-slate-500 hover:text-slate-700">
            ← Clear filter
          </button>
        )}
      </div>

      {/* Shipment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-slate-500">{shipment.shipmentId}</p>
                <p className="font-semibold text-slate-800 mt-0.5">{shipment.sku}</p>
                <p className="text-xs text-slate-500">{shipment.asin}</p>
              </div>
              <StatusBadge status={shipment.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Package size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Quantity</p>
                  <p className="text-sm font-semibold text-slate-700">{shipment.quantity.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Carrier</p>
                  <p className="text-sm font-semibold text-slate-700">{shipment.carrier}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Route</p>
                  <p className="text-xs font-medium text-slate-700">{shipment.origin}</p>
                  <p className="text-xs text-slate-500">→ {shipment.destination}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">ETA</p>
                  <p className="text-sm font-semibold text-slate-700">{shipment.eta}</p>
                  <p className="text-[10px] text-slate-500">Shipped: {shipment.shipDate}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase">Tracking</p>
              <p className="text-xs font-mono text-slate-600">{shipment.trackingNumber}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipment Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Inbound Pipeline Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Shipment ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">SKU</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Origin</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Destination</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Carrier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{s.shipmentId}</td>
                  <td className="px-4 py-3 text-xs font-medium">{s.sku}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.origin}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.destination}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3 text-xs">{s.carrier}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{s.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
