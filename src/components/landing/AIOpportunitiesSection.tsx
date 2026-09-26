import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Droplets,
  Sprout,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIOpportunitiesSection: React.FC = () => {
  const { setCurrentView } = useApp();

  const opportunityClusters = [
    {
      domain: 'WATER INFRASTRUCTURE',
      reportsCount: '3,842 reports',
      districts: ['Gumla', 'Simdega', 'Dumka', 'Latehar'],
      insight: 'Rural water infrastructure is the highest recurring intervention opportunity across these districts.',
      potentialInnovation: 'Low-cost IoT water monitoring & automated pump cut-off network.',
      matchedInstitutions: 'BIT Mesra & IIT (ISM) Dhanbad',
      projectedImpact: '142,000 villagers with zero-downtime drinking water.',
      color: 'border-blue-500/30 bg-blue-50/40',
      tagColor: 'bg-blue-100 text-blue-800',
    },
    {
      domain: 'AGRI-IRRIGATION & STORAGE',
      reportsCount: '2,910 reports',
      districts: ['Khunti', 'Ranchi Rural', 'Hazaribagh', 'Lohardaga'],
      insight: 'Dry spells and unmonitored earthen check-dams cause up to 40% rainfed paddy crop loss.',
      potentialInnovation: 'Solar-powered smart micro-drip with low-power LoRa soil moisture telemetry.',
      matchedInstitutions: 'Birsa Agricultural University & NIT Jamshedpur',
      projectedImpact: '8,400 smallholder farmers with doubled winter harvest yield.',
      color: 'border-emerald-500/30 bg-emerald-50/40',
      tagColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      domain: 'REMOTE HEALTHCARE TELEMETRY',
      reportsCount: '1,840 reports',
      districts: ['West Singhbhum', 'Pakur', 'Sahibganj', 'Godda'],
      insight: 'Primary Health Centers lack real-time cold-chain temperature logs and diagnostic triage support.',
      potentialInnovation: 'Ruggedized battery-backed cold-chain vaccine monitor with satellite link.',
      matchedInstitutions: 'AIIMS Deoghar & RIMS Ranchi',
      projectedImpact: '320 rural sub-centers with 100% vaccine integrity audit.',
      color: 'border-rose-500/30 bg-rose-50/40',
      tagColor: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-black/5 text-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              SECTION 08 • AI INNOVATION OPPORTUNITIES
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#141414] leading-[1.05]">
            When problems repeat, <br />
            <span className="font-bold italic text-blue-600">opportunities appear.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#141414]/60 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            AI continuously aggregates isolated community grievances across multiple blocks into high-value state research opportunities and startup venture briefs.
          </p>
        </div>

        {/* Opportunity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {opportunityClusters.map((opp, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border ${opp.color} shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${opp.tagColor}`}>
                    {opp.domain}
                  </span>
                  <span className="text-xs font-bold text-[#141414] font-mono">
                    {opp.reportsCount}
                  </span>
                </div>

                <div className="text-[11px] text-[#141414]/60 mb-4">
                  Clustered across: <strong className="text-[#141414]">{opp.districts.join(', ')}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 border border-black/5 mb-5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-blue-600 mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Synthesis Insight</span>
                  </div>
                  <p className="text-xs font-serif-display italic text-[#141414] leading-relaxed">
                    "{opp.insight}"
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-[#141414]/80">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/50 block">
                      Potential Innovation
                    </span>
                    <span className="font-bold text-[#141414]">{opp.potentialInnovation}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/50 block">
                      Recommended Research Hubs
                    </span>
                    <span className="font-semibold text-blue-700">{opp.matchedInstitutions}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/50 block">
                      Projected Impact
                    </span>
                    <span className="font-bold text-emerald-700">{opp.projectedImpact}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 mt-6">
                <button
                  onClick={() => setCurrentView('match-center')}
                  className="w-full py-2.5 rounded-full bg-[#141414] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Claim Challenge As Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
