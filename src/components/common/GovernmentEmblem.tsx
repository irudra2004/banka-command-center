import React from 'react';

interface GovernmentEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
}

export const GovernmentEmblem: React.FC<GovernmentEmblemProps> = ({
  className = '',
  size = 'md',
  variant = 'color'
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const getBorderColor = () => {
    if (variant === 'light') return '#93c5fd';
    if (variant === 'dark') return '#1e3a8a';
    return '#d97706'; // Bihar/Govt Gold
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Ring with Gold border */}
        <circle cx="50" cy="50" r="47" stroke={getBorderColor()} strokeWidth="3" fill="#0b2038" />
        <circle cx="50" cy="50" r="43" stroke="#1e3a5f" strokeWidth="1.5" strokeDasharray="3 2" />
        
        {/* Inner Gold Ashoka Chakra Motifs */}
        <circle cx="50" cy="50" r="16" stroke="#f59e0b" strokeWidth="2" />
        <line x1="50" y1="34" x2="50" y2="66" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="34" y1="50" x2="66" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="38.7" y1="38.7" x2="61.3" y2="61.3" stroke="#f59e0b" strokeWidth="1" />
        <line x1="38.7" y1="61.3" x2="61.3" y2="38.7" stroke="#f59e0b" strokeWidth="1" />

        {/* Bodhi Tree / Bihar Emblem Stylized Crown */}
        <path
          d="M 50 18 C 45 22, 42 27, 50 32 C 58 27, 55 22, 50 18 Z"
          fill="#10b981"
        />
        <circle cx="43" cy="24" r="3" fill="#10b981" />
        <circle cx="57" cy="24" r="3" fill="#10b981" />

        {/* Twin Swastika / Bihar Traditional Motifs */}
        <rect x="23" y="47" width="5" height="5" fill="#f59e0b" rx="1" />
        <rect x="72" y="47" width="5" height="5" fill="#f59e0b" rx="1" />

        {/* Text Ribbon Arc / Lettering */}
        <text
          x="50"
          y="78"
          textAnchor="middle"
          fill="#f8fafc"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="0.8"
          fontFamily="system-ui, sans-serif"
        >
          BANKA
        </text>
        <text
          x="50"
          y="87"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="6"
          fontWeight="600"
          letterSpacing="0.5"
          fontFamily="system-ui, sans-serif"
        >
          GOVT OF BIHAR
        </text>
      </svg>
    </div>
  );
};
