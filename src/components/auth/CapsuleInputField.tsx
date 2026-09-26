import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CapsuleInputFieldProps {
  id?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  iconBgGradient?: string;
  rightElement?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

export const CapsuleInputField: React.FC<CapsuleInputFieldProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  icon: Icon,
  iconBgGradient = 'from-[#047857] to-[#013b2e]',
  rightElement,
  error,
  autoComplete,
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-700 pl-3">
          {label} {required && <span className="text-amber-500">*</span>}
        </label>
      )}

      <div
        className={`relative flex items-center w-full rounded-full bg-white transition-all shadow-[0_4px_16px_rgba(0,0,0,0.06)] border ${
          error
            ? 'border-rose-400 ring-2 ring-rose-100'
            : 'border-stone-200/80 hover:border-emerald-500/50 focus-within:border-emerald-600 focus-within:ring-3 focus-within:ring-emerald-500/15'
        }`}
      >
        {/* Left Floating Circular Icon Badge */}
        {Icon && (
          <div className="pl-1.5 py-1.5 flex items-center shrink-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${iconBgGradient} text-white flex items-center justify-center shadow-md shadow-emerald-950/20`}
            >
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
            </div>
          </div>
        )}

        {/* Text Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full py-3 sm:py-3.5 bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none ${
            Icon ? 'pl-3 sm:pl-3.5' : 'pl-5'
          } ${rightElement ? 'pr-11' : 'pr-5'}`}
        />

        {/* Right Element (e.g. Password Toggle) */}
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-rose-600 font-medium pl-3">{error}</p>}
    </div>
  );
};
