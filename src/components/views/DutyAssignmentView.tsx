import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Users,
  Shield,
  Eye
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { DutyAssignment } from '../../types';
import { Badge } from '../common/Badge';
import { CreateDutyModal } from '../modals/CreateDutyModal';

export const DutyAssignmentView: React.FC = () => {
  const { dutyAssignments, personnel, setActiveTab, setSelectedPersonnel } = useCommand();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  const filteredDuties = dutyAssignments.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.personnelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent =
      selectedEventFilter === 'all' || d.eventName.toLowerCase() === selectedEventFilter.toLowerCase();

    return matchesSearch && matchesEvent;
  });

  const getDutyStatusBadge = (status: DutyAssignment['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="emerald" dot>Active Shift</Badge>;
      case 'Breached':
        return <Badge variant="crimson" dot>Zone Breached</Badge>;
      case 'Scheduled':
        return <Badge variant="blue">Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="slate">Concluded</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Field Duty Assignment & Roster Management
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              {dutyAssignments.length} Assignments
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Create, schedule, and supervise tactical duty orders, route patrols, and checkposts for administrative events.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Duty Assignment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search duty title, officer, or zone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Event Filter:
          </span>
          {['all', 'Shravani Mela 2026', 'Mandar Mahotsav & Pilgrimage', 'Water Safety & Chhath Vigil', 'General Administration'].map(ev => (
            <button
              key={ev}
              onClick={() => setSelectedEventFilter(ev)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedEventFilter.toLowerCase() === ev.toLowerCase()
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ev === 'all' ? 'All Operations' : ev.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Duty Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDuties.map(duty => {
          const officer = personnel.find(p => p.id === duty.personnelId);
          const reachedCount = duty.checkpoints.filter(cp => cp.reached).length;

          return (
            <div
              key={duty.id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-400 block">{duty.id}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{duty.title}</h3>
                    <p className="text-[11px] text-blue-700 font-semibold">{duty.eventName}</p>
                  </div>
                  <div>{getDutyStatusBadge(duty.status)}</div>
                </div>

                {/* Assigned Officer Pill */}
                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                      {duty.personnelName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{duty.personnelName}</p>
                      <p className="text-[10px] text-slate-500">{duty.designation}</p>
                    </div>
                  </div>
                  {officer && (
                    <button
                      onClick={() => {
                        setSelectedPersonnel(officer);
                        setActiveTab('live-map');
                      }}
                      className="px-2 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Track</span>
                    </button>
                  )}
                </div>

                {/* Zone & Time Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 text-[10px] block">Duty Zone</span>
                    <span className="font-semibold text-slate-800">{duty.zoneName}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 text-[10px] block">Shift Timings</span>
                    <span className="font-semibold text-slate-800">
                      {duty.startTime} – {duty.endTime}
                    </span>
                  </div>
                </div>

                {/* Checkpoints Progress */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Assigned Checkpoints</span>
                    <span>
                      {reachedCount} / {duty.checkpoints.length} Verified
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{
                        width: `${(reachedCount / (duty.checkpoints.length || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {duty.checkpoints.map(cp => (
                      <span
                        key={cp.id}
                        className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${
                          cp.reached
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cp.reached ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{cp.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <p className="line-clamp-2 italic">“{duty.instructions}”</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Duty Modal */}
      <CreateDutyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
