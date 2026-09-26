import React, { useState } from 'react';
import {
  Users,
  Cpu,
  GraduationCap,
  Sparkles,
  Building,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BigIdeaNetworkSection: React.FC = () => {
  const { setCurrentView, openReportProblemSafely } = useApp();
  const [selectedNode, setSelectedNode] = useState<string>('ai');

  const nodes = [
    {
      id: 'community',
      label: 'COMMUNITY PROBLEM',
      role: 'Grassroots Origin',
      desc: 'Villagers & citizens identify real water, health, farm, and infrastructure breakdowns with on-ground proof.',
      icon: Users,
      badge: 'Signal Source',
      highlight: '640+ Citizens directly impacted in Gumla cluster',
      pos: 'center',
    },
    {
      id: 'ai',
      label: 'AI Engine',
      role: 'Semantic Brain',
      desc: 'Extracts domain vectors, assesses severity scores (0-100), eliminates duplicates, and clusters hotspots.',
      icon: Cpu,
      badge: 'Gemini 2.5',
      highlight: 'Vector matching latency < 0.8s',
      pos: 'top',
    },
    {
      id: 'university',
      label: 'University Labs',
      role: 'R&D Knowledge',
      desc: '42 premier institutions (BIT Mesra, IIT ISM Dhanbad, BAU) provide lab equipment and patent backing.',
      icon: GraduationCap,
      badge: '42 Universities',
      highlight: '186 specialized research departments',
      pos: 'top-right',
    },
    {
      id: 'faculty',
      label: 'Faculty Mentors',
      role: 'Technical Direction',
      desc: '1,248 professors and PhD mentors validate engineering rigor and guide prototyping architectures.',
      icon: Sparkles,
      badge: '1,248 Mentors',
      highlight: 'State academic credit accreditation',
      pos: 'right',
    },
    {
      id: 'students',
      label: 'Student Teams',
      role: 'Prototyping Force',
      desc: '3,820 student engineers across hardware, IoT, web, and field ops build working field prototypes.',
      icon: Users,
      badge: '412 Teams',
      highlight: 'Hands-on experiential civic engineering',
      pos: 'bottom-right',
    },
    {
      id: 'startup',
      label: 'DeepTech Startups',
      role: 'Agile Acceleration',
      desc: 'Jharkhand incubation startups provide rapid 3D printing, sensor manufacturing, and cloud pipelines.',
      icon: Rocket,
      badge: '58 Startups',
      highlight: 'Fast-track productization & telemetry',
      pos: 'bottom-left',
    },
    {
      id: 'industry',
      label: 'Industry & CSR',
      role: 'Resources & Kit',
      desc: 'Tata Steel CSR, Coal India, and Tech innovators fund hardware kits, solar units, and field pilots.',
      icon: Building,
      badge: '₹18.4 Cr CSR',
      highlight: 'Industrial grade testing & scaling',
      pos: 'left',
    },
    {
      id: 'government',
      label: 'State Government',
      role: 'Scale & Policy',
      desc: 'District collectors and state ministries adopt validated prototypes for statewide municipal deployment.',
      icon: ShieldCheck,
      badge: '24 Districts',
      highlight: 'Policy integration & statewide procurement',
      pos: 'top-left',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[1];

  return (
    <section className="py-24 sm:py-32 bg-white border-b border-black/5 text-[#141414] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Large Headline */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              SECTION 03 • THE BIG IDEA
            </span>
            <span className="h-px w-8 bg-blue-600 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#141414] leading-[1.05]">
            One problem. <br />
            <span className="font-bold italic text-blue-600">Many people who can solve it.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#141414]/60 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            Click any node in the collective intelligence network to see how grassroots issues connect seamlessly with universities, industry, and government.
          </p>
        </div>

        {/* Circular Animated Network Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Left/Center Visual Canvas with Circular Nodes */}
          <div className="lg:col-span-7 bg-[#F9F8F6] p-8 sm:p-12 rounded-3xl border border-black/5 relative overflow-hidden flex items-center justify-center min-h-[460px]">
            
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-editorial-dots opacity-40 pointer-events-none"></div>

            {/* Central Hub: COMMUNITY PROBLEM */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                onClick={() => setSelectedNode('community')}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 transition-all flex flex-col items-center justify-center text-center p-2 shadow-xl cursor-pointer ${
                  selectedNode === 'community'
                    ? 'bg-[#141414] text-white border-blue-500 scale-105'
                    : 'bg-white text-[#141414] border-black/10 hover:border-blue-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mb-1"></span>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-tight">
                  COMMUNITY<br />PROBLEM
                </span>
                <span className="text-[8px] opacity-60 mt-1 font-mono">Gumla #102</span>
              </button>
            </div>

            {/* Orbiting Circular Nodes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] rounded-full border border-dashed border-black/10"></div>
            </div>

            {/* Nodes Grid representation around center for clean mobile & desktop interaction */}
            <div className="absolute inset-0 p-4 flex flex-wrap items-center justify-between pointer-events-none">
              {nodes
                .filter((n) => n.id !== 'community')
                .map((n, idx) => {
                  const Icon = n.icon;
                  const isSelected = selectedNode === n.id;

                  return (
                    <button
                      key={n.id}
                      onClick={() => setSelectedNode(n.id)}
                      className={`pointer-events-auto p-2 sm:p-3 rounded-full border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-700 scale-110 shadow-lg shadow-blue-500/30 z-20'
                          : 'bg-white/90 backdrop-blur-xs text-[#141414] border-black/10 hover:bg-white hover:scale-105 z-10'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#141414]'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider pr-1 hidden sm:inline">
                        {n.label}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Right: Active Node Detail Inspection Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-black/5 shadow-xl flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">
                    {activeNodeData.role}
                  </span>
                  <h3 className="text-2xl font-bold text-[#141414] tracking-tight mt-0.5">
                    {activeNodeData.label}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-black/5 text-[#141414] text-[10px] font-bold rounded-full">
                  {activeNodeData.badge}
                </span>
              </div>

              <p className="text-sm text-[#141414]/70 leading-relaxed font-normal mb-6">
                {activeNodeData.desc}
              </p>

              <div className="p-4 rounded-2xl bg-[#F9F8F6] border border-black/5 mb-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#141414]/40 block mb-1">
                  Key Metric / Telemetry
                </span>
                <span className="text-sm font-bold text-[#141414] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {activeNodeData.highlight}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-black/5">
              <button
                onClick={() => setCurrentView('match-center')}
                className="w-full py-3 rounded-full bg-[#141414] text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Matching Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={openReportProblemSafely}
                className="w-full py-2.5 rounded-full bg-white text-[#141414] border border-black/10 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all cursor-pointer"
              >
                Report New Challenge
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
