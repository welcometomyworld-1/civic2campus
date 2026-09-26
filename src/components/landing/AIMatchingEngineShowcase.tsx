import React, { useState } from 'react';
import {
  Users,
  Cpu,
  GraduationCap,
  Sparkles,
  Building,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIMatchingEngineShowcase: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeChallenge, setActiveChallenge] = useState(0);

  const challenges = [
    {
      title: 'Rural Water Supply & Hydro-Telemetry',
      district: 'Gumla',
      problemBrief: '120 families face drinking water breakdown due to broken borewell pumps and undetected pump motor burnouts.',
      uniMatch: 'BIT Mesra (Water Resources Lab)',
      uniScore: '94% University Match',
      uniDept: 'Civil Engineering & Embedded Systems',
      facultyMatch: 'Dr. A. Sharma (Hydrogeology & IoT Sensors)',
      facultyScore: '87% Faculty Match',
      studentsMatch: 'Team AquaSense (4 Members)',
      studentsScore: '92% Skills Synergy',
      industryMatch: 'WaterTech Innovations Ltd. & Tata Steel CSR',
      industryScore: '91% Industry Match',
      resources: 'Hardware Kits, LoRaWAN Gateways, ₹2.5L Prototype Grant',
    },
    {
      title: 'Constructed Wetland Bio-Remediation',
      district: 'Dhanbad',
      problemBrief: 'Acid mine drainage contaminating community ponds with pH 4.2 acidity and iron sludge runoff.',
      uniMatch: 'IIT (ISM) Dhanbad (Mining & Env Lab)',
      uniScore: '97% University Match',
      uniDept: 'Environmental Science & Chemical Engineering',
      facultyMatch: 'Prof. R. Banerjee (Acid Mine Remediation)',
      facultyScore: '95% Faculty Match',
      studentsMatch: 'BioMine Innovators (5 Members)',
      studentsScore: '94% Skills Synergy',
      industryMatch: 'Tata Steel Foundation (CSR)',
      industryScore: '95% Industry Match',
      resources: 'Pilot Lagoon Testing, pH Telemetry, ₹5L Field Grant',
    },
  ];

  const current = challenges[activeChallenge];

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-stone-200/80 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Section 06 • The AI Matching Engine
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.05]">
            The right problem <br />
            <span className="font-bold italic text-blue-600">deserves the right people.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Multi-tier algorithmic compatibility maps grassroots requirements directly to researcher expertise, student skillsets, and corporate CSR funding.
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveChallenge(0)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeChallenge === 0
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Case 1: Gumla Water
            </button>
            <button
              onClick={() => setActiveChallenge(1)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeChallenge === 1
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Case 2: Dhanbad Mine Slurry
            </button>
          </div>
        </div>

        {/* 3-Column Visual Matching Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
          
          {/* Left Column: Community Challenge */}
          <div className="lg:col-span-4 bg-[#F9F8F6] p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Community Challenge
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white text-stone-800 border border-stone-200 font-mono text-xs font-bold">
                  {current.district}, JH
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-3">
                {current.title}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed font-normal mb-6">
                {current.problemBrief}
              </p>

              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-500 uppercase">Urgency:</span>
                  <span className="text-rose-600 font-mono font-bold">91/100 (CRITICAL)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-stone-500 uppercase">Telemetry:</span>
                  <span className="text-emerald-700 font-bold">Verified Geotag</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200/80 mt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                Matching Pipeline
              </span>
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Broadcasting to 42 Universities
              </span>
            </div>
          </div>

          {/* Center Column: AI MATCH ENGINE */}
          <div className="lg:col-span-4 bg-stone-900 text-white p-6 sm:p-8 rounded-2xl border border-stone-800 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  AI Match Engine
                </span>
              </div>

              <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                Vector Similarity & Domain Scoring
              </h3>

              <p className="text-xs text-stone-300 font-normal leading-relaxed mb-6">
                Algorithms analyze university patent registries, faculty publications, student repositories, and corporate CSR domains to calculate verified compatibility.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-blue-300">University Match</span>
                    <span className="text-white">{current.uniScore}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-purple-300">Industry Match</span>
                    <span className="text-white">{current.industryScore}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[91%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-emerald-300">Faculty Direction</span>
                    <span className="text-white">{current.facultyScore}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 text-center">
              <span className="text-xs font-mono text-stone-400">
                MATCH TIME: 0.76 SECONDS
              </span>
            </div>
          </div>

          {/* Right Column: Matched Ecosystem (University + Faculty + Industry) */}
          <div className="lg:col-span-4 bg-[#F9F8F6] p-6 sm:p-8 rounded-2xl border border-stone-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Matched Response Team
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  HIGH SYNERGY
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* University */}
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{current.uniScore}</span>
                  </div>
                  <div className="font-bold text-stone-900">{current.uniMatch}</div>
                  <div className="text-xs text-stone-500">{current.uniDept}</div>
                </div>

                {/* Faculty & Students */}
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{current.facultyScore}</span>
                  </div>
                  <div className="font-bold text-stone-900">{current.facultyMatch}</div>
                  <div className="text-xs text-stone-500">{current.studentsMatch} ({current.studentsScore})</div>
                </div>

                {/* Industry */}
                <div className="p-3.5 bg-white rounded-xl border border-stone-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase mb-1">
                    <Building className="w-4 h-4" />
                    <span>{current.industryScore}</span>
                  </div>
                  <div className="font-bold text-stone-900">{current.industryMatch}</div>
                  <div className="text-xs text-stone-500 font-medium">{current.resources}</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200/80 mt-6">
              <button
                onClick={() => setCurrentView('match-center')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Form Multidisciplinary Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
