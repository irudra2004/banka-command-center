import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  Battery,
  Wifi,
  MapPin,
  ExternalLink,
  ChevronDown,
  Eye,
  Shield,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';
import { Personnel } from '../../types';
import { Badge } from '../common/Badge';
import { PersonnelDetailModal } from '../modals/PersonnelDetailModal';

export const PersonnelView: React.FC = () => {
  const { personnel, setSelectedPersonnel, setActiveTab } = useCommand();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'battery' | 'id'>('name');
  const [selectedModalPersonnel, setSelectedModalPersonnel] = useState<Personnel | null>(null);

  // Filter and sort personnel
  const filteredPersonnel = useMemo(() => {
    return personnel
      .filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.assignedZoneName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.designation.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept = departmentFilter === 'all' || p.department.toLowerCase() === departmentFilter.toLowerCase();
        const matchesStatus = statusFilter === 'all' || p.dutyStatus.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'battery') return b.batteryLevel - a.batteryLevel;
        if (sortBy === 'id') return a.id.localeCompare(b.id);
        return a.name.localeCompare(b.name);
      });
  }, [personnel, searchQuery, departmentFilter, statusFilter, sortBy]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Name,Designation,Department,Assigned Zone,Duty Status,Location Status,Distance Breach (m),Battery (%),Network,Phone'];
    const rows = filteredPersonnel.map(p =>
      `"${p.id}","${p.name}","${p.designation}","${p.department}","${p.assignedZoneName}","${p.dutyStatus}","${p.locationStatus}","${p.distanceFromAssignedZone}","${p.batteryLevel}","${p.networkStatus}","${p.phone}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Banka_Field_Personnel_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: Personnel['dutyStatus']) => {
    switch (status) {
      case 'On Duty':
        return <Badge variant="emerald" dot>{status}</Badge>;
      case 'Reached Location':
        return <Badge variant="blue" dot>{status}</Badge>;
      case 'Moving':
        return <Badge variant="amber" dot>{status}</Badge>;
      case 'Outside Duty Zone':
        return <Badge variant="crimson" dot>{status}</Badge>;
      case 'Emergency':
        return <Badge variant="crimson" dot className="animate-pulse">{status}</Badge>;
      case 'Offline':
        return <Badge variant="slate" dot>{status}</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Field Personnel Monitoring & Supervision
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              {filteredPersonnel.length} Active Officers
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Real-time biometric, GPS position, duty roster, and equipment telemetry of deployed forces across Banka District.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-700 font-semibold shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search officer name, ID, sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Department Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Department:
            </span>
            {['all', 'Police', 'Magistracy', 'SDRF', 'Health', 'Transport'].map(dept => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  departmentFilter.toLowerCase() === dept.toLowerCase()
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept === 'all' ? 'All Wings' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Second Filter Row */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 font-medium mr-1">Status:</span>
            {['all', 'On Duty', 'Moving', 'Outside Duty Zone', 'Emergency', 'Offline'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none"
            >
              <option value="name">Name (A-Z)</option>
              <option value="battery">Battery Level</option>
              <option value="id">Employee ID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Personnel Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Profile & Officer</th>
                <th className="py-3 px-3">Designation / Wing</th>
                <th className="py-3 px-3">Current Assignment</th>
                <th className="py-3 px-3">Assigned Zone</th>
                <th className="py-3 px-3">Duty Status</th>
                <th className="py-3 px-3">Location Status</th>
                <th className="py-3 px-3">Battery & Link</th>
                <th className="py-3 px-3">Last Update</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPersonnel.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => setSelectedModalPersonnel(p)}
                >
                  {/* Officer Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-300"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                            p.dutyStatus === 'Outside Duty Zone' || p.dutyStatus === 'Emergency'
                              ? 'bg-red-500'
                              : p.dutyStatus === 'Offline'
                              ? 'bg-slate-400'
                              : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Designation & Wing */}
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-800">{p.designation}</p>
                    <p className="text-[11px] text-slate-500">{p.department}</p>
                  </td>

                  {/* Current Duty */}
                  <td className="py-3 px-3 max-w-[180px]">
                    <p className="font-semibold text-slate-800 truncate" title={p.assignedDutyTitle}>
                      {p.assignedDutyTitle}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{p.assignedEvent}</p>
                  </td>

                  {/* Assigned Zone */}
                  <td className="py-3 px-3 max-w-[170px]">
                    <span className="font-medium text-blue-700 truncate block" title={p.assignedZoneName}>
                      {p.assignedZoneName}
                    </span>
                  </td>

                  {/* Duty Status */}
                  <td className="py-3 px-3">
                    {getStatusBadge(p.dutyStatus)}
                  </td>

                  {/* Location Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        p.distanceFromAssignedZone > 0 ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {p.distanceFromAssignedZone > 0
                        ? `⚠ Violated (+${p.distanceFromAssignedZone}m)`
                        : 'Inside Zone'}
                    </span>
                  </td>

                  {/* Battery & Network */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 font-semibold text-slate-700">
                        <Battery
                          className={`w-3.5 h-3.5 ${
                            p.batteryLevel < 20 ? 'text-red-500' : 'text-emerald-600'
                          }`}
                        />
                        <span>{p.batteryLevel}%</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {p.networkStatus}
                      </span>
                    </div>
                  </td>

                  {/* Last Update */}
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {p.lastUpdate}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedModalPersonnel(p)}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPersonnel(p);
                          setActiveTab('live-map');
                        }}
                        className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                        title="Track On Live Map"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Profile Drawer */}
      <PersonnelDetailModal
        personnel={selectedModalPersonnel}
        onClose={() => setSelectedModalPersonnel(null)}
        onViewOnMap={p => {
          setSelectedPersonnel(p);
          setActiveTab('live-map');
        }}
        onSendMessage={() => {
          setActiveTab('communication');
        }}
      />
    </div>
  );
};
