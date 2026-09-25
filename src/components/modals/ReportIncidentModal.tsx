import React, { useState } from 'react';
import { X, AlertTriangle, MapPin, Shield } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { IncidentCategory, IncidentSeverity } from '../../types';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ isOpen, onClose }) => {
  const { geofences, reportIncident, currentUser } = useCommand();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Crowd Management');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [address, setAddress] = useState('');
  const [zoneId, setZoneId] = useState(geofences[0]?.id || '');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) return;

    const selectedZone = geofences.find(g => g.id === zoneId);

    reportIncident({
      title: title.trim(),
      category,
      severity,
      status: 'Reported',
      location: {
        lat: selectedZone ? selectedZone.center[0] : 24.8860,
        lng: selectedZone ? selectedZone.center[1] : 86.9240,
        address: address.trim(),
      },
      zoneId,
      zoneName: selectedZone?.name,
      reportedBy: currentUser ? currentUser.name : 'Sector Duty Officer',
      reportedTime: 'Just now',
      responseTeam: [],
      description: description.trim() || 'Urgent incident reported from field sector requiring control room intervention.',
    });

    onClose();
  };

  const categories: IncidentCategory[] = [
    'Law & Order',
    'Crowd Management',
    'Medical Emergency',
    'Fire',
    'Accident',
    'Security Threat',
    'Natural Disaster',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans text-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b2038] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Log Field Incident in Control System</h2>
              <p className="text-[11px] text-slate-300">Initiate emergency tracking, alarms, and response dispatch</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Incident Headline / Subject *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Barricade Collapse near Papaharini Kund Gate"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Severity Priority *</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
                <option value="Low">🟢 Low Severity</option>
                <option value="Medium">🟡 Medium Alert</option>
                <option value="High">🟠 High Priority</option>
                <option value="Critical">🔴 Critical Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Associated Zone</label>
              <select
                value={zoneId}
                onChange={e => setZoneId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                {geofences.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Landmark Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Near Shravani Seva Camp #4, Katoria Road"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Field Situation Description & Preliminary Assessment
            </label>
            <textarea
              rows={3}
              placeholder="State number of people involved, immediate medical assistance required, road blockages..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-sm"
            >
              Transmit & Register Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
