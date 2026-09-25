import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Users,
  Send,
  Camera,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Incident, Personnel } from '../../types';
import { Badge } from '../common/Badge';
import { useCommand } from '../../context/CommandContext';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onViewOnMap: (inc: Incident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onViewOnMap,
}) => {
  const { personnel, assignResponseTeam, resolveIncident, currentUser } = useCommand();

  const [selectedOfficers, setSelectedOfficers] = useState<string[]>([]);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveForm, setShowResolveForm] = useState(false);

  if (!incident) return null;

  // Find nearby available officers
  const nearbyOfficers = personnel.filter(p => p.dutyStatus !== 'Offline');

  const handleToggleOfficer = (name: string) => {
    setSelectedOfficers(prev =>
      prev.includes(name) ? prev.filter(o => o !== name) : [...prev, name]
    );
  };

  const handleDispatchTeam = () => {
    if (selectedOfficers.length === 0) return;
    assignResponseTeam(incident.id, selectedOfficers);
    setSelectedOfficers([]);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    resolveIncident(incident.id, resolutionNotes);
    setShowResolveForm(false);
    onClose();
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans text-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0b2038] text-white p-4 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-amber-400 font-bold">{incident.id}</span>
              {getSeverityBadge(incident.severity)}
              <span className="text-slate-300 font-semibold">• {incident.category}</span>
            </div>
            <h2 className="text-base font-bold text-white">{incident.title}</h2>
            <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Reported {incident.reportedTime} by <strong>{incident.reportedBy}</strong></span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {/* Top Status & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Response Status</span>
              <span
                className={`font-bold text-sm ${
                  incident.status === 'Resolved'
                    ? 'text-emerald-700'
                    : incident.status === 'Team Dispatched'
                    ? 'text-blue-700'
                    : 'text-amber-700'
                }`}
              >
                {incident.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Incident Landmark</span>
              <div className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900">{incident.location.address}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Zone: {incident.zoneName || 'General Banka'} • Coords: {incident.location.lat.toFixed(4)}° N, {incident.location.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Evidence */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Incident Details & Situation Brief</h4>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 leading-relaxed text-xs">
              {incident.description}
            </div>

            {/* Photo / Video Evidence Placeholder */}
            <div className="p-3 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Field Evidence Photo / Body-Cam Capture</span>
              </div>
              <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline">
                [View Telemetry Snapshot #IMG-8291.jpg]
              </span>
            </div>
          </div>

          {/* Response Team & Nearest Personnel Dispatcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assigned Team */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Currently Assigned Response Squad</h4>
              <div className="space-y-1.5">
                {incident.responseTeam.length === 0 ? (
                  <p className="text-slate-400 italic">No response team dispatched yet.</p>
                ) : (
                  incident.responseTeam.map((officer, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200 font-medium text-slate-800">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>{officer}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dispatch Nearest Personnel */}
            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                Deploy Additional Force (Nearest Officers)
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {nearbyOfficers.slice(0, 4).map(off => (
                  <label
                    key={off.id}
                    className="flex items-center justify-between p-1.5 bg-white rounded border border-blue-100 cursor-pointer hover:bg-blue-50 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedOfficers.includes(`${off.name} (${off.department})`)}
                        onChange={() => handleToggleOfficer(`${off.name} (${off.department})`)}
                        className="rounded text-blue-600 border-slate-300"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{off.name}</p>
                        <p className="text-[10px] text-slate-500">{off.designation}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold">{off.dutyStatus}</span>
                  </label>
                ))}
              </div>

              {selectedOfficers.length > 0 && (
                <button
                  onClick={handleDispatchTeam}
                  className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Selected ({selectedOfficers.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Timeline of Actions Taken */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Chronological Audit Trail & Action Timeline
            </h4>
            <div className="border-l-2 border-slate-200 pl-3 space-y-2.5">
              {incident.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative">
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute -left-[17px] top-1 border border-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500">{item.time}</span>
                    <span className="font-semibold text-slate-800">{item.actor}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{item.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resolve Incident Form */}
          {showResolveForm && (
            <form onSubmit={handleConfirmResolve} className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs">Confirm Ground Resolution & Clearance</h4>
              <textarea
                rows={2}
                required
                placeholder="Enter field debrief (e.g. Crowd cleared, patient transported safely, situation returned to normal)..."
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded p-2 text-xs text-slate-900"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResolveForm(false)}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold"
                >
                  Submit Final Resolution
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onViewOnMap(incident);
              onClose();
            }}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            <span>Pinpoint on Live Map</span>
          </button>

          <div className="flex items-center gap-2">
            {incident.status !== 'Resolved' && (
              <button
                onClick={() => setShowResolveForm(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Incident Resolved</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
