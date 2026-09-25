import React, { useState } from 'react';
import { X, Compass, Shield, MapPin, Check } from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { GeofenceZone } from '../../types';

interface CreateGeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGeofenceModal: React.FC<CreateGeofenceModalProps> = ({ isOpen, onClose }) => {
  const { addGeofence, events } = useCommand();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toleranceBufferMeters, setToleranceBufferMeters] = useState(100);
  const [color, setColor] = useState('#3b82f6');
  const [riskLevel, setRiskLevel] = useState<GeofenceZone['riskLevel']>('Normal');
  const [activeEvent, setActiveEvent] = useState(events[0]?.name || 'General Administration');
  const [centerLat, setCenterLat] = useState('24.8860');
  const [centerLng, setCenterLng] = useState('86.9240');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const lat = parseFloat(centerLat) || 24.8860;
    const lng = parseFloat(centerLng) || 86.9240;

    // Generate a default 4-point bounding polygon around the center
    const d = 0.005;
    const coordinates: [number, number][] = [
      [lat + d, lng - d],
      [lat + d, lng + d],
      [lat - d, lng + d],
      [lat - d, lng - d],
    ];

    addGeofence({
      name: name.trim(),
      type: 'polygon',
      center: [lat, lng],
      coordinates,
      color,
      status: 'Active',
      assignedPersonnelCount: 0,
      toleranceBufferMeters: Number(toleranceBufferMeters),
      activeEvent,
      riskLevel,
      description: description.trim() || 'Perimeter established for tactical field containment.',
    });

    onClose();
  };

  const colorPalette = [
    { label: 'Blue (Police)', hex: '#3b82f6' },
    { label: 'Purple (Fairgrounds)', hex: '#8b5cf6' },
    { label: 'Teal (Water Safety)', hex: '#06b6d4' },
    { label: 'Amber (Corridor)', hex: '#f59e0b' },
    { label: 'Red (High Security)', hex: '#ef4444' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 font-sans text-xs">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b2038] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Define Tactical Geofence Zone</h2>
              <p className="text-[11px] text-slate-300">Set containment boundary coordinates and breach buffers</p>
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
              Geofence Zone Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amarpur Chhath Ghat & Bridge Safety Perimeter"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Associated Event</label>
              <select
                value={activeEvent}
                onChange={e => setActiveEvent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                {events.map(ev => (
                  <option key={ev.id} value={ev.name}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Risk Level</label>
              <select
                value={riskLevel}
                onChange={e => setRiskLevel(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              >
                <option value="Normal">Normal Security</option>
                <option value="Elevated">Elevated Vigil</option>
                <option value="High">High / VVIP Security</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Center Latitude</label>
              <input
                type="text"
                value={centerLat}
                onChange={e => setCenterLat(e.target.value)}
                placeholder="24.8860"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Center Longitude</label>
              <input
                type="text"
                value={centerLng}
                onChange={e => setCenterLng(e.target.value)}
                placeholder="86.9240"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Breach Tolerance Buffer (Meters)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={toleranceBufferMeters}
                onChange={e => setToleranceBufferMeters(Number(e.target.value))}
                className="flex-1 accent-blue-600"
              />
              <span className="font-mono font-bold text-slate-900 w-16 text-right">
                {toleranceBufferMeters} m
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Automated alarms will trigger if personnel venture beyond this boundary buffer.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Map Layer Color</label>
            <div className="flex items-center gap-2">
              {colorPalette.map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                    color === c.hex ? 'scale-110 border-slate-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                >
                  {color === c.hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Operational Scope & Description
            </label>
            <textarea
              rows={2}
              placeholder="Detail the physical containment limits (e.g., from north bridge to south ghat stairs)..."
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm"
            >
              Save & Activate Geofence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
