import React from 'react';
import { StudentSquad } from '../../types/squad';
import {
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  ArrowRight,
  Edit3,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';

interface SquadCardProps {
  squad: StudentSquad;
  onViewDetails: (squad: StudentSquad) => void;
  onEdit: (squad: StudentSquad) => void;
}

export const SquadCard: React.FC<SquadCardProps> = ({
  squad,
  onViewDetails,
  onEdit,
}) => {
  // Extract distinct departments from members
  const memberDepts = Array.from(
    new Set(squad.members.map((m) => m.department).filter(Boolean))
  );
  const displayDepts =
    memberDepts.length > 0 ? memberDepts.join(' • ') : squad.department || 'Engineering';

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    ON_HOLD: 'bg-amber-100 text-amber-800 border-amber-300',
    COMPLETED: 'bg-blue-100 text-blue-800 border-blue-300',
    DISBANDED: 'bg-stone-100 text-stone-600 border-stone-300',
  };

  const phaseLabels: Record<string, string> = {
    PROBLEM_ANALYSIS: 'Problem Analysis',
    RESEARCH: 'Research & Literature',
    DESIGN: 'System Design',
    PROTOTYPE: 'Prototype Build',
    TESTING: 'Prototype Testing',
    FIELD_TRIAL: 'Field Trial & Pilot',
    DEPLOYMENT: 'State Deployment',
    COMPLETED: 'Completed & Certified',
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 group">
      
      {/* Top Header: ID Badge, Name & Status */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141414] text-amber-300 font-mono text-[11px] font-bold tracking-wider">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Squad ID: {squad.squad_id}</span>
          </div>
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              statusColors[squad.status] || statusColors.ACTIVE
            }`}
          >
            {squad.status}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-black text-stone-900 group-hover:text-emerald-900 transition-colors leading-snug">
            🎓 {squad.name}
          </h3>
          {squad.project_name && (
            <div className="text-xs font-bold text-blue-700 mt-0.5 flex items-center gap-1">
              <span>Project:</span>
              <span className="text-stone-800 font-semibold">{squad.project_name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Linked Community Problem Box */}
      {squad.problem_title && (
        <div className="bg-amber-50/60 rounded-2xl p-3 border border-amber-200/80 text-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase tracking-wider">
            <span>Community Problem</span>
            {squad.problem_category && (
              <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950 font-bold">
                {squad.problem_category}
              </span>
            )}
          </div>
          <p className="text-stone-800 font-medium line-clamp-2 leading-relaxed">
            {squad.problem_title}
          </p>
          {squad.ai_match_score && (
            <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 pt-1 border-t border-amber-200/60">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>AI Capability Match: {squad.ai_match_score}%</span>
            </div>
          )}
        </div>
      )}

      {/* Key Metadata Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs text-stone-700 bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Team Leader</div>
          <div className="font-bold text-stone-900 truncate">
            👑 {squad.team_leader_name || squad.members[0]?.name || 'To be assigned'}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Squad Members</div>
          <div className="font-bold text-stone-900 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>{squad.members.length} Members</span>
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Departments</div>
          <div className="font-semibold text-stone-800 truncate text-[11px]">
            {displayDepts}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Faculty Mentor</div>
          <div className="font-semibold text-stone-800 truncate text-[11px]">
            🧑‍🏫 {squad.faculty_mentor_name || 'Dr. Dept Mentor'}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Industry Partner</div>
          <div className="font-semibold text-emerald-900 truncate text-[11px]">
            🏢 {squad.industry_partner_name || 'Open for Match'}
          </div>
        </div>
      </div>

      {/* Phase & Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold text-stone-600">
            Phase: <strong className="text-stone-900">{phaseLabels[squad.current_phase] || squad.current_phase}</strong>
          </span>
          <span className="font-black text-emerald-800 text-xs">{squad.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-700 transition-all duration-500"
            style={{ width: `${squad.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(squad)}
          className="flex-1 py-2 px-3 bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onEdit(squad)}
          className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200"
          title="Edit Squad"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Squad</span>
        </button>
      </div>
    </div>
  );
};
