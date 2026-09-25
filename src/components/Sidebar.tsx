import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Users,
  ClipboardList,
  Compass,
  AlertTriangle,
  BellRing,
  Video,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useCommand } from '../context/CommandContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}) => {
  const {
    activeTab,
    setActiveTab,
    incidents,
    emergencyAlerts,
    personnel
  } = useCommand();

  const unacknowledgedAlerts = emergencyAlerts.filter(a => a.status === 'Unacknowledged').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;
  const outsideZoneCount = personnel.filter(p => p.dutyStatus === 'Outside Duty Zone').length;

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-map', label: 'Live Monitoring', icon: MapPin, badge: outsideZoneCount > 0 ? `${outsideZoneCount} breach` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'personnel', label: 'Field Personnel', icon: Users, count: personnel.length },
    { id: 'duty-assignments', label: 'Duty Assignments', icon: ClipboardList },
    { id: 'geofencing', label: 'Map & Geofencing', icon: Compass, badge: outsideZoneCount > 0 ? `${outsideZoneCount}` : undefined, badgeColor: 'bg-red-500' },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : undefined, badgeColor: 'bg-red-600' },
    { id: 'emergency-alerts', label: 'Alerts', icon: BellRing, badge: unacknowledgedAlerts > 0 ? `${unacknowledgedAlerts} NEW` : undefined, badgeColor: 'bg-red-600 animate-pulse' },
    { id: 'video-monitoring', label: 'Live Video', icon: Video, badge: '6 LIVE', badgeColor: 'bg-emerald-600' },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'events', label: 'Event Management', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'audit-logs', label: 'System Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#071627] text-slate-300 border-r border-[#152e4d] flex flex-col transition-all duration-200 ease-in-out select-none ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Sidebar Header (Mobile close or collapse toggle) */}
        <div className="p-3 border-b border-[#152e4d] flex items-center justify-between">
          <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-8 h-8 rounded bg-blue-900/60 border border-blue-700/60 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-bold text-white tracking-wide uppercase">Command Console</p>
                <p className="text-[10px] text-slate-400">Dist. Administration</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="hidden lg:flex p-1 rounded hover:bg-[#153457] text-slate-400 hover:text-white"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-[#102a48] hover:text-white'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}

                {!collapsed && item.count !== undefined && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info box */}
        {!collapsed && (
          <div className="p-3 border-t border-[#152e4d] bg-[#05111f] text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-slate-500 mb-1">
              <span>District Sector</span>
              <span className="text-emerald-400">DEFCON 4 (Nominal)</span>
            </div>
            <p className="truncate text-slate-300">Banka Central Dispatch</p>
            <p className="text-[10px] text-slate-500">Node: BR-BNK-DM-01</p>
          </div>
        )}
      </aside>
    </>
  );
};
