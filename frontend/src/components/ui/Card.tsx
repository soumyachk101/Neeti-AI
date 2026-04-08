import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  elevated = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 border';
  const bgStyles = elevated ? 'bg-[#1A1A24] border-transparent' : 'bg-[#111118] border-[#1E1E2E]';
  const hoverStyles = hoverable ? 'hover:border-[#2D2D42] transition-colors cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${bgStyles} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
