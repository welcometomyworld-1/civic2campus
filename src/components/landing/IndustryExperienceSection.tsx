import React from 'react';
import {
  Building,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Coins,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const IndustryExperienceSection: React.FC = () => {
  const { setCurrentView, setUserRole } = useApp();

  const industryPartners = [
    {
      name: 'WaterTech Innovations Ltd.',
      domain: 'Hydro-IoT & Submersible Telemetry',
      compatibility: '91% Compatibility',
      csrBudget: '₹45 Lakhs Allocated',
      contributions: [
        'Industrial grade ultrasonic water flow sensors',
        'Senior engineering mentorship & LoRaWAN gateways',
        'Field ruggedization & ISO certification support',
        'Direct pilot co-funding across 18 Panchayats',
      ],
      activeProjects: 'Gumla & Simdega Water Grid',
    },
    {
      name: 'Tata Steel Foundation (CSR)',
      domain: 'Heavy Metal & Mine Slurry Remediation',
      compatibility: '95% Compatibility',
      csrBudget: '₹1.2 Crore Allocated',
      contributions: [
        'Chemical testing equipment & mobile lab units',
        'Lagoon construction machinery and filter beds',
        'Safety gear & hazardous material handling protocols',
        'Direct procurement for verified successful treatments',
      ],
      activeProjects: 'Dhanbad Katras Pond Restoration',
    },
    {
      name: 'AgroJharkhand DeepTech',
      domain: 'Solar Micro-Drip & Soil Telemetry',
      compatibility: '94% Compatibility',
      csrBudget: '₹30 Lakhs Allocated',
      contributions: [
        'Solar DC pump kits & low-cost dripline rolls',
        'Edge AI weather station nodes',
        'Farmer training workshop sponsorships',
        'FPO cooperative marketplace integration',
      ],
      activeProjects: 'Khunti Smart Agro-Mesh',
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
              SECTION 10 • INDUSTRY EXPERIENCE
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#141414] leading-[1.05]">
            Turn expertise <br />
            <span className="font-bold italic text-blue-600">into impact.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#141414]/60 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Corporate CSR initiatives, hardware manufacturers, and tech startups sponsor vetted university prototypes with industrial equipment, field testing, and direct grant funding.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {industryPartners.map((partner, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-[#F9F8F6] border border-black/5 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                    {partner.compatibility}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#141414] tracking-tight mb-1">
                  {partner.name}
                </h3>
                <p className="text-xs text-[#141414]/60 mb-4">
                  {partner.domain}
                </p>

                <div className="p-3 bg-white rounded-2xl border border-black/5 mb-5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/50">
                    Committed CSR Pool
                  </span>
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {partner.csrBudget}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#141414]/50 block">
                    What Industry Provides:
                  </span>
                  {partner.contributions.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2 text-xs text-[#141414]/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-black/5 mt-4">
                <button
                  onClick={() => {
                    setUserRole('industry');
                    setCurrentView('workspace');
                  }}
                  className="w-full py-3 rounded-full bg-[#141414] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Collaborate on this challenge →</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
