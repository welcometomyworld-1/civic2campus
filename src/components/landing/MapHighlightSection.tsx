import React, { useState } from 'react';
import { Jharkhand3DMap } from '../../3d/Jharkhand3DMap';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Layers,
  Activity,
  GraduationCap,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
} from 'lucide-react';

export const MapHighlightSection: React.FC = () => {
  const { setCurrentView, setSelectedDistrict, selectedDistrict, districts } = useApp();

  const [activeLayer, setActiveLayer] = useState<'all' | 'problems' | 'universities' | 'industry' | 'projects' | 'impact'>('all');

  const activeDistrictData = selectedDistrict || districts.find((d) => d.name === 'Gumla') || districts[0];

  return (
    <section className="py-24 sm:py-32 bg-[#141414] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-blue-900/20 via-sky-900/10 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-blue-400 inline-block"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Section 07 • 3D Innovation Map
            </span>
            <span className="h-px w-8 bg-blue-400 inline-block"></span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.05]">
            See what Jharkhand needs. <br />
            <span className="font-bold italic text-blue-400">In real time.</span>
          </h2>

          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto mt-4 font-normal leading-relaxed">
            "Every report becomes a signal. Every signal reveals a pattern."
          </p>

          {/* Interactive Layer Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setActiveLayer('problems')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'problems'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              Problems
            </button>
            <button
              onClick={() => setActiveLayer('universities')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'universities'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              Universities
            </button>
            <button
              onClick={() => setActiveLayer('industry')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'industry'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              Industry
            </button>
            <button
              onClick={() => setActiveLayer('projects')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'projects'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveLayer('impact')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeLayer === 'impact'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white/10 text-stone-300 hover:bg-white/20'
              }`}
            >
              Impact
            </button>
          </div>
        </div>

        {/* 3D Map Viewport Frame + Floating Glass Inspector */}
        <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-stone-950">
          
          {/* Real Three.js Canvas */}
          <Jharkhand3DMap
            isHeroMode={false}
            onSelectDistrict={(dist) => setSelectedDistrict(dist)}
          />

          {/* Floating Glass District Intelligence Drawer */}
          <div className="absolute top-6 left-6 max-w-xs sm:max-w-sm w-full bg-stone-900/85 backdrop-blur-xl border border-white/15 p-5 sm:p-6 rounded-2xl shadow-2xl z-20 pointer-events-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  District Intelligence
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {activeDistrictData.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold rounded-full">
                {activeDistrictData.urgencyScore > 85 ? 'HIGH HOTSPOT' : 'ACTIVE'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-stone-400 uppercase font-semibold">Problem Count</span>
                <div className="text-xl font-bold text-white mt-1">{activeDistrictData.problemCount}</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-stone-400 uppercase font-semibold">Critical Issues</span>
                <div className="text-xl font-bold text-rose-400 mt-1">{activeDistrictData.criticalCount}</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-stone-400 uppercase font-semibold">Active Projects</span>
                <div className="text-xl font-bold text-blue-400 mt-1">{activeDistrictData.activeProjects}</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs text-stone-400 uppercase font-semibold">Universities</span>
                <div className="text-xl font-bold text-indigo-400 mt-1">{activeDistrictData.universitiesInvolved}</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-300 mt-4 flex items-center justify-between">
              <span className="text-xs font-semibold">Citizens Impacted:</span>
              <span className="font-bold font-mono">{activeDistrictData.citizensImpacted.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setCurrentView('map')}
              className="w-full mt-4 py-2.5 bg-white text-stone-900 hover:bg-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Open Dedicated 3D Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Subtle Bottom Map Legend */}
          <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-4 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-stone-300 z-20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Problem Hotspots</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>University Nodes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Industry Partners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Deployed Pilots</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
