import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  // Inventory statuses
  healthy: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Healthy' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Warning' },
  critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' },
  overstock: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Overstock' },
  // Shipment statuses
  at_supplier: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'At Supplier' },
  on_water: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'On Water' },
  at_port: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'At Port' },
  en_route: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'En Route' },
  arrived: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Arrived' },
  received: { bg: 'bg-green-100', text: 'text-green-700', label: 'Received' },
  // Project statuses
  not_started: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Not Started' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Completed' },
  blocked: { bg: 'bg-red-100', text: 'text-red-700', label: 'Blocked' },
  // Priority
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
  medium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Medium' },
  low: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Low' },
  // Actions
  transfer: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Transfer' },
  fba_shipment: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'FBA Shipment' },
  supplier_reorder: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Supplier Reorder' },
  none: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'No Action' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  );
}
