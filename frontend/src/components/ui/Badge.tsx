import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity?: 'low' | 'medium' | 'high' | 'critical';
  risk?: 'low' | 'medium' | 'high' | 'critical';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  severity,
  risk,
  className = '',
  ...props
}) => {
  const type = severity || risk || 'low';

  const styles = {
    low: 'bg-slate-800 text-slate-300 border-slate-700',
    medium: 'bg-amber-900/30 text-amber-500 border-amber-900/50',
    high: 'bg-red-900/30 text-red-400 border-red-900/50',
    critical: 'bg-red-900/50 text-red-500 border-red-600 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
