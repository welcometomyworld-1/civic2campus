import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Jharkhand3DMap } from '../../3d/Jharkhand3DMap';
import { CivicNetwork3D } from '../../3d/CivicNetwork3D';
import {
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    setCurrentView,
    openReportProblemSafely,
    setSelectedDistrict,
    districts,
    isLoggedIn,
  } = useApp();

  const [active3DTab, setActive3DTab] = useState<'map' | 'network'>('map');

  return (
    <section className="relative w-full border-b border-stone-200/80 bg-[#F9F8F6] text-stone-900 overflow-hidden">
      
      {/* Main Grid: Left Cinematic Hero Narrative + Right 3D Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px] border-b border-stone-200/80">
        
        {/* Left Side: Editorial Typography & Actions */}
        <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-r border-stone-200/80 bg-white/70 backdrop-blur-xs relative z-10">
          <div>
            {/* Eyebrow */}
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-blue-600 inline-block"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Jharkhand • Civic Innovation Network
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight mb-6 text-stone-900">
              Every local <br />
              problem can become <br />
              <strong className="font-bold text-blue-600 italic">an innovation.</strong>
            </h1>

            {/* Below Headline Narrative */}
            <p className="text-sm sm:text-base text-stone-600 max-w-md leading-relaxed mb-8 font-normal">
              Civic2Campus connects communities with the people and institutions capable of solving what matters most.
            </p>

            {/* Primary Action Buttons (Strict Hierarchy: Primary Solid, Secondary Outline, Tertiary Pill) */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Primary Call to Action */}
              <button
                onClick={openReportProblemSafely}
                className="px-6 py-3 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-md cursor-pointer flex items-center gap-2 group"
                id="hero-report-btn"
                aria-label="Report a civic problem"
              >
                <span>Report a Problem</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Call to Action */}
              <button
                onClick={() => setCurrentView('map')}
                className="px-5 py-3 text-sm font-semibold bg-white hover:bg-stone-50 text-stone-800 rounded-xl border border-stone-300 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                id="hero-explore-map-btn"
                aria-label="Explore 3D Innovation Map"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Explore Innovation Map</span>
              </button>

              {/* Tertiary / Authentication Action */}
              {!isLoggedIn ? (
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-4 py-2.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-200 transition-all cursor-pointer flex items-center gap-1.5"
                  id="hero-signin-pill-btn"
                  aria-label="Sign in or join workspace"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sign In / Join</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('workspace')}
                  className="px-4 py-2.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
                  id="hero-workspace-btn"
                  aria-label="Navigate to workspace"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My Workspace</span>
                </button>
              )}
            </div>

            {/* Under buttons: trust indicators */}
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AI-powered • University-led • Industry-enabled • Impact-driven</span>
            </div>
          </div>

          {/* AI Priority Analysis Preview Card */}
          <div className="p-4 border border-stone-200 rounded-2xl bg-white shadow-xs mt-8">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Live Civic Intake
              </span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-md">
                CRITICAL 91/100
              </span>
            </div>
            <p className="text-xs font-medium italic mb-2 text-stone-700">
              "Rural handpump failure in Toto Block, Gumla affecting 120 families (640 citizens)..."
            </p>
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full w-[91%] bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Stylized Interactive 3D Representation of Jharkhand */}
        <div className="lg:col-span-7 bg-[#F0EFED] relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          
          {/* Subtle Dot Matrix Pattern */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-editorial-dots" />

          {/* Top 3D Mode Switcher Bar with Segmented Control Affordance */}
          <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-3">
            <div className="inline-flex items-center p-1 rounded-full bg-stone-200/80 border border-stone-300 shadow-inner" role="tablist" aria-label="3D View Selector">
              <button
                role="tab"
                aria-selected={active3DTab === 'map'}
                onClick={() => setActive3DTab('map')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active3DTab === 'map'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                3D District Map
              </button>
              <button
                role="tab"
                aria-selected={active3DTab === 'network'}
                onClick={() => setActive3DTab('network')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  active3DTab === 'network'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                3D Civic Network
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-500 bg-white/80 px-3 py-1.5 rounded-full border border-stone-200 shadow-2xs">
              <span>Drag to rotate • Scroll to zoom • Click district</span>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div className="relative w-full h-[390px] sm:h-[440px] lg:h-[480px] z-10">
            {active3DTab === 'map' ? (
              <Jharkhand3DMap
                isHeroMode={true}
                onSelectDistrict={(dist) => {
                  setSelectedDistrict(dist);
                  setCurrentView('map');
                }}
              />
            ) : (
              <CivicNetwork3D />
            )}
          </div>

          {/* Floating Glass District Info HUD (e.g. GUMLA) */}
          <div className="absolute top-18 right-4 sm:right-6 hidden sm:flex flex-col gap-3 z-20 pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-xl border border-stone-200 p-4 rounded-2xl shadow-xl w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  GUMLA
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  HOTSPOT
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-end border-b border-stone-100 pb-1.5">
                  <span className="text-xs text-stone-500 uppercase font-medium">Challenges</span>
                  <span className="text-sm font-bold text-stone-900">248 challenges</span>
                </div>
                <div className="flex justify-between items-end border-b border-stone-100 pb-1.5">
                  <span className="text-xs text-stone-500 uppercase font-medium">Critical Issues</span>
                  <span className="text-sm font-bold text-rose-600">31 critical</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-stone-500 uppercase font-medium">Active Solutions</span>
                  <span className="text-sm font-bold text-emerald-700">18 active</span>
                </div>
              </div>
              <button
                onClick={() => {
                  const gumla = districts.find((d) => d.name === 'Gumla');
                  if (gumla) setSelectedDistrict(gumla);
                  setCurrentView('map');
                }}
                className="w-full mt-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Inspect District 3D →
              </button>
            </div>
          </div>

          {/* Floating Hero Statistics Integrated in 3D Atmosphere */}
          <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-white/95 via-white/70 to-transparent flex flex-wrap gap-6 items-center justify-between border-t border-stone-200/70">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900">
                  24.8K
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Community challenges
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900">
                  86
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Universities
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900">
                  42
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Industry partners
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-light tracking-tight text-stone-900">
                  1.8M
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Citizens impacted
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
