import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Eye,
  Check,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { EmergencyAlert } from '../../types';
import { Badge } from '../common/Badge';

export const EmergencyAlertsView: React.FC = () => {
  const {
    emergencyAlerts,
    incidents,
    personnel,
    acknowledgeAlert,
    escalateAlert,
    resolveIncident,
    setActiveTab,
    setSelectedPersonnel,
    setSelectedIncident,
  } = useCommand();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const unacknowledgedCount = emergencyAlerts.filter(a => a.status === 'Unacknowledged').length;

  const filteredAlerts = emergencyAlerts.filter(a => {
    if (filterType === 'unacknowledged') return a.status === 'Unacknowledged';
    if (filterType === 'critical') return a.severity === 'Critical';
    if (filterType === 'geofence') return a.type === 'Geofence Breach';
    return true;
  });

  const handleViewLocation = (alert: EmergencyAlert) => {
    if (alert.personnelId) {
      const p = personnel.find(pers => pers.id === alert.personnelId);
      if (p) setSelectedPersonnel(p);
    }
    if (alert.incidentId) {
      const inc = incidents.find(i => i.id === alert.incidentId);
      if (inc) setSelectedIncident(inc);
    }
    setActiveTab('live-map');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Emergency Alert System & Crisis Dispatch Console
            </h1>
            {unacknowledgedCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white animate-pulse">
                {unacknowledgedCount} UNACKNOWLEDGED
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            High-priority operational warnings, boundary breaches, SOS panics, and multi-agency crisis escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-semibold transition-colors ${
              soundEnabled
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-red-500" />}
            <span>{soundEnabled ? 'Alert Chime: ON' : 'Alert Chime: MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: `All Alerts (${emergencyAlerts.length})` },
          { id: 'unacknowledged', label: `Unacknowledged (${unacknowledgedCount})` },
          { id: 'critical', label: 'Critical Severity Only' },
          { id: 'geofence', label: 'Geofence Breaches' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === tab.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-800 text-sm">No Pending Emergency Alerts</p>
            <p className="text-xs">All district sectors operating within nominal safety thresholds.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isUnack = alert.status === 'Unacknowledged';
            const isCritical = alert.severity === 'Critical';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-xl border transition-all p-5 shadow-sm space-y-4 ${
                  isUnack
                    ? 'border-red-400 ring-2 ring-red-100 bg-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Top Banner Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {isCritical ? 'CRITICAL ALERT' : 'DISTRICT WARNING'}
                    </span>
                    <span className="font-mono font-bold text-slate-500">{alert.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-800">{alert.type}</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.time}</span>
                    </span>
                    <Badge
                      variant={
                        alert.status === 'Resolved'
                          ? 'emerald'
                          : alert.status === 'Response Dispatched'
                          ? 'blue'
                          : alert.status === 'Acknowledged'
                          ? 'amber'
                          : 'crimson'
                      }
                      size="sm"
                      dot
                    >
                      {alert.status}
                    </Badge>
                  </div>
                </div>

                {/* Main Alert Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {alert.title}
                  </h3>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {alert.details}
                  </p>
                </div>

                {/* Telemetry & Response Context Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
                      Target Location
                    </span>
                    <div className="flex items-start gap-1 font-semibold text-slate-900">
                      <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>{alert.location}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
                      Reporting Source
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>{alert.reportingOfficer}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block mb-0.5">
                      Incident Linkage
                    </span>
                    <span className="font-mono font-semibold text-purple-700">
                      {alert.incidentId || alert.personnelId || 'Auto-Telemetry Breach'}
                    </span>
                  </div>
                </div>

                {/* Section 10 Action Buttons (Acknowledge, Assign, View Location, Escalate, Resolve) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {isUnack && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleViewLocation(alert)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Location</span>
                    </button>

                    <button
                      onClick={() => {
                        if (alert.incidentId) {
                          setActiveTab('incidents');
                        } else {
                          setActiveTab('personnel');
                        }
                      }}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      <span>Assign Response Team</span>
                    </button>

                    {alert.severity !== 'Critical' && (
                      <button
                        onClick={() => escalateAlert(alert.id)}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                        <span>Escalate to DM</span>
                      </button>
                    )}
                  </div>

                  {alert.status !== 'Resolved' && (
                    <button
                      onClick={() => {
                        if (alert.incidentId) {
                          resolveIncident(alert.incidentId, 'Resolved via Emergency Console');
                        } else {
                          acknowledgeAlert(alert.id);
                        }
                      }}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Resolve Incident</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
