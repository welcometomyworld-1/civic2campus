import React from 'react';
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GovernmentCommandPreviewSection: React.FC = () => {
  const { navigateToDashboardTab, setCurrentView } = useApp();

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 12 • Government Command Center
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            From thousands of reports <br />
            <span className="font-bold italic text-blue-600">to one clear picture.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            District collectors and state policy leaders monitor live telemetry, cluster dynamics, budget allocation, and validated sensor uptimes in real time.
          </p>
        </div>

        {/* Mission Control Preview Card */}
        <div className="bg-[#F9F8F6] rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xl max-w-6xl mx-auto relative overflow-hidden">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                  State of Jharkhand • Civic Innovation Operations
                </h3>
                <p className="text-xs text-stone-500">
                  Planning & Development • Higher & Technical Education
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                24 Districts Synced
              </span>
            </div>
          </div>

          {/* 4 Core Telemetry Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
                Total Challenges
              </span>
              <div className="text-3xl font-light tracking-tight text-stone-900 mt-1">
                24,821
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                +318 this week
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-500 block">
                Critical Urgency
              </span>
              <div className="text-3xl font-light tracking-tight text-rose-600 mt-1">
                3,842
              </div>
              <span className="text-xs text-rose-600 font-semibold mt-0.5 block">
                Immediate Action Tier
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block">
                Active Projects
              </span>
              <div className="text-3xl font-light tracking-tight text-blue-600 mt-1">
                412
              </div>
              <span className="text-xs text-stone-500 font-semibold mt-0.5 block">
                In R&D / Prototyping
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 block">
                Citizens Impacted
              </span>
              <div className="text-3xl font-light tracking-tight text-emerald-700 mt-1">
                1.8M
              </div>
              <span className="text-xs text-emerald-700 font-semibold mt-0.5 block">
                Verified On-Ground
              </span>
            </div>
          </div>

          {/* AI Signals & Emerging Opportunities Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Automated Signal Feed</span>
              </div>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-stone-800 leading-relaxed">
                "Water infrastructure issues increased <strong>18% across four districts</strong> this quarter (Gumla, Simdega, Dumka, Latehar). High cluster density warrants district-wide pump monitoring mandate."
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Emerging Policy Opportunity</span>
              </div>
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-xs text-stone-800 leading-relaxed">
                "Healthcare access challenges are clustering around rural blocks in West Singhbhum and Pakur. Mobile telemetry cold-chain pilots show <strong>99.1% efficacy</strong>."
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-200">
            <div className="text-xs text-stone-500">
              Authorized personnel: District Collectors, Dept Secretaries, State Evaluation Units.
            </div>
            <button
              onClick={() => {
                if (navigateToDashboardTab) {
                  navigateToDashboardTab('government-dashboard', 'overview');
                } else {
                  setCurrentView('government-dashboard');
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Launch Full Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
