import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, Shield, Compass, Check } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { SystemEvent } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { addEvent, geofences } = useCommand();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [expectedCrowd, setExpectedCrowd] = useState('');
  const [securityLevel, setSecurityLevel] = useState<SystemEvent['securityLevel']>('Heightened');
  const [status, setStatus] = useState<SystemEvent['status']>('Active');
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleZone = (zoneId: string) => {
    setSelectedZones(prev =>
      prev.includes(zoneId) ? prev.filter(z => z !== zoneId) : [...prev, zoneId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addEvent({
      name: name.trim(),
      date: date.trim() || 'Upcoming Schedule',
      location: location.trim() || 'Banka District Administrative Area',
      expectedCrowd: expectedCrowd.trim() || '50,000+ Attendees',
      securityLevel,
      status,
      dutyZones: selectedZones.length > 0 ? selectedZones : [geofences[0]?.id || 'ZONE-01'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-sm">Register Major Event / Public Gathering</h2>
              <p className="text-[11px] text-slate-400">Crowd deployment & security grid initialization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Event / Gathering Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Muharram Juloos / Eid Milad-un-Nabi Juloos / Mandar Mahotsav"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Date / Duration *
              </label>
              <input
                type="text"
                placeholder="e.g. July 06 - 08, 2026"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Expected Crowd Footfall
              </label>
              <input
                type="text"
                placeholder="e.g. 75,000+ Participants"
                value={expectedCrowd}
                onChange={e => setExpectedCrowd(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Location / Procession Route *
            </label>
            <input
              type="text"
              placeholder="e.g. Banka Sadar to Gandhi Chowk Corridor"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Security Threat Level
              </label>
              <select
                value={securityLevel}
                onChange={e => setSecurityLevel(e.target.value as SystemEvent['securityLevel'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none"
              >
                <option value="Standard">Standard Security</option>
                <option value="Heightened">Heightened Vigilance</option>
                <option value="Maximum">Maximum Security (VVIP / Critical)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Operational Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as SystemEvent['status'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none"
              >
                <option value="Active">Active (Live Operations)</option>
                <option value="Planning">Planning Phase</option>
                <option value="Standby">Standby Readiness</option>
                <option value="Concluded">Concluded</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Assigned Geofence Security Sectors
            </label>
            <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
              {geofences.map(z => {
                const isChecked = selectedZones.includes(z.id);
                return (
                  <label
                    key={z.id}
                    onClick={() => handleToggleZone(z.id)}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                      isChecked ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium truncate">{z.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Create Event Operation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
