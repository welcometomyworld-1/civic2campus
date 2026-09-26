import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  GraduationCap,
  Cpu,
  Rocket,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProjectJourneySection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [selectedStage, setSelectedStage] = useState(3); // Default to Prototype

  const stages = [
    {
      num: '01',
      name: 'Problem',
      actor: 'CITIZEN REPORT',
      desc: 'Grassroots challenge reported from Toto village, Gumla: 120 families without clean drinking water.',
      deliverable: 'Geotagged Proof & Severity 91/100',
    },
    {
      num: '02',
      name: 'Research',
      actor: 'AI & FACULTY',
      desc: 'Gemini clusters 43 related water reports; Dr. A. Sharma at BIT Mesra validates hydrogeology specs.',
      deliverable: 'Technical Problem Architecture',
    },
    {
      num: '03',
      name: 'Team',
      actor: 'STUDENTS & MENTORS',
      desc: 'Multidisciplinary engineering squad formed: 2 hardware, 1 IoT firmware, 1 data telemetry engineer.',
      deliverable: 'Team Charter & ₹2.5L Seed Grant',
    },
    {
      num: '04',
      name: 'Prototype',
      actor: 'LAB FABRICATION',
      desc: 'Solar-powered ultrasonic water level sensor + automated pump motor protection circuit fabricated.',
      deliverable: 'Hardware Prototype v1.2',
    },
    {
      num: '05',
      name: 'Testing',
      actor: 'LAB BENCHMARKS',
      desc: 'Pump burnout simulation under power surges; sensor tested against heavy monsoonal humidity.',
      deliverable: '99.4% Accuracy Benchmark',
    },
    {
      num: '06',
      name: 'Pilot',
      actor: 'PANCHAYAT DEPLOYMENT',
      desc: 'Hardware installed on 3 community borewells in Toto village with real-time LoRa gateway.',
      deliverable: 'Zero Downtime in 90 Days',
    },
    {
      num: '07',
      name: 'Deployment',
      actor: 'INDUSTRY & GOVT',
      desc: 'WaterTech Innovations & Jal Jeevan Mission scale the sensor kit to 18 surrounding villages.',
      deliverable: 'Statewide Procurement Catalog',
    },
    {
      num: '08',
      name: 'Impact',
      actor: 'AUDITED OUTCOME',
      desc: '2,840 citizens gain reliable water access; waterborne illness drops by 84% in verified health audits.',
      deliverable: '1.8M Lifetime Benefit Metric',
    },
  ];

  const current = stages[selectedStage];

  return (
    <section className="py-24 sm:py-32 bg-[#F9F8F6] border-b border-black/5 text-[#141414]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              SECTION 11 • PROJECT JOURNEY
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#141414] leading-[1.05]">
            Ideas shouldn't <br />
            <span className="font-bold italic text-blue-600">stop at proposals.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#141414]/60 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Track every phase of an innovation from initial citizen intake to statewide public deployment.
          </p>
        </div>

        {/* 8-Stage Progress Track */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            {stages.map((stage, idx) => {
              const isSelected = selectedStage === idx;
              const isPassed = idx < selectedStage;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedStage(idx)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#141414] text-white border-[#141414] shadow-lg scale-105 z-10'
                      : isPassed
                      ? 'bg-blue-50/60 border-blue-200 text-blue-900'
                      : 'bg-white border-black/5 text-[#141414]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-mono font-bold ${isSelected ? 'text-blue-400' : isPassed ? 'text-blue-600' : 'text-[#141414]/40'}`}>
                      {stage.num}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-400 animate-ping' : 'bg-black/20'}`}></span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold tracking-tight">{stage.name}</div>
                    <div className={`text-[8px] uppercase tracking-wider mt-0.5 ${isSelected ? 'text-stone-300' : 'text-[#141414]/50'}`}>
                      {stage.actor}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Detailed Card */}
          <div className="bg-white rounded-3xl border border-black/5 p-6 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Case Study Spotlight: Stage {current.num} — {current.name}</span>
              </div>
              <h3 className="text-2xl font-bold text-[#141414] tracking-tight">
                {current.name}: {current.actor}
              </h3>
              <p className="text-sm text-[#141414]/70 mt-3 leading-relaxed font-normal">
                {current.desc}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Deliverable: {current.deliverable}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => setCurrentView('workspace')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#141414] hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Inspect Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
