import React from 'react';
import {
  Shield,
  MapPin,
  Radio,
  AlertTriangle,
  Users,
  Compass,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  Lock,
  Activity,
  Award
} from 'lucide-react';
import { GovernmentEmblem } from './common/GovernmentEmblem';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Government Banner */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs px-4 py-2 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-500 uppercase tracking-wider">Government of Bihar</span>
            <span className="text-slate-600">|</span>
            <span>District Administration, Banka (बिहार सरकार)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Central Command Telemetry Online
            </span>
            <span className="hidden sm:inline text-slate-500">NIC Secure Gateway Enforced</span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <GovernmentEmblem size="md" variant="color" />
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                District Administration, Banka
                <span className="text-[10px] uppercase font-semibold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  Command Portal
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Field Duty Monitoring, Supervision & Emergency Incident Response System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-xs font-semibold px-3.5 py-2 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Administrative Login
            </button>
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5"
            >
              Access Dashboard
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800">
          {/* Subtle Grid & Map Background Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#1e40af 1px, #0f172a 1px)`,
              backgroundSize: '40px 40px',
              backgroundPosition: '0 0, 20px 20px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-3xl">
              {/* Proposal Prototype Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-medium mb-6">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>State Innovation & SCI Proposal Prototype | Banka Command Model</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Real-Time Field Duty Monitoring & Incident Response System
              </h2>

              <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed">
                Technology-enabled field monitoring, supervision and emergency response for
                <strong className="text-white font-semibold"> District Administration, Banka</strong>.
                Designed for authorized administrative officers to orchestrate on-ground forces, duty zones, route patrols, and crisis escalation in real time.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={onEnterApp}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 text-sm"
                >
                  <Activity className="w-4 h-4" />
                  Access Monitoring Dashboard
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  Official Sign-In
                </button>
              </div>

              {/* Status Bar */}
              <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>128 Personnel Configured</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>6 Critical Geofences Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Shravani Mela 2026 Corridor Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>Live Video Telemetry Simulated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Pillars Section (Requested in Section 23) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-2">Core Operational Architecture</h3>
            <p className="text-2xl sm:text-3xl font-bold text-white">Four Pillars of Field Command & Supervision</p>
            <p className="text-sm text-slate-400 mt-2">
              Integrated real-time decision support for the District Magistrate, Police Superintendent, and Executive Field Magistrates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Real-Time Location Monitoring</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Live high-precision tracking of Magistrates, Police Inspectors, Constables, and SDRF rescue squads across Banka with battery and network telemetry.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-blue-400 font-semibold flex items-center gap-1">
                <span>Centimeter GPS precision</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/30">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Live Field Visibility</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Simulated body-worn cameras, static CCTV checkpoints, and aerial drone feeds providing ground situational awareness straight to the Collectorate War Room.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Multi-feed video matrix</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 hover:border-red-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center mb-5 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Incident Reporting & Escalation</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instant alerts for crowd surges, medical distress, law & order breaches, and fires with nearest-officer dispatch, tracking timeline, and resolution auditing.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-red-400 font-semibold flex items-center gap-1">
                <span>Sub-5 minute response workflow</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 hover:border-amber-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Duty Zone & Route Management</h4>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Dynamic polygon geofencing for sensitive zones like Mandar Hill, Chandan Dam, and Kanwar Yatra corridor. Automated warning triggers when personnel breach perimeter.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-amber-400 font-semibold flex items-center gap-1">
                <span>Automated breach detection</span>
              </div>
            </div>
          </div>

          {/* Prototype Technical Disclaimer Box */}
          <div className="mt-16 bg-slate-950/80 border border-slate-800 rounded-xl p-6 text-xs text-slate-400">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Demonstration Prototype & Academic Proposal Notice:</p>
                <p>
                  This system is a comprehensive operational prototype engineered for the Banka District Administration project proposal under the State Capability Initiative (SCI). All personnel records, GPS telemetries, incident dispatches, and video streams represent realistic demonstration data and are simulated in-browser for administrative review and evaluation committee presentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 District Administration, Banka. Department of Cabinet Secretariat & Home, Govt. of Bihar.</p>
          <div className="flex items-center gap-4">
            <span>NIC Secure Architecture</span>
            <span>•</span>
            <span>Role-Based Access Control</span>
            <span>•</span>
            <span>ISO 27001 Audit Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
