import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-mono text-nerve-muted mb-1 uppercase tracking-wider">{label}</label>}
      <input 
        className={`
          w-full bg-black/40 border border-nerve-border text-white px-4 py-3 rounded-sm 
          focus:outline-none focus:border-nerve-primary focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] 
          transition-all font-mono text-sm placeholder:text-nerve-muted
          ${error ? 'border-nerve-danger focus:border-nerve-danger' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-nerve-danger text-xs mt-1">{error}</p>}
    </div>
  );
};