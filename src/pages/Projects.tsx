import React from 'react';
import { mockMilestones } from '../services/googleSheets';
import StatusBadge from '../components/StatusBadge';
import { Target, Calendar, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Projects() {
  const projects = [
    { name: 'Inventory Stabilization', icon: '📦', color: 'emerald' },
    { name: 'Forecasting & Replenishment', icon: '📈', color: 'blue' },
    { name: 'FBA Operations', icon: '🚚', color: 'purple' },
    { name: 'Freight Coordination', icon: '🌊', color: 'cyan' },
    { name: 'R7 - Logistics (Oct)', icon: '📊', color: 'indigo' },
    { name: 'R7 - Logistics (Nov)', icon: '💰', color: 'amber' },
    { name: 'R7 - Logistics (Dec)', icon: '✅', color: 'green' },
  ];

  const overallProgress = Math.round(mockMilestones.reduce((a, b) => a + b.progress, 0) / mockMilestones.length);
  const completedCount = mockMilestones.filter(m => m.status === 'completed').length;
  const inProgressCount = mockMilestones.filter(m => m.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Projects & Milestones</h1>
        <p className="text-slate-500 text-sm mt-1">Wesley's project tracker — Hungry Artisan operations</p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Overall Progress</p>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-3xl font-bold text-slate-900">{overallProgress}%</p>
          </div>
          <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Milestones</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{mockMilestones.length}</p>
          <p className="text-xs text-slate-500 mt-1">Across all workstreams</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide">Completed</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-1">{Math.round((completedCount / mockMilestones.length) * 100)}% done</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-wide">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-1">Active workstreams</p>
        </div>
      </div>

      {/* Workstream Relationship Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Workstream Relationship</h3>
        <div className="flex flex-col items-center gap-2">
          <FlowBlock label="DEMAND" sublabel="Existing Forecast" color="bg-blue-50 border-blue-200 text-blue-800" />
          <Arrow />
          <FlowBlock label="SUPPLY PLANNING" sublabel="Forecast / MOS / PO" color="bg-indigo-50 border-indigo-200 text-indigo-800" />
          <Arrow />
          <FlowBlock label="INVENTORY OPERATIONS" sublabel="FBA / AWD / WFS / FBT • Velocity / Cover / Inbound" color="bg-emerald-50 border-emerald-200 text-emerald-800" />
          <Arrow />
          <FlowBlock label="REPLENISHMENT ACTION" sublabel="Transfer / FBA Shipment / PO" color="bg-purple-50 border-purple-200 text-purple-800" />
          <Arrow />
          <FlowBlock label="LOGISTICS" sublabel="AGL + Alternative Forwarders" color="bg-amber-50 border-amber-200 text-amber-800" />
          <Arrow />
          <FlowBlock label="LANDED COST / TCO" sublabel="Total Cost of Ownership" color="bg-orange-50 border-orange-200 text-orange-800" />
          <Arrow />
          <FlowBlock label="2027 LOGISTICS DECISION" sublabel="Final recommendation" color="bg-red-50 border-red-200 text-red-800" />
        </div>
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-xs text-slate-600">
            <strong>Key Principle:</strong> Understand and preserve the existing planning system first. Add operational visibility, reorder logic, and logistics analysis where they create a genuine gap rather than rebuilding working components.
          </p>
        </div>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {projects.map((project) => {
          const projectMilestones = mockMilestones.filter(m => m.project === project.name);
          if (projectMilestones.length === 0) return null;
          const avgProgress = Math.round(projectMilestones.reduce((a, b) => a + b.progress, 0) / projectMilestones.length);

          return (
            <div key={project.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{project.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">{project.name}</h3>
                    <p className="text-xs text-slate-500">{projectMilestones.length} milestones</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgProgress}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{avgProgress}%</span>
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {projectMilestones.map((m) => (
                  <div key={m.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">
                      {m.status === 'completed' ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : m.status === 'in_progress' ? (
                        <Clock size={18} className="text-blue-500" />
                      ) : m.status === 'blocked' ? (
                        <AlertCircle size={18} className="text-red-500" />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${m.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'} font-medium`}>
                        {m.milestone}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{m.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={12} />
                        {m.dueDate}
                      </div>
                      <div className="hidden md:flex items-center gap-1 text-xs text-slate-500">
                        <User size={12} />
                        {m.owner}
                      </div>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${m.progress === 100 ? 'bg-emerald-500' : m.progress > 50 ? 'bg-blue-500' : m.progress > 0 ? 'bg-amber-500' : 'bg-slate-300'}`}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Target State */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-emerald-400" />
          <h3 className="text-lg font-bold">Operational End State</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-emerald-400 font-semibold uppercase mb-2">Inventory</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ Full visibility US, CA, UK</li>
              <li>✓ FBA/AWD/WFS/FBT tracked</li>
              <li>✓ No avoidable stockout gaps</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-blue-400 font-semibold uppercase mb-2">Forecasting</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ Velocity tracked continuously</li>
              <li>✓ Reorder triggers proactive</li>
              <li>✓ FBA shipments on schedule</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-amber-400 font-semibold uppercase mb-2">Logistics</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ 3+ forwarder framework</li>
              <li>✓ TCO analysis complete</li>
              <li>✓ Shipment validated</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-xs text-purple-400 font-semibold uppercase mb-2">Independence</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ Operating independently</li>
              <li>✓ Ready for TrekTek Q1 2027</li>
              <li>✓ Systems running without prompting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowBlock({ label, sublabel, color }: { label: string; sublabel: string; color: string }) {
  return (
    <div className={`px-6 py-3 rounded-lg border text-center ${color}`}>
      <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      <p className="text-[10px] opacity-75 mt-0.5">{sublabel}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="w-0.5 h-4 bg-slate-300" />
  );
}
