import React, { useState } from 'react';
import {
  Users,
  Cpu,
  GraduationCap,
  Users2,
  Rocket,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const HowItWorksJourney: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Report',
      actor: 'CITIZEN',
      icon: Users,
      summary: 'A citizen shares a problem with location and evidence.',
      detail: 'Villagers and urban residents submit broken handpumps, acidic ponds, or clinic outages with geotagged photo proof and estimated affected households in under 60 seconds.',
    },
    {
      num: '02',
      title: 'Understand',
      actor: 'AI ENGINE',
      icon: Cpu,
      summary: 'AI identifies the domain, severity and context.',
      detail: 'Gemini evaluates multi-vector priority scores (0-100), tags keywords, identifies duplicate clusters, and calculates population risk severity.',
    },
    {
      num: '03',
      title: 'Match',
      actor: 'ALGORITHMS',
      icon: GraduationCap,
      summary: 'The platform finds the right university, experts and industry partners.',
      detail: 'Matches problems with specialized university research labs (e.g. BIT Mesra Hydro-Sensors, IIT ISM Bio-Purification) and CSR corporate backers.',
    },
    {
      num: '04',
      title: 'Build',
      actor: 'FACULTY & STUDENTS',
      icon: Users2,
      summary: 'Students and faculty form a multidisciplinary team.',
      detail: 'Cross-domain engineering teams (IoT, Embedded Hardware, Web Telemetry, Agriscience) collaborate with faculty guidance for state academic credits.',
    },
    {
      num: '05',
      title: 'Deploy',
      actor: 'INDUSTRY & STARTUPS',
      icon: Rocket,
      summary: 'Industry enables prototyping, testing and implementation.',
      detail: 'Industry partners like Tata Steel CSR and local hardware incubators sponsor testing kits, solar hardware, and on-ground Panchayat installation.',
    },
    {
      num: '06',
      title: 'Measure',
      actor: 'GOVERNMENT AUDIT',
      icon: Award,
      summary: 'Government tracks outcomes and social impact.',
      detail: 'District magistrates and state departments monitor verified water uptime, sensor health, and citizen benefit telemetry on live dashboards.',
    },
  ];

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 04 • How Civic2Campus Works
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            From a report to a <br />
            <span className="font-bold italic text-blue-600">real-world solution.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            A seamless horizontal journey that converts grassroots community needs into verified deployed innovations.
          </p>
        </div>

        {/* Horizontal Step Cards with Accessible Semantic H3 Headings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                aria-pressed={isActive}
                className={`p-5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-[1.02] z-10'
                    : 'bg-[#F9F8F6] hover:bg-[#F0EFED] border-stone-200/80 text-stone-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-light tracking-tight ${isActive ? 'text-blue-400' : 'text-stone-400'}`}>
                      {step.num}
                    </span>
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-stone-500'}`} />
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-stone-300' : 'text-blue-600'}`}>
                    {step.actor}
                  </div>
                  {/* Semantic H3 maintaining Document Heading Hierarchy (H2 -> H3) */}
                  <h3 className={`text-base font-bold tracking-tight ${isActive ? 'text-white' : 'text-stone-900'}`}>
                    {step.title}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/40 text-xs leading-relaxed">
                  <p className={isActive ? 'text-stone-300' : 'text-stone-600'}>
                    {step.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown Banner with Unified Stage Navigation */}
        <div className="bg-[#F0EFED] rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Deep Dive: Stage {steps[activeStep].num} of 06 — {steps[activeStep].title}</span>
            </div>
            <h4 className="text-xl font-bold text-stone-900 tracking-tight">
              {steps[activeStep].summary}
            </h4>
            <p className="text-sm text-stone-600 font-normal mt-2 leading-relaxed">
              {steps[activeStep].detail}
            </p>
          </div>

          {/* Connected Stage Navigation Group */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 transition-colors cursor-pointer shadow-2xs"
                aria-label="Go to previous stage"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Stage</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-all cursor-pointer"
                aria-label="Go to next stage"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
