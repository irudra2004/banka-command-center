import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subValue?: string;
  icon: React.ReactNode;
  state?: 'normal' | 'warning' | 'critical' | 'info';
  onClick?: () => void;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  subValue,
  icon,
  state = 'normal',
  onClick,
  badge,
}) => {
  const stateStyles = {
    normal: {
      border: 'border-slate-200 hover:border-slate-300',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-slate-900',
      indicator: 'bg-emerald-500',
    },
    info: {
      border: 'border-slate-200 hover:border-blue-300',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600',
      valueColor: 'text-slate-900',
      indicator: 'bg-blue-500',
    },
    warning: {
      border: 'border-amber-200 hover:border-amber-300 bg-amber-50/20',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      iconBg: 'bg-amber-100 text-amber-700',
      valueColor: 'text-amber-900',
      indicator: 'bg-amber-500',
    },
    critical: {
      border: 'border-red-300 hover:border-red-400 bg-red-50/30',
      badge: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
      iconBg: 'bg-red-100 text-red-600',
      valueColor: 'text-red-700',
      indicator: 'bg-red-600 animate-ping',
    },
  };

  const currentTheme = stateStyles[state];

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-lg border p-4 shadow-sm transition-all duration-150 ${currentTheme.border} ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-bold tracking-tight ${currentTheme.valueColor}`}>
              {value}
            </span>
            {subValue && (
              <span className="text-xs font-medium text-slate-500">
                {subValue}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${currentTheme.iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className={`w-2 h-2 rounded-full ${currentTheme.indicator}`} />
          <span>{subtitle || 'Real-time telemetry active'}</span>
        </div>
        {badge && (
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${currentTheme.badge}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
