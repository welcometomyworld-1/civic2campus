import React from 'react';
import {
  AlertTriangle,
  GraduationCap,
  Building,
  FolderGit2,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { MarkerCategory } from '../../data/mapData';

interface MapStatisticsProps {
  counts: {
    problems: number;
    critical: number;
    universities: number;
    industry: number;
    solutions: number;
    citizensImpacted: number;
  };
  activeCategory: MarkerCategory | 'all';
  onSelectCategory: (cat: MarkerCategory | 'all') => void;
}

export const MapStatistics: React.FC<MapStatisticsProps> = ({
  counts,
  activeCategory,
  onSelectCategory,
}) => {
  const statCards = [
    {
      id: 'problem' as MarkerCategory,
      title: 'Community Problems',
      value: counts.problems,
      subValue: `${counts.critical} Critical Priority`,
      icon: AlertTriangle,
      color: 'rose',
      bgColor: 'hover:border-rose-300 hover:bg-rose-50/40',
      activeBorder: 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20',
      iconBg: 'bg-rose-100 text-rose-600',
    },
    {
      id: 'university' as MarkerCategory,
      title: 'Universities',
      value: counts.universities,
      subValue: 'Research Labs & Faculty',
      icon: GraduationCap,
      color: 'indigo',
      bgColor: 'hover:border-indigo-300 hover:bg-indigo-50/40',
      activeBorder: 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20',
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'industry' as MarkerCategory,
      title: 'Industry Partners',
      value: counts.industry,
      subValue: 'CSR & Tech Grants',
      icon: Building,
      color: 'purple',
      bgColor: 'hover:border-purple-300 hover:bg-purple-50/40',
      activeBorder: 'border-purple-500 bg-purple-50/60 ring-2 ring-purple-500/20',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'solution' as MarkerCategory,
      title: 'Solutions Deployed',
      value: counts.solutions,
      subValue: `${(counts.citizensImpacted / 1000).toFixed(1)}k Citizens Impacted`,
      icon: CheckCircle2,
      color: 'emerald',
      bgColor: 'hover:border-emerald-300 hover:bg-emerald-50/40',
      activeBorder: 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeCategory === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onSelectCategory(isActive ? 'all' : card.id)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between bg-white shadow-xs cursor-pointer group relative overflow-hidden ${
                isActive ? card.activeBorder : `border-black/10 ${card.bgColor}`
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`p-2.5 rounded-xl ${card.iconBg} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-700 flex items-center gap-0.5">
                  Filter <ArrowUpRight className="w-3 h-3 opacity-60" />
                </span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#141414] tracking-tight font-sans">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-stone-700 mt-0.5">
                  {card.title}
                </div>
                <div className="text-[11px] font-medium text-stone-500 mt-1 flex items-center gap-1">
                  <span>{card.subValue}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
