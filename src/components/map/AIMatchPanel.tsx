import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { MapProblemItem } from '../../data/mapData';

interface AIMatchPanelProps {
  problem: MapProblemItem;
  onViewUniversityMatch?: (uniId: string) => void;
  onViewIndustryMatch?: (indId: string) => void;
  onStartCollaboration?: (problem: MapProblemItem) => void;
}

export const AIMatchPanel: React.FC<AIMatchPanelProps> = ({
  problem,
  onViewUniversityMatch,
  onViewIndustryMatch,
  onStartCollaboration,
}) => {
  const matches = problem.aiRecommendedMatches;
  if (!matches) return null;

  return (
    <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-sky-50/50 to-indigo-50/40 p-4 sm:p-5 shadow-xs">
      
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#141414] tracking-tight">
              AI Recommended Matches
            </h4>
            <p className="text-[10px] text-blue-700 font-semibold">
              Gemini Civic Matrix • Autonomous Compatibility Ranking
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Prototype AI
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        
        {/* University Match Card */}
        {matches.university && (
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 border border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Top University Match
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                      {matches.university.name}
                    </h5>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold font-mono border border-indigo-200">
                    {matches.university.matchPercentage}% Match
                  </span>
                  <div className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {matches.university.distanceKm} km away
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-700 space-y-1.5 mt-2.5">
                <div>
                  <span className="font-bold text-stone-900">Expertise: </span>
                  <span className="text-stone-600">{matches.university.expertise}</span>
                </div>
                <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/60 text-stone-700 italic">
                  "{matches.university.reason}"
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onViewUniversityMatch?.(matches.university.id)}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View University</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Industry Partner Match Card */}
        {matches.industry && (
          <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 border border-purple-100 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      Top Industry Match
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                      {matches.industry.name}
                    </h5>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold font-mono border border-purple-200">
                    {matches.industry.matchPercentage}% Match
                  </span>
                  <div className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {matches.industry.distanceKm} km away
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-700 space-y-1.5 mt-2.5">
                <div>
                  <span className="font-bold text-stone-900">Support Offered: </span>
                  <span className="text-stone-600">{matches.industry.supportOffered}</span>
                </div>
                <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100/60 text-stone-700 italic">
                  "{matches.industry.reason}"
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => onViewIndustryMatch?.(matches.industry.id)}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View Company</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Primary Action Button */}
      <div className="mt-4 pt-3 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Ready to form multidisciplinary research & hardware team.</span>
        </div>
        
        <button
          onClick={() => onStartCollaboration?.(problem)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
        >
          <span>Start Collaboration</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </div>
  );
};
