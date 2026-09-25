import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useCommand } from '../../context/CommandContext';

export const AnalyticsView: React.FC = () => {
  const { personnel, incidents, dutyAssignments, geofences } = useCommand();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'custom'>('7days');

  // Chart 1: Personnel Deployment Trend (Last 7 Days)
  const deploymentTrendData = [
    { day: 'Mon', Police: 68, Magistracy: 22, SDRF: 14, Health: 10 },
    { day: 'Tue', Police: 70, Magistracy: 22, SDRF: 14, Health: 10 },
    { day: 'Wed', Police: 72, Magistracy: 24, SDRF: 16, Health: 12 },
    { day: 'Thu', Police: 72, Magistracy: 24, SDRF: 16, Health: 12 },
    { day: 'Fri (Today)', Police: 72, Magistracy: 24, SDRF: 16, Health: 12 },
    { day: 'Sat', Police: 85, Magistracy: 30, SDRF: 20, Health: 16 },
    { day: 'Sun', Police: 92, Magistracy: 32, SDRF: 22, Health: 18 },
  ];

  // Chart 2: Incident Statistics by Category
  const incidentCategoryData = [
    { name: 'Crowd Management', count: 18, color: '#3b82f6' },
    { name: 'Medical Emergency', count: 14, color: '#10b981' },
    { name: 'Traffic / Transport', count: 11, color: '#f59e0b' },
    { name: 'Law & Order', count: 6, color: '#8b5cf6' },
    { name: 'Fire / Hazard', count: 3, color: '#ef4444' },
    { name: 'Water Safety', count: 4, color: '#06b6d4' },
  ];

  // Chart 3: Average Response Time Trend (minutes)
  const responseTimeData = [
    { time: '06:00 AM', responseMin: 7.4 },
    { time: '08:00 AM', responseMin: 6.2 },
    { time: '10:00 AM', responseMin: 4.8 },
    { time: '12:00 PM', responseMin: 4.5 },
    { time: '02:00 PM', responseMin: 5.1 },
    { time: '04:00 PM', responseMin: 4.9 },
    { time: '06:00 PM', responseMin: 4.2 },
  ];

  // Chart 4: Geofence Violations Trend
  const violationTrendData = [
    { day: 'Mon', breaches: 14 },
    { day: 'Tue', breaches: 9 },
    { day: 'Wed', breaches: 11 },
    { day: 'Thu', breaches: 8 },
    { day: 'Fri', breaches: 7 },
    { day: 'Sat', breaches: 15 },
    { day: 'Sun', breaches: 12 },
  ];

  // Chart 5: Active vs Resolved
  const incidentResolutionData = [
    { name: 'Resolved Incidents', value: 84, color: '#10b981' },
    { name: 'Active In Progress', value: 16, color: '#ef4444' },
  ];

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Reports & Operational Command Analytics
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
              District Evaluation Ready
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            Key performance indicators, response latency curves, geofence compliance, and force deployment trends.
          </p>
        </div>

        {/* Date Filter & Download */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border border-slate-300 rounded-lg p-1 flex items-center shadow-sm">
            {(['today', '7days', '30days'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDateFilter(d)}
                className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                  dateFilter === d ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 'today' ? 'Today' : d === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Official Report</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Avg. Emergency Response Time
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">4.8 min</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -1.4m faster
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t">Benchmark target: ≤ 8 minutes</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Duty Geofence Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700">94.5%</span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +2.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t">Officers adhering within zone buffer</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Checkpoint Arrival Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">91.2%</span>
            <span className="text-[11px] font-semibold text-blue-600">On schedule</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t">Verified digital NFC/GPS logs</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Incident Resolution Ratio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">84.0%</span>
            <span className="text-[11px] font-semibold text-emerald-600">84 of 100 resolved</span>
          </div>
          <p className="text-[11px] text-slate-500 pt-1 border-t">Average closeout within 45 mins</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Personnel Deployment Trend */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Force Deployment Trend by Wing</h3>
            <span className="text-[10px] text-slate-400">Total Deployed Personnel</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={deploymentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Police" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
                <Area type="monotone" dataKey="Magistracy" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} />
                <Area type="monotone" dataKey="SDRF" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.8} />
                <Area type="monotone" dataKey="Health" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incident Statistics by Category */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Incidents by Classification</h3>
            <span className="text-[10px] text-slate-400">56 Incidents Evaluated</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                  {incidentCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Response Latency Curve */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Average Incident Response Time (Minutes)</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Improving Curve</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 10]} />
                <Tooltip formatter={(value: any) => [`${value} Minutes`, 'Latency']} />
                <Line
                  type="monotone"
                  dataKey="responseMin"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Daily Geofence Breaches */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Daily Geofence Perimeter Breaches</h3>
            <span className="text-[10px] text-amber-600 font-semibold">Weekly Distribution</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="breaches" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
