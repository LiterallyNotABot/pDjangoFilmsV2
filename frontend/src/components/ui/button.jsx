import React from 'react';

export function Button({ children, className = '', variant = 'default', ...props }) {
  const base = 'rounded px-4 py-2 font-medium';
  const variants = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    outline: 'border border-purple-600 text-purple-600 hover:bg-purple-100',
    ghost: 'text-purple-600 hover:bg-purple-50',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
