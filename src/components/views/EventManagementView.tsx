import React, { useState } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  AlertTriangle,
  Shield,
  Clock,
  Compass,
  Plus,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { SystemEvent } from '../../types';
import { Badge } from '../common/Badge';

export const EventManagementView: React.FC = () => {
  const { events, geofences, setActiveTab } = useCommand();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEvents = events.filter(e => {
    if (filterStatus === 'active') return e.status === 'Active';
    if (filterStatus === 'planning') return e.status === 'Planning';
    return true;
  });

  const getStatusBadge = (status: SystemEvent['status']) => {
    switch (status) {
      case 'Active':
        return <Badge variant="emerald" dot>Live Operations</Badge>;
      case 'Planning':
        return <Badge variant="blue">Planning Phase</Badge>;
      case 'Standby':
        return <Badge variant="amber">On Standby</Badge>;
      case 'Concluded':
        return <Badge variant="slate">Concluded</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Event Management & Mass Gathering Operations
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
              {events.length} Major Operations
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Strategic crowd management, VVIP protocol, disaster readiness, and religious congregation monitoring across Banka.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('duty-assignments')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan Event Roster</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['all', 'active', 'planning'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === tab
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            {tab === 'all' ? `All Operations (${events.length})` : tab === 'active' ? 'Active Live Operations' : 'Future Planning'}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(event => {
          const matchedZones = geofences.filter(g => event.dutyZones.includes(g.id));

          return (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400 font-bold">{event.id}</span>
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {event.securityLevel} Security
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{event.name}</h3>
                  </div>
                  <div>{getStatusBadge(event.status)}</div>
                </div>

                {/* Details list */}
                <div className="mt-3 space-y-2 text-slate-600">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-800">
                    <Users className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>Expected Footfall: <strong className="text-slate-900">{event.expectedCrowd}</strong></span>
                  </div>
                </div>

                {/* Metrics Pill Box */}
                <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Forces Deployed</span>
                    <span className="font-bold text-slate-900 text-sm">{event.deployedPersonnelCount} Officers</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Active Incidents</span>
                    <span className={`font-bold text-sm ${event.activeIncidentsCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      0{event.activeIncidentsCount} Registered
                    </span>
                  </div>
                </div>

                {/* Assigned Duty Zones */}
                <div className="mt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                    Designated Geofence Perimeters
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedZones.map(z => (
                      <span
                        key={z.id}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3 text-blue-600" />
                        <span>{z.name.split('(')[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('live-map')}
                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Inspect On Map</span>
                </button>

                <button
                  onClick={() => setActiveTab('duty-assignments')}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium flex items-center gap-1"
                >
                  <span>Manage Shift Rosters</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
