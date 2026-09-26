import React from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  Activity,
  ShieldAlert,
  Leaf,
  Coins,
  Cpu,
  ArrowRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { MapProblemItem } from '../../data/mapData';

interface AIAnalysisModalProps {
  problem: MapProblemItem | null;
  isOpen: boolean;
  onClose: () => void;
  onFindMatch?: (problem: MapProblemItem) => void;
}

export const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({
  problem,
  isOpen,
  onClose,
  onFindMatch,
}) => {
  if (!isOpen || !problem) return null;

  const ai = problem.aiClassification;

  const metrics = [
    {
      label: 'Immediate Urgency',
      score: ai.urgency,
      icon: Activity,
      color: 'rose',
      desc: 'Speed of degradation without active engineering intervention',
    },
    {
      label: 'Public Health Threat',
      score: ai.healthImpact,
      icon: ShieldAlert,
      color: 'amber',
      desc: 'Pathogen, toxic contaminant or direct physical hazard exposure',
    },
    {
      label: 'Ecological Impact',
      score: ai.environmentalImpact,
      icon: Leaf,
      color: 'emerald',
      desc: 'Aquifer drawdown, soil salinity, wildlife or forestry disruption',
    },
    {
      label: 'Economic Severity',
      score: ai.economicImpact,
      icon: Coins,
      color: 'blue',
      desc: 'Loss of agrarian livelihood, municipal infrastructure damage',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 mt-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
                  AI Matrix Deep Triage
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-400/30">
                  Confidence {ai.confidence}%
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1 text-white line-clamp-1">
                {problem.name}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                {problem.locationName} • {problem.district}, {problem.state}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* AI Reasoning Callout */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Gemini AI Synthesis & Diagnostic Reasoning</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
              "{ai.reasoning}"
            </p>
          </div>

          {/* 4-Vector Impact Scores */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Multi-Vector Impact Analysis
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {metrics.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-stone-600" />
                        <span className="text-xs font-bold text-stone-800">
                          {m.label}
                        </span>
                      </div>
                      <span className="text-sm font-extrabold font-mono text-stone-900">
                        {m.score}/100
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-stone-500">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Detected Terms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Detected Semantic Entities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {ai.keyTerms.map((term, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
                >
                  #{term}
                </span>
              ))}
            </div>
          </div>

          {/* Proposed Solution Architecture Blueprint */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white">
            <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Recommended Engineering Architecture</span>
            </div>
            <ul className="text-xs space-y-1.5 text-stone-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Sensor Layer: ESP32 + LoRaWAN telemetry with solar LiFePO4 battery pack</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Purification / Action Layer: Terracotta ceramic filtration & automated valving</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Cloud & Citizen Layer: Real-time SMS alerts in local Hindi/Santhali dialect</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            Priority Score: <span className="font-bold text-rose-600">{problem.priorityScore}/100</span> ({problem.priority})
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200/70 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onFindMatch?.(problem);
              }}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Find University Match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
