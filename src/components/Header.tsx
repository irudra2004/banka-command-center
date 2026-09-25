import React, { useState } from 'react';
import {
  Bell,
  Play,
  Pause,
  AlertTriangle,
  RotateCcw,
  Zap,
  LogOut,
  ChevronDown,
  Shield,
  Clock,
  Radio,
  Menu
} from 'lucide-react';
import { GovernmentEmblem } from './common/GovernmentEmblem';
import { useCommand } from '../context/CommandContext';
import { INITIAL_USERS } from '../data/mockData';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onOpenNotifications }) => {
  const {
    currentUser,
    logout,
    switchRole,
    currentTime,
    notificationCount,
    demoSimulationActive,
    toggleDemoSimulation,
    triggerSimulatedBreach,
    triggerSimulatedIncident,
    resetDemoData,
    setActiveTab,
  } = useCommand();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="bg-[#0b2038] text-white border-b border-[#1b3b64] sticky top-0 z-30 select-none shadow-md">
      {/* Top micro bar for Govt trust branding & quick simulation status */}
      <div className="bg-[#071627] px-3 sm:px-6 py-1 border-b border-[#142d4d] text-[11px] flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">BIHAR STATE COMMAND</span>
          <span className="text-slate-600">|</span>
          <span className="truncate">DISTRICT DISASTER & LAW ENFORCEMENT CONTROL ROOM, BANKA</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="live-dot bg-emerald-500" />
            <Clock className="w-3 h-3 text-emerald-400 inline" />
            <span>{currentTime || 'Synchronizing IST...'}</span>
          </div>
        </div>
      </div>

      {/* Main Header bar */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Hamburger + Banka Crest + Project Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-[#153457] rounded-md transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <GovernmentEmblem size="sm" variant="color" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  Banka District Administration
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE COMMAND
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                Field Duty Monitoring, Supervision & Incident Response System
              </p>
            </div>
          </div>
        </div>

        {/* Right: Simulation Controls + Alerts Bell + Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Demo Mode Button Group */}
          <div className="relative">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={toggleDemoSimulation}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-l-md transition-colors border ${
                  demoSimulationActive
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-500'
                    : 'bg-[#153457] hover:bg-[#1b436e] text-slate-200 border-[#234c7a]'
                }`}
                title={demoSimulationActive ? 'Click to Pause Demo Simulation' : 'Click to Start Simulation'}
              >
                {demoSimulationActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 animate-pulse" />
                    <span className="hidden sm:inline">Simulating Live GPS</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Start Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="px-1.5 py-1.5 text-xs bg-[#153457] hover:bg-[#1b436e] text-slate-200 border-t border-b border-r border-[#234c7a] rounded-r-md"
                title="Simulation Quick Actions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Demo Quick Actions Dropdown */}
            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                  Demo Evaluation Controls
                </div>
                <button
                  onClick={() => {
                    triggerSimulatedBreach();
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Simulate Geofence Breach</span>
                </button>
                <button
                  onClick={() => {
                    triggerSimulatedIncident();
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  <span>Simulate Critical Incident</span>
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  onClick={() => {
                    resetDemoData();
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Baseline</span>
                </button>
              </div>
            )}
          </div>

          {/* Emergency Alert Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-[#153457] rounded-md transition-colors"
            title="Emergency Alerts & Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 p-1.5 hover:bg-[#153457] rounded-md transition-colors text-left"
            >
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full border border-blue-400 object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold leading-tight text-white">{currentUser?.name}</p>
                <p className="text-[10px] text-amber-300 leading-tight">{currentUser?.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {/* Role Switcher Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="font-semibold text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-amber-400">{currentUser?.designation}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {currentUser?.employeeId}</p>
                </div>

                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 bg-slate-950/50">
                  Switch Active Role (RBAC Demo)
                </div>

                {INITIAL_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchRole(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      currentUser?.id === u.id ? 'text-blue-400 font-semibold bg-blue-950/30' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.role}</p>
                    </div>
                    {currentUser?.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={() => {
                    logout();
                    setShowRoleDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-950/50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Console</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
