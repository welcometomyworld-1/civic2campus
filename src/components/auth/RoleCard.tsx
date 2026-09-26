import React from 'react';
import { LucideIcon, ArrowRight, Check } from 'lucide-react';

interface RoleCardProps {
  id: string;
  title: string;
  roleName: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  isSelected: boolean;
  onSelect: () => void;
  onContinue?: () => void;
  features: string[];
  gradientTheme?: string;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  roleName,
  description,
  icon: Icon,
  badge,
  isSelected,
  onSelect,
  onContinue,
  features,
  gradientTheme = 'from-emerald-700 to-emerald-900',
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left group ${
        isSelected
          ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/90 to-white shadow-lg shadow-emerald-950/10 ring-2 ring-emerald-500/20 scale-[1.01]'
          : 'border-stone-200/80 bg-white hover:border-emerald-500/50 hover:bg-stone-50/60 shadow-xs'
      }`}
    >
      {/* Top row: Icon + Role Badge */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isSelected
                ? `bg-gradient-to-br ${gradientTheme} text-white shadow-md shadow-emerald-900/20`
                : 'bg-stone-100 text-stone-700 group-hover:bg-emerald-100 group-hover:text-emerald-800'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isSelected
                  ? 'bg-emerald-800 text-amber-300'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {badge}
            </span>
            {isSelected && (
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>
        </div>

        {/* Title and description */}
        <h4 className="text-base sm:text-lg font-bold text-stone-900 mb-1 group-hover:text-emerald-950 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {description}
        </p>

        {/* Feature bullets */}
        <ul className="space-y-1.5 pt-3 border-t border-stone-100 mb-4">
          {features.map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Continue Button for this card */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          if (onContinue) onContinue();
        }}
        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isSelected
            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
            : 'bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700'
        }`}
      >
        <span>Select {roleName}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
