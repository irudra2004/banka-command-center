import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Users,
  Bell,
  Lock,
  Compass,
  Database,
  Save,
  CheckCircle2,
  KeyRound,
  Server
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { INITIAL_USERS } from '../../data/mockData';
import { Badge } from '../common/Badge';

export const SettingsView: React.FC = () => {
  const { currentUser } = useCommand();

  const [activeSubTab, setActiveSubTab] = useState<'rbac' | 'geofence' | 'security' | 'alerts'>('rbac');
  const [toleranceMeters, setToleranceMeters] = useState(100);
  const [toleranceDurationMins, setToleranceDurationMins] = useState(10);
  const [autoEscalateMins, setAutoEscalateMins] = useState(15);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [enforceMfa, setEnforceMfa] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const rbacMatrix = [
    { role: 'District Administrator', permissions: ['Full System Override', 'VVIP Incident Escalation', 'Emergency Broadcast SMS', 'Duty Approvals', 'System Security Audit'] },
    { role: 'Supervisory Officer', permissions: ['Create Duty Assignments', 'Incident Response Dispatch', 'Geofence Perimeter Definition', 'Officer Recall'] },
    { role: 'Monitoring Officer', permissions: ['Live Video Matrix View', 'Map Telemetry Monitoring', 'Acknowledge Field Alerts', 'Log Ground Incidents'] },
    { role: 'Field Officer', permissions: ['Duty Checkpoint Check-in', 'Self Telemetry Reporting', 'SOS Panic Signal Trigger', 'Field Chat Access'] },
    { role: 'Technical Administrator', permissions: ['Audit Log Maintenance', 'Device Hardware Telemetry', 'User Role Assignment', 'NIC Gateway Configuration'] },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Administrative Command Configuration & Security
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
              Root Level
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Role-based access permissions, automated geofence escalation thresholds, and state data security protocols.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings successfully saved & synced across NIC node</span>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'rbac', label: 'Roles & Access Matrix (RBAC)', icon: Users },
          { id: 'geofence', label: 'Geofence & Breach Thresholds', icon: Compass },
          { id: 'alerts', label: 'Notification & Escalation Timers', icon: Bell },
          { id: 'security', label: 'Data Security & Session Policies', icon: Shield },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab 1: RBAC */}
      {activeSubTab === 'rbac' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Role-Based Access Control (RBAC) Governance Matrix
            </h3>
            <p className="text-slate-500 mb-4">
              Enforces separation of duties in accordance with the Bihar Disaster Management & Police Administration guidelines.
            </p>

            <div className="space-y-3">
              {rbacMatrix.map(item => (
                <div key={item.role} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.role}</span>
                    <p className="text-[11px] text-slate-500">Government Classification Level: State Service Gazetted / Police Line</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.permissions.map((perm, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-300 text-[11px] font-medium">
                        ✓ {perm}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Geofence Thresholds */}
      {activeSubTab === 'geofence' && (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Geofence Automated Telemetry & Alert Triggers</h3>
          <p className="text-slate-500 text-xs">Configure how the automated tracking daemon detects spatial deviations.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 p-3 bg-slate-50 rounded border border-slate-200">
              <label className="font-bold text-slate-800 block">Default Boundary Buffer Tolerance (Meters)</label>
              <input
                type="number"
                value={toleranceMeters}
                onChange={e => setToleranceMeters(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Personnel exiting zone by more than this margin trigger Warning state.
              </p>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded border border-slate-200">
              <label className="font-bold text-slate-800 block">Breach Grace Duration (Minutes)</label>
              <input
                type="number"
                value={toleranceDurationMins}
                onChange={e => setToleranceDurationMins(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                Continuous out-of-zone presence before Critical escalation alert fires.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Geofence Rules</span>
          </button>
        </form>
      )}

      {/* Sub-tab 3: Alerts & Escalation */}
      {activeSubTab === 'alerts' && (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Emergency Escalation & Auto-Dispatch Windows</h3>
          <p className="text-slate-500 text-xs">Thresholds for escalation from Sector Supervisor to District Magistrate.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 p-3 bg-slate-50 rounded border border-slate-200">
              <label className="font-bold text-slate-800 block">Unacknowledged Alert Auto-Escalation (Minutes)</label>
              <input
                type="number"
                value={autoEscalateMins}
                onChange={e => setAutoEscalateMins(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-900 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                If unacknowledged within this window, alert is dispatched to SP & DM mobile channels.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Escalation Policies</span>
          </button>
        </form>
      )}

      {/* Sub-tab 4: Security & Session */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleSave} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm mb-1">State Data Protection & Session Security</h3>
          <p className="text-slate-500 text-xs">Security measures guarding sensitive personnel location telemetry.</p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Mandatory 2FA OTP Authentication</p>
                <p className="text-[11px] text-slate-500">Require Aadhaar / NIC OTP for all administrative sign-ins</p>
              </div>
              <input
                type="checkbox"
                checked={enforceMfa}
                onChange={e => setEnforceMfa(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Inactivity Session Timeout</p>
                <p className="text-[11px] text-slate-500">Automatically locks command console after period of inactivity</p>
              </div>
              <span className="font-mono font-bold text-slate-800">{sessionTimeoutMins} Minutes</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Audit Trail Retention</p>
                <p className="text-[11px] text-slate-500">Minimum retention mandated for legal and magisterial inquiry</p>
              </div>
              <span className="font-bold text-slate-800">7 Years (Immutable)</span>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Update Security Protocols</span>
          </button>
        </form>
      )}
    </div>
  );
};
