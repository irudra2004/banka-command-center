import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, CheckCircle2, Shield, Plus, Trash2 } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { DutyAssignment } from '../../types';

interface CreateDutyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDutyModal: React.FC<CreateDutyModalProps> = ({ isOpen, onClose }) => {
  const { personnel, geofences, events, addDutyAssignment } = useCommand();

  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState(events[0]?.name || 'Shravani Mela 2026');
  const [personnelId, setPersonnelId] = useState(personnel[0]?.id || '');
  const [zoneId, setZoneId] = useState(geofences[0]?.id || '');
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('04:00 PM');
  const [date, setDate] = useState('2026-09-26');
  const [instructions, setInstructions] = useState('');
  const [checkpoints, setCheckpoints] = useState([
    { id: 'CP-1', name: 'Main Sector Entry Checkpost', lat: 24.8860, lng: 86.9240, reached: false },
    { id: 'CP-2', name: 'Public Grievance Queue Line', lat: 24.8872, lng: 86.9255, reached: false },
  ]);
  const [newCheckpointName, setNewCheckpointName] = useState('');

  if (!isOpen) return null;

  const handleAddCheckpoint = () => {
    if (!newCheckpointName.trim()) return;
    setCheckpoints(prev => [
      ...prev,
      {
        id: `CP-${Date.now().toString().slice(-4)}`,
        name: newCheckpointName.trim(),
        lat: 24.88 + (Math.random() - 0.5) * 0.04,
        lng: 86.92 + (Math.random() - 0.5) * 0.04,
        reached: false,
      },
    ]);
    setNewCheckpointName('');
  };

  const handleRemoveCheckpoint = (id: string) => {
    setCheckpoints(prev => prev.filter(cp => cp.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedOfficer = personnel.find(p => p.id === personnelId);
    const selectedZone = geofences.find(g => g.id === zoneId);

    if (!selectedOfficer || !selectedZone || !title.trim()) return;

    addDutyAssignment({
      title: title.trim(),
      eventName,
      personnelId,
      personnelName: selectedOfficer.name,
      designation: selectedOfficer.designation,
      zoneId,
      zoneName: selectedZone.name,
      startTime,
      endTime,
      date,
      status: 'Active',
      instructions: instructions || 'Maintain strict operational vigilance, log checkpoint arrivals, and report anomalies.',
      checkpoints,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans text-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0b2038] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Create Official Field Duty Assignment</h2>
              <p className="text-[11px] text-slate-300">Deploy authorized personnel with geofenced boundaries</p>
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
              Duty Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Shravani Mela - Main Entry Gate Crowd Management"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Select Major Event *
              </label>
              <select
                value={eventName}
                onChange={e => setEventName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.name}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Select Deployed Officer *
              </label>
              <select
                value={personnelId}
                onChange={e => setPersonnelId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
                {personnel.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id} - {p.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Assigned Geofence Duty Zone *
              </label>
              <select
                value={zoneId}
                onChange={e => setZoneId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
                {geofences.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Duty Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Shift Start Time *</label>
              <input
                type="text"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="08:00 AM"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Shift End Time *</label>
              <input
                type="text"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder="04:00 PM"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Route Checkpoints Section */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <label className="block text-slate-700 font-bold">
              Designate Route Checkpoints ({checkpoints.length})
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add checkpoint (e.g. Barrier Post #4)"
                value={newCheckpointName}
                onChange={e => setNewCheckpointName(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCheckpoint}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-1">
              {checkpoints.map(cp => (
                <div
                  key={cp.id}
                  className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-medium">{cp.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCheckpoint(cp.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Standing Orders & Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Specify crowd management protocol, emergency evacuation path, VHF radio channel..."
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm"
            >
              Create Duty Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
