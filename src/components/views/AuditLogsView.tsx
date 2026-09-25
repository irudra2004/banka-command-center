import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Shield,
  Clock,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Download,
  Lock
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { AuditLog } from '../../types';
import { Badge } from '../common/Badge';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useCommand();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipDevice.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMod = moduleFilter === 'all' || log.module.toLowerCase() === moduleFilter.toLowerCase();

    return matchesSearch && matchesMod;
  });

  const getStatusBadge = (status: AuditLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="emerald" size="sm" dot>SUCCESS</Badge>;
      case 'WARNING':
        return <Badge variant="amber" size="sm" dot>WARNING</Badge>;
      case 'CRITICAL_AUDIT':
        return <Badge variant="crimson" size="sm" dot>CRITICAL</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              System Activity & Compliance Audit Log
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
              NIC Tamper-Evident Ledger
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Immutable trace of administrative duty allocations, geofence breaches, alert acknowledgments, and credential events.
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
            const dl = document.createElement('a');
            dl.setAttribute('href', dataStr);
            dl.setAttribute('download', `Audit_Log_Banka_${Date.now()}.json`);
            dl.click();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, officer, module or IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Module:
          </span>
          {['all', 'Duty Assignment', 'Geofencing', 'Incident Response', 'Emergency Alert', 'Authentication'].map(m => (
            <button
              key={m}
              onClick={() => setModuleFilter(m)}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                moduleFilter.toLowerCase() === m.toLowerCase()
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m === 'all' ? 'All Modules' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Log Timestamp (IST)</th>
                <th className="py-3 px-3">Authorized User</th>
                <th className="py-3 px-3">Module</th>
                <th className="py-3 px-4">Recorded Action / Event</th>
                <th className="py-3 px-3">IP / Device Origin</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900">{log.user}</p>
                    <p className="text-[10px] text-slate-400">{log.role}</p>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold">
                      {log.module}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {log.action}
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {log.ipDevice}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {getStatusBadge(log.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
