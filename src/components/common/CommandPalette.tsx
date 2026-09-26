import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Compass, GraduationCap, Building, FolderGit2, X, ArrowRight, Sparkles } from 'lucide-react';
import { UNIVERSITIES, INDUSTRY_PARTNERS } from '../../data/mockData';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    problems,
    districts,
    projects,
    setSelectedProblem,
    setSelectedDistrict,
    setSelectedProject,
    setCurrentView,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.domain.toLowerCase().includes(query.toLowerCase()) ||
      p.district.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredDistricts = districts.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.topChallenges.some((c) => c.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  const filteredUniversities = UNIVERSITIES.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.district.toLowerCase().includes(query.toLowerCase()) ||
      u.specializations.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 3);

  const filteredProjects = projects.filter(
    (pr) =>
      pr.title.toLowerCase().includes(query.toLowerCase()) ||
      pr.domain.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 animate-in zoom-in-95">
        
        {/* Search input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-stone-100">
          <Search className="w-5 h-5 text-stone-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, districts, universities, or active projects in Jharkhand..."
            className="w-full bg-transparent border-none outline-none text-sm text-stone-900 placeholder:text-stone-400 font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Problems Section */}
          {filteredProblems.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>Civic Problems ({filteredProblems.length})</span>
              </div>
              <div className="space-y-1">
                {filteredProblems.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProblem(p);
                      setCurrentView('problems');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div className="flex-1 pr-3">
                      <div className="font-semibold text-stone-900 group-hover:text-sky-600 transition-colors truncate">
                        {p.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                        <span>{p.district}</span>
                        <span>•</span>
                        <span className="text-sky-600 font-medium">{p.domain}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">{p.id}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Districts Section */}
          {filteredDistricts.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-emerald-600" />
                <span>Districts ({filteredDistricts.length})</span>
              </div>
              <div className="space-y-1">
                {filteredDistricts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrict(d);
                      setCurrentView('map');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-emerald-600 transition-colors">
                        {d.name} District
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {d.totalProblems} Problems • {d.activeProjects} Projects • {d.citizensImpacted.toLocaleString()} Impacted
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Universities Section */}
          {filteredUniversities.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-indigo-600" />
                <span>Universities & Institutions ({filteredUniversities.length})</span>
              </div>
              <div className="space-y-1">
                {filteredUniversities.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentView('match-center');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-indigo-600 transition-colors">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {u.location} • {u.specializations.slice(0, 3).join(', ')}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Projects Section */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600 px-3 mb-1.5 flex items-center gap-1.5">
                <FolderGit2 className="w-3 h-3 text-purple-600" />
                <span>Active Innovation Projects ({filteredProjects.length})</span>
              </div>
              <div className="space-y-1">
                {filteredProjects.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => {
                      setSelectedProject(pr);
                      setCurrentView('workspace');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 transition-colors text-left group"
                  >
                    <div>
                      <div className="font-semibold text-stone-900 group-hover:text-purple-600 transition-colors">
                        {pr.title}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {pr.universityName} • Stage: {pr.currentStage} ({pr.progressPercent}%)
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProblems.length === 0 &&
            filteredDistricts.length === 0 &&
            filteredUniversities.length === 0 &&
            filteredProjects.length === 0 && (
              <div className="py-8 text-center text-stone-400">
                No matching results found for "{query}".
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">↑</kbd>
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">↓</kbd>
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-200">Enter</kbd>
          </div>
          <div>Press ESC to close</div>
        </div>
      </div>
    </div>
  );
};
