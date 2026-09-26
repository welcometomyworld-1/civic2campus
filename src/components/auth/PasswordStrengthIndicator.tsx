import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasMinLength, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Weak';
  let barColor = 'bg-rose-500';
  let textColor = 'text-rose-600';

  if (score === 2) {
    strengthLabel = 'Fair';
    barColor = 'bg-amber-500';
    textColor = 'text-amber-600';
  } else if (score === 3) {
    strengthLabel = 'Good';
    barColor = 'bg-emerald-500';
    textColor = 'text-emerald-600';
  } else if (score === 4) {
    strengthLabel = 'Strong';
    barColor = 'bg-emerald-600';
    textColor = 'text-emerald-600';
  }

  return (
    <div className="w-full space-y-2 pt-1 px-3">
      {/* Strength summary */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-stone-500">Password Strength:</span>
        <span className={textColor}>{strengthLabel}</span>
      </div>

      {/* Progress Bars (4 segments) */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-full transition-all duration-300 ${
              score >= step ? barColor : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-stone-500 pt-0.5">
        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-medium' : ''}`}>
          {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
          <span>8+ characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700 font-medium' : ''}`}>
          {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
          <span>Uppercase letter</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-medium' : ''}`}>
          {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
          <span>Number (0-9)</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-medium' : ''}`}>
          {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <X className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
          <span>Special symbol</span>
        </div>
      </div>
    </div>
  );
};
