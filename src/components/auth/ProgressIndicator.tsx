import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  steps?: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  steps = ['Role', 'Details', 'Expertise', 'Security', 'Complete'],
}) => {
  return (
    <div className="w-full mb-6">
      {/* Step Numbers & Labels */}
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-stone-200 z-0" />
        {/* Active Filled Line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 z-0 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            maxWidth: 'calc(100% - 32px)',
          }}
        />

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-700 text-white shadow-emerald-700/20'
                    : isCurrent
                    ? 'bg-amber-400 text-emerald-950 ring-4 ring-amber-400/30 font-extrabold shadow-amber-400/30'
                    : 'bg-white text-stone-400 border border-stone-200'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-[11px] font-semibold tracking-tight transition-colors hidden sm:block ${
                  isCurrent
                    ? 'text-emerald-950 font-bold'
                    : isCompleted
                    ? 'text-emerald-800'
                    : 'text-stone-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
