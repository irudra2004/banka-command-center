import React, { useState } from 'react';
import {
  Compass,
  Plus,
  AlertTriangle,
  Shield,
  MapPin,
  CheckCircle2,
  Users,
  Eye,
  Sliders,
  Bell,
  Trash2
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { GeofenceZone } from '../../types';
import { Badge } from '../common/Badge';
import { CreateGeofenceModal } from '../modals/CreateGeofenceModal';

export const GeofencingView: React.FC = () => {
  const { geofences, personnel, setActiveTab, setSelectedPersonnel, triggerSimulatedBreach } = useCommand();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Personnel with active violations
  const violatedPersonnel = personnel.filter(p => p.dutyStatus === 'Outside Duty Zone');

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Map & Geofencing Management Module
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
              {geofences.length} Geofenced Zones
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Define tactical polygon perimeters, route corridors, checkpoint buffer radiuses, and automated containment breach alarms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={triggerSimulatedBreach}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold rounded-lg transition-colors"
            title="Test real-time breach detection"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Simulate Breach</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Geofence Zone</span>
          </button>
        </div>
      </div>

      {/* Live Geofence Breach Warning Banner (Section 8 Example Alert) */}
      {violatedPersonnel.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            <span>Active Geofence Containment Violations Detected ({violatedPersonnel.length})</span>
          </div>

          <div className="space-y-1.5">
            {violatedPersonnel.map(vp => (
              <div
                key={vp.id}
                className="p-3 bg-white rounded border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <p className="text-red-900 font-bold text-xs flex items-center gap-1.5">
                    <span>⚠ Personnel ID {vp.id.replace('OFF-', '')} ({vp.name})</span>
                    <span className="text-red-600 font-normal">
                      has moved {vp.distanceFromAssignedZone}m outside assigned Duty Zone:
                    </span>
                    <strong className="text-slate-900">{vp.assignedZoneName}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Current Location: {vp.currentLocation.address} • Battery: {vp.batteryLevel}% • Last update: {vp.lastUpdate}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setSelectedPersonnel(vp);
                      setActiveTab('live-map');
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors flex items-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Track on Map</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('communication')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded transition-colors"
                  >
                    Issue Recall Directive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geofence Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {geofences.map(zone => {
          const isViolated = zone.status === 'Violated' || violatedPersonnel.some(vp => vp.assignedZoneId === zone.id);
          const assignedCount = personnel.filter(p => p.assignedZoneId === zone.id).length;

          return (
            <div
              key={zone.id}
              className={`bg-white rounded-lg border p-4 shadow-sm transition-all flex flex-col justify-between space-y-3 ${
                isViolated ? 'border-red-300 ring-1 ring-red-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: isViolated ? '#ef4444' : zone.color }}
                    />
                    <span className="font-mono text-slate-400 text-[10px]">{zone.id}</span>
                  </div>
                  <Badge variant={isViolated ? 'crimson' : 'emerald'} size="sm" dot>
                    {isViolated ? 'Violated' : zone.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2">{zone.name}</h3>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{zone.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 text-[10px] block">Assigned Officers</span>
                    <span className="font-bold text-slate-900">{assignedCount || zone.assignedPersonnelCount} Active</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-500 text-[10px] block">Breach Tolerance</span>
                    <span className="font-bold text-slate-900">±{zone.toleranceBufferMeters} Meters</span>
                  </div>
                </div>

                <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                  <span className="text-slate-500 text-[10px] block">Center Datum Coordinates</span>
                  <span className="font-mono text-slate-700">
                    {zone.center[0].toFixed(4)}° N, {zone.center[1].toFixed(4)}° E
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Event: {zone.activeEvent}
                </span>
                <button
                  onClick={() => setActiveTab('live-map')}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Zone</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Geofence Modal */}
      <CreateGeofenceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
