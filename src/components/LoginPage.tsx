import React, { useState } from 'react';
import { Shield, Lock, User as UserIcon, KeyRound, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { GovernmentEmblem } from './common/GovernmentEmblem';
import { INITIAL_USERS } from '../data/mockData';
import { useCommand } from '../context/CommandContext';

interface LoginPageProps {
  onBackToLanding: () => void;
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding, onSuccess }) => {
  const { login } = useCommand();
  const [selectedUserId, setSelectedUserId] = useState<string>(INITIAL_USERS[0].id);
  const [username, setUsername] = useState<string>(INITIAL_USERS[0].employeeId);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const u = INITIAL_USERS.find(user => user.id === userId);
    if (u) {
      setUsername(u.employeeId);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      login(selectedUserId);
      setIsLoading(false);
      onSuccess();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Subtle Grid & Concentric Map Rings */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563eb 1.5px, transparent 1.5px), radial-gradient(#1e3a8a 1px, #0b1329 1px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: '0 0, 18px 18px',
        }}
      />

      {/* Top Back Link */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors z-20 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Portal Overview
      </button>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Government Header Box */}
        <div className="text-center mb-6">
          <GovernmentEmblem size="xl" className="mx-auto mb-3" />
          <h2 className="text-xs uppercase tracking-widest text-amber-500 font-bold">Government of Bihar</h2>
          <h1 className="text-xl font-bold text-white tracking-tight">District Administration, Banka</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Real-Time Field Duty Monitoring, Supervision & Incident Response System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-950/95 border border-slate-700/80 rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Administrative Portal Access</h3>
              <p className="text-[11px] text-slate-400">Restricted for Authorized Personnel Only</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-semibold">
              <Shield className="w-3 h-3" />
              <span>TLS 1.3 SECURE</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Role Picker */}
          <div className="mb-5 bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
            <label className="text-[11px] font-semibold text-slate-300 block mb-2 flex items-center justify-between">
              <span>Select Authorized Role (Demo Mode):</span>
              <span className="text-blue-400 text-[10px]">1-Click Login</span>
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {INITIAL_USERS.map(usr => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleUserSelect(usr.id)}
                  className={`w-full text-left p-2 rounded text-xs transition-all flex items-center justify-between ${
                    selectedUserId === usr.id
                      ? 'bg-blue-600/30 border border-blue-500 text-white font-medium'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-semibold text-[11px]">{usr.name}</p>
                    <p className="text-[10px] text-slate-400">{usr.role} • {usr.employeeId}</p>
                  </div>
                  {selectedUserId === usr.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username / Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. ADM-BNK-001"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Passphrase / Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Remember console</span>
              </label>
              <button
                type="button"
                onClick={() => alert('For password recovery, contact District Informatics Officer, NIC Banka (dio-banka@nic.in).')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot credentials?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              {isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter Command Room'}
            </button>
          </form>

          {/* Security Notice Box */}
          <div className="mt-5 p-3 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Official Government Security Notice</span>
            </div>
            <p className="leading-tight">
              Access is restricted to authorized officers under the Information Technology Act, 2000. All logins, telemetry queries, and dispatch actions are logged with timestamp and IP address in the NIC Security Audit Ledger.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-500 mt-4">
          Banka District Command & Control System • NIC Bihar Technical Support
        </p>
      </div>
    </div>
  );
};
