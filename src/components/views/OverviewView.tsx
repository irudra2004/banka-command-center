import React from 'react';
import {
  Users,
  ClipboardList,
  Wifi,
  AlertTriangle,
  Compass,
  BellRing,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  Radio,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Activity
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { useCommand } from '../../context/CommandContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const OverviewView: React.FC = () => {
  const {
    personnel,
    geofences,
    incidents,
    dutyAssignments,
    emergencyAlerts,
    events,
    setActiveTab,
    setSelectedPersonnel,
    setSelectedIncident,
    acknowledgeAlert,
    triggerSimulatedBreach,
  } = useCommand();

  const activeDutiesCount = dutyAssignments.filter(d => d.status === 'Active' || d.status === 'Breached').length;
  const onlineCount = personnel.filter(p => p.networkStatus !== 'Offline').length;
  const outsideZoneCount = personnel.filter(p => p.dutyStatus === 'Outside Duty Zone').length;
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const criticalAlerts = emergencyAlerts.filter(a => a.status === 'Unacknowledged');

  // Duty distribution by department
  const deptData = [
    { name: 'Police Forces', value: 72, color: '#3b82f6' },
    { name: 'Magistracy', value: 24, color: '#8b5cf6' },
    { name: 'SDRF River Rescue', value: 16, color: '#06b6d4' },
    { name: 'Health & EMS', value: 12, color: '#10b981' },
    { name: 'Transport / Excise', value: 4, color: '#f59e0b' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* High-Impact Critical Alert Banner (if unacknowledged alerts exist) */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse-fast">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 text-red-700 rounded-md mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider">
                  CRITICAL DISTRICT ALERT
                </span>
                <span className="text-xs text-red-700 font-semibold">{criticalAlerts[0].time}</span>
              </div>
              <h4 className="text-sm font-bold text-red-900 mt-1">{criticalAlerts[0].title}</h4>
              <p className="text-xs text-red-800 mt-0.5">{criticalAlerts[0].details}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => acknowledgeAlert(criticalAlerts[0].id)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm transition-colors"
            >
              Acknowledge Alert
            </button>
            <button
              onClick={() => setActiveTab('emergency-alerts')}
              className="px-3 py-1.5 bg-white border border-red-300 text-red-800 text-xs font-semibold rounded hover:bg-red-50 transition-colors"
            >
              View All ({criticalAlerts.length})
            </button>
          </div>
        </div>
      )}

      {/* Section 4: 6 Key Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Personnel"
          value="128"
          subtitle="Currently deployed"
          icon={<Users className="w-5 h-5" />}
          state="normal"
          badge="100% Deployed"
          onClick={() => setActiveTab('personnel')}
        />

        <StatCard
          title="Active Duties"
          value={activeDutiesCount || 42}
          subtitle="Across 6 sectors"
          icon={<ClipboardList className="w-5 h-5" />}
          state="info"
          badge="Shift #1 Active"
          onClick={() => setActiveTab('duty-assignments')}
        />

        <StatCard
          title="Personnel Online"
          value={`${onlineCount} / 128`}
          subtitle="Live telemetry link"
          icon={<Wifi className="w-5 h-5" />}
          state="normal"
          badge="94.2% Connected"
          onClick={() => setActiveTab('personnel')}
        />

        <StatCard
          title="Active Incidents"
          value={`0${activeIncidents.length}`}
          subtitle="In response queue"
          icon={<AlertTriangle className="w-5 h-5" />}
          state={activeIncidents.length > 0 ? 'warning' : 'normal'}
          badge={activeIncidents.length > 0 ? 'Action Req.' : 'Nominal'}
          onClick={() => setActiveTab('incidents')}
        />

        <StatCard
          title="Geofence Violations"
          value={`0${outsideZoneCount || 7}`}
          subtitle="Outside duty zone"
          icon={<Compass className="w-5 h-5" />}
          state="warning"
          badge="Breach Alert"
          onClick={() => setActiveTab('geofencing')}
        />

        <StatCard
          title="Emergency Alerts"
          value={`0${criticalAlerts.length || 2}`}
          subtitle="High priority"
          icon={<BellRing className="w-5 h-5" />}
          state={criticalAlerts.length > 0 ? 'critical' : 'normal'}
          badge="CRITICAL"
          onClick={() => setActiveTab('emergency-alerts')}
        />
      </div>

      {/* Main Command Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Map Quick Preview & Active Deployments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map Preview Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">District Field Deployment Live Status</h3>
                <span className="live-dot bg-emerald-500" />
              </div>
              <button
                onClick={() => setActiveTab('live-map')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Expand Full Map Control</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Mini Map Summary */}
            <div className="p-4 bg-slate-900 text-white relative">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Banka Collectorate Sector (18 on-site)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    Mandar Hill Fair (32 on-site)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Katoria Corridor (42 on-site)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('live-map')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open Live Leaflet Map
                </button>
              </div>

              {/* Quick Personnel Status Ticker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {personnel.slice(0, 4).map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPersonnel(p);
                      setActiveTab('live-map');
                    }}
                    className="p-2.5 rounded bg-slate-800/90 border border-slate-700/80 hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-800 ${
                            p.dutyStatus === 'Outside Duty Zone' ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white truncate max-w-[130px]">{p.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{p.assignedZoneName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          p.dutyStatus === 'Outside Duty Zone'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {p.dutyStatus === 'Outside Duty Zone' ? '+350m Breach' : 'In Zone'}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.batteryLevel}% Bat</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Incidents Queue */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">Immediate Field Incident Response Queue</h3>
              </div>
              <button
                onClick={() => setActiveTab('incidents')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                <span>View All Incidents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {incidents.slice(0, 3).map(inc => (
                <div
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncident(inc);
                    setActiveTab('incidents');
                  }}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          inc.severity === 'Critical'
                            ? 'crimson'
                            : inc.severity === 'High'
                            ? 'amber'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {inc.severity}
                      </Badge>
                      <span className="font-mono text-slate-400 text-[10px]">{inc.id}</span>
                      <span className="font-semibold text-slate-800">{inc.category}</span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">{inc.title}</p>
                    <p className="text-slate-500 text-[11px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{inc.location.address}</span>
                      <span>•</span>
                      <span>Reported {inc.reportedTime}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold ${
                        inc.status === 'Resolved'
                          ? 'bg-slate-100 text-slate-700'
                          : inc.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium">
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Command Actions & Force Composition */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              Administrative Quick Actions
            </h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('duty-assignments')}
                className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded font-semibold text-left flex items-center justify-between transition-colors"
              >
                <span>Assign New Field Duty</span>
                <PlusCircle className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => setActiveTab('communication')}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded font-semibold text-left flex items-center justify-between transition-colors"
              >
                <span>Broadcast Emergency SMS Alert</span>
                <Radio className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => setActiveTab('geofencing')}
                className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded font-semibold text-left flex items-center justify-between transition-colors"
              >
                <span>Configure Duty Geofence Zone</span>
                <Compass className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={() => setActiveTab('video-monitoring')}
                className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 rounded font-semibold text-left flex items-center justify-between transition-colors"
              >
                <span>View CCTV & Drone Video Matrix</span>
                <ExternalLink className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Department Deployment Distribution (Recharts) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              Deployed Force Distribution (128 Total)
            </h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deptData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deptData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} Personnel`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
              {deptData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Major Event Card */}
          <div className="bg-gradient-to-br from-[#0b2038] to-[#14365d] text-white rounded-lg p-4 shadow-sm border border-[#1b3b64]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                ACTIVE MAJOR EVENT
              </span>
              <Badge variant="emerald" size="sm" dot>Active Vigil</Badge>
            </div>
            <h4 className="font-bold text-sm text-white">{events[0].name}</h4>
            <p className="text-xs text-slate-300 mt-1">{events[0].expectedCrowd}</p>
            <div className="mt-3 pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Forces Deployed</span>
                <span className="font-bold text-amber-300">{events[0].deployedPersonnelCount} Officers</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Active Incidents</span>
                <span className="font-bold text-red-400">{events[0].activeIncidentsCount} Registered</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="mt-3 w-full py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors text-center"
            >
              Open Event Command Operations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
