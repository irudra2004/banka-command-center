import React from 'react';
import {
  X,
  MapPin,
  Battery,
  Wifi,
  Phone,
  MessageSquare,
  Shield,
  Navigation,
  Clock,
  Calendar,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Personnel } from '../../types';
import { Badge } from '../common/Badge';

interface PersonnelDetailModalProps {
  personnel: Personnel | null;
  onClose: () => void;
  onViewOnMap: (p: Personnel) => void;
  onSendMessage: (p: Personnel) => void;
}

export const PersonnelDetailModal: React.FC<PersonnelDetailModalProps> = ({
  personnel,
  onClose,
  onViewOnMap,
  onSendMessage,
}) => {
  if (!personnel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-xl border border-slate-300 shadow-2xl max-w-2xl w-full overflow-hidden text-xs font-sans flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b2038] text-white p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={personnel.avatar}
              alt={personnel.name}
              className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{personnel.name}</h2>
                <Badge variant={personnel.department === 'Police' ? 'blue' : 'purple'} size="sm">
                  {personnel.department}
                </Badge>
              </div>
              <p className="text-amber-300 font-medium text-xs mt-0.5">{personnel.designation}</p>
              <p className="text-slate-300 text-[11px] font-mono mt-0.5">
                Official Employee ID: {personnel.employeeId} • Phone: {personnel.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-slate-800">
          {/* Duty & Geofence Status Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Active Assignment
              </span>
              <p className="font-bold text-slate-900 text-sm">{personnel.assignedDutyTitle}</p>
              <p className="text-[11px] text-slate-600 mt-1">
                Event: <strong>{personnel.assignedEvent}</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                Duty ID: <span className="font-mono">{personnel.assignedDutyId}</span>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Assigned Geofence Zone
              </span>
              <p className="font-bold text-blue-700 text-sm">{personnel.assignedZoneName}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-600">Perimeter Status:</span>
                <span
                  className={`font-bold ${
                    personnel.distanceFromAssignedZone > 0 ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {personnel.distanceFromAssignedZone > 0
                    ? `Outside (+${personnel.distanceFromAssignedZone}m)`
                    : 'Inside Assigned Zone (0m)'}
                </span>
              </div>
            </div>
          </div>

          {/* Current GPS Coordinates & Address */}
          <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>Current GPS Telemetry & Landmark</span>
            </div>
            <p className="font-semibold text-slate-900 text-sm">{personnel.currentLocation.address}</p>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-mono">
              <span>Latitude: {personnel.currentLocation.lat.toFixed(6)}° N</span>
              <span>Longitude: {personnel.currentLocation.lng.toFixed(6)}° E</span>
              <span>Speed: {personnel.speedKmH} km/h</span>
              <span>Heading: {personnel.headingDeg}°</span>
            </div>
          </div>

          {/* Device Telemetry Grid */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Officer Hardware & Connection Diagnostics
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Battery Level</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-slate-900">
                  <Battery className={`w-4 h-4 ${personnel.batteryLevel < 20 ? 'text-red-500' : 'text-emerald-600'}`} />
                  <span>{personnel.batteryLevel}%</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Cellular Link</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-slate-900">
                  <Wifi className="w-4 h-4 text-blue-600" />
                  <span>{personnel.networkStatus}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Body-Cam Stream</span>
                <div className="mt-1 font-bold text-slate-900">
                  <Badge variant={personnel.bodyCamActive ? 'emerald' : 'slate'} size="sm" dot>
                    {personnel.bodyCamActive ? 'ONLINE' : 'STANDBY'}
                  </Badge>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Last Check-in</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{personnel.lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Shift Duty Notes */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Field Directives & Standing Instructions
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              Officer is mandated to stay within Sector coordinates, maintain radio contact with the Sector Control Room at Gandhi Chowk, verify designated visitor checkpoints every 45 minutes, and report any crowd density anomaly immediately.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${personnel.phone}`}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Radio Call</span>
            </a>
            <button
              onClick={() => {
                onSendMessage(personnel);
                onClose();
              }}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewOnMap(personnel);
                onClose();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Locate on Live Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
