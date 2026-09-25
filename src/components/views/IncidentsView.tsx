import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Shield,
  Eye,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { Incident } from '../../types';
import { Badge } from '../common/Badge';
import { IncidentDetailModal } from '../modals/IncidentDetailModal';
import { ReportIncidentModal } from '../modals/ReportIncidentModal';

export const IncidentsView: React.FC = () => {
  const {
    incidents,
    setActiveTab,
    setSelectedIncident,
    triggerSimulatedIncident,
  } = useCommand();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedModalIncident, setSelectedModalIncident] = useState<Incident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'all' || inc.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || inc.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCat && matchesStatus;
  });

  const getSeverityBadge = (severity: Incident['severity']) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="crimson" dot className="animate-pulse">CRITICAL</Badge>;
      case 'High':
        return <Badge variant="amber" dot>HIGH</Badge>;
      case 'Medium':
        return <Badge variant="blue" dot>MEDIUM</Badge>;
      case 'Low':
        return <Badge variant="slate" dot>LOW</Badge>;
    }
  };

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'Resolved':
        return <Badge variant="emerald" dot>Resolved</Badge>;
      case 'In Progress':
        return <Badge variant="amber" dot>In Progress</Badge>;
      case 'Team Dispatched':
        return <Badge variant="blue" dot>Team Dispatched</Badge>;
      case 'Acknowledged':
        return <Badge variant="purple" dot>Acknowledged</Badge>;
      case 'Reported':
        return <Badge variant="crimson" dot>New Report</Badge>;
    }
  };

  const criticalCount = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;
  const activeCount = incidents.filter(i => i.status !== 'Resolved').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Incident Management & Rapid Response Control
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
              {incidents.length} Registered Events
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time incident dispatching, law & order alerts, medical emergencies, crowd congestions, and response escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerSimulatedIncident}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold rounded-lg transition-colors"
            title="Inject simulated incident into control room"
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Simulate Incident</span>
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Critical Emergencies</span>
            <span className="text-2xl font-bold text-red-600">0{criticalCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Immediate intervention active</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active In Response</span>
            <span className="text-2xl font-bold text-blue-700">0{activeCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Teams dispatched on-ground</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Successfully Resolved</span>
            <span className="text-2xl font-bold text-emerald-700">{resolvedCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Signed off by Executive Officers</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incident, location, ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {['all', 'Crowd Management', 'Medical Emergency', 'Law & Order', 'Fire', 'Accident'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  categoryFilter.toLowerCase() === cat.toLowerCase()
                    ? 'bg-purple-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Incidents' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-medium mr-1">Status:</span>
          {['all', 'Reported', 'Acknowledged', 'Team Dispatched', 'In Progress', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                statusFilter.toLowerCase() === st.toLowerCase()
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'all' ? 'All Lifecycle' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Incident ID & Severity</th>
                <th className="py-3 px-3">Subject & Category</th>
                <th className="py-3 px-3">Incident Location</th>
                <th className="py-3 px-3">Reported By / Time</th>
                <th className="py-3 px-3">Assigned Team</th>
                <th className="py-3 px-3">Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.map(inc => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedModalIncident(inc)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-700">{inc.id}</span>
                      {getSeverityBadge(inc.severity)}
                    </div>
                  </td>

                  <td className="py-3 px-3 max-w-[220px]">
                    <p className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                      {inc.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{inc.category}</p>
                  </td>

                  <td className="py-3 px-3 max-w-[200px]">
                    <div className="flex items-center gap-1.5 text-slate-700 truncate">
                      <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      <span className="truncate">{inc.location.address}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Zone: {inc.zoneName || 'General Area'}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-800">{inc.reportedBy}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{inc.reportedTime}</span>
                    </p>
                  </td>

                  <td className="py-3 px-3">
                    {inc.responseTeam.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-semibold">
                        {inc.responseTeam[0]} {inc.responseTeam.length > 1 ? `+${inc.responseTeam.length - 1} more` : ''}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None assigned</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    {getStatusBadge(inc.status)}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedModalIncident(inc)}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded font-semibold transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedModalIncident}
        onClose={() => setSelectedModalIncident(null)}
        onViewOnMap={inc => {
          setSelectedIncident(inc);
          setActiveTab('live-map');
        }}
      />

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
