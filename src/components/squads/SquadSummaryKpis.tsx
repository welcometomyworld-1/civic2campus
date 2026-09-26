import React from 'react';
import { SquadSummaryKpis as SquadSummaryKpisType } from '../../types/squad';
import {
  Users,
  CheckCircle2,
  FolderGit2,
  Compass,
  Award,
  Zap,
  Layers,
} from 'lucide-react';

interface SquadSummaryKpisProps {
  summary: SquadSummaryKpisType;
}

export const SquadSummaryKpis: React.FC<SquadSummaryKpisProps> = ({ summary }) => {
  const cards = [
    {
      label: 'Total Squads',
      value: `${summary.total_squads} Squads`,
      subtitle: 'Multi-dept Capstones',
      icon: Layers,
      color: 'text-stone-900',
      bg: 'bg-stone-50 border-stone-200',
      iconBg: 'bg-stone-200 text-stone-700',
    },
    {
      label: 'Active Squads',
      value: `${summary.active_squads} Active`,
      subtitle: 'Currently in Engineering',
      icon: Zap,
      color: 'text-emerald-900',
      bg: 'bg-emerald-50/50 border-emerald-200',
      iconBg: 'bg-emerald-200 text-emerald-800',
    },
    {
      label: 'Completed Squads',
      value: `${summary.completed_squads} Deployed`,
      subtitle: 'Field-Ready Solutions',
      icon: CheckCircle2,
      color: 'text-blue-900',
      bg: 'bg-blue-50/50 border-blue-200',
      iconBg: 'bg-blue-200 text-blue-800',
    },
    {
      label: 'Students Participating',
      value: `${summary.students_participating} Engineers`,
      subtitle: 'Enrolled across R&D teams',
      icon: Users,
      color: 'text-indigo-900',
      bg: 'bg-indigo-50/50 border-indigo-200',
      iconBg: 'bg-indigo-200 text-indigo-800',
    },
    {
      label: 'Projects in Progress',
      value: `${summary.projects_in_progress} Projects`,
      subtitle: 'AI-matched Civic Challenges',
      icon: FolderGit2,
      color: 'text-amber-900',
      bg: 'bg-amber-50/50 border-amber-200',
      iconBg: 'bg-amber-200 text-amber-800',
    },
    {
      label: 'Field Trials',
      value: `${summary.field_trials} Trials`,
      subtitle: 'Live Ground Validations',
      icon: Compass,
      color: 'text-purple-900',
      bg: 'bg-purple-50/50 border-purple-200',
      iconBg: 'bg-purple-200 text-purple-800',
    },
    {
      label: 'Solutions Developed',
      value: `${summary.solutions_developed} Solutions`,
      subtitle: 'Accredited Hardware & IoT',
      icon: Award,
      color: 'text-teal-900',
      bg: 'bg-teal-50/50 border-teal-200',
      iconBg: 'bg-teal-200 text-teal-800',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border ${card.bg} transition-all hover:shadow-xs flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 line-clamp-1">
                {card.label}
              </span>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className={`text-base sm:text-lg font-black tracking-tight ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[10px] text-stone-500 font-medium truncate mt-0.5">
                {card.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
