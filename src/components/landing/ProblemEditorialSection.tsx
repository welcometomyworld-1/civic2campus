import React, { useState } from 'react';
import {
  Droplets,
  HeartPulse,
  GraduationCap,
  Sprout,
  Building,
  Trees,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProblemEditorialSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  const problemSignals = [
    {
      id: 'water',
      name: 'Water',
      subtitle: 'Groundwater, handpumps & filtration',
      icon: Droplets,
      reports: '6,420 reports',
      color: 'bg-sky-50 text-blue-600 border-blue-200',
      tag: 'Critical',
    },
    {
      id: 'health',
      name: 'Healthcare',
      subtitle: 'Primary health center telemetry',
      icon: HeartPulse,
      reports: '4,110 reports',
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      tag: 'Urgent',
    },
    {
      id: 'agri',
      name: 'Agriculture',
      subtitle: 'Rainfed irrigation & storage losses',
      icon: Sprout,
      reports: '5,890 reports',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      tag: 'Seasonal',
    },
    {
      id: 'edu',
      name: 'Education',
      subtitle: 'Rural digital connectivity & STEM labs',
      icon: GraduationCap,
      reports: '2,940 reports',
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      tag: 'High Impact',
    },
    {
      id: 'infra',
      name: 'Infrastructure',
      subtitle: 'Solar microgrids & road bridges',
      icon: Building,
      reports: '3,280 reports',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      tag: 'Active',
    },
    {
      id: 'env',
      name: 'Environment',
      subtitle: 'Mine slurry & forest watershed',
      icon: Trees,
      reports: '2,180 reports',
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      tag: 'Remediation',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#F9F8F6] border-b border-black/5 text-[#141414] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Two-Column Dramatic Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Large Editorial Statement */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-blue-600 inline-block"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
                SECTION 02 • THE REALITY
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#141414] leading-[1.05]">
              Jharkhand doesn't have a <br />
              <span className="font-bold">shortage of problems.</span>
            </h2>

            <p className="text-2xl sm:text-3xl font-light italic text-[#141414]/80 leading-snug">
              It has a shortage of <span className="text-blue-600 font-bold not-italic">connected solutions.</span>
            </p>

            <div className="pt-4 border-t border-black/5 max-w-xl">
              <p className="text-base sm:text-lg text-[#141414]/70 leading-relaxed font-normal">
                Communities know what needs to change. Universities have knowledge. Students have ideas. Industry has technology and resources. Government has the ability to scale.
              </p>
              <p className="text-base sm:text-lg text-[#141414] font-bold mt-4">
                Civic2Campus connects all of them.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('problems')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all cursor-pointer shadow-xs"
              >
                <span>Explore Live Problem Hotspots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Floating Animated Problem Signals */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-black/5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/50">
                  Live Grassroots Signal Intake
                </span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  24 Districts Online
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {problemSignals.map((signal) => {
                  const Icon = signal.icon;
                  const isHovered = activeSignal === signal.id;

                  return (
                    <div
                      key={signal.id}
                      onMouseEnter={() => setActiveSignal(signal.id)}
                      onMouseLeave={() => setActiveSignal(null)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isHovered
                          ? 'bg-[#141414] text-white border-[#141414] scale-102 shadow-md'
                          : 'bg-[#F9F8F6] hover:bg-[#F0EFED] border-black/5 text-[#141414]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl border ${signal.color} ${isHovered ? 'bg-white/10 text-white border-white/20' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isHovered ? 'bg-white/20 text-white' : 'bg-black/5 text-[#141414]/60'}`}>
                          {signal.tag}
                        </span>
                      </div>
                      <div className="text-sm font-bold tracking-tight">{signal.name}</div>
                      <div className={`text-[10px] mt-0.5 ${isHovered ? 'text-stone-300' : 'text-[#141414]/60'}`}>
                        {signal.subtitle}
                      </div>
                      <div className="mt-3 pt-2 border-t border-black/5 text-[9px] font-bold uppercase tracking-widest opacity-60">
                        {signal.reports}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-xs text-blue-900 mt-4">
                <span className="font-semibold text-[11px]">AI aggregates reports into collective signals</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
