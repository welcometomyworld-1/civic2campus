import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProblemDomain, PriorityLevel, ProblemItem } from '../types';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  AlertTriangle,
  GraduationCap,
  Building,
  Users,
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';

export const ExploreProblemsPage: React.FC = () => {
  const {
    problems,
    setSelectedProblem,
    setCurrentView,
    setIsReportModalOpen,
    districts,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedModalProblem, setSelectedModalProblem] = useState<ProblemItem | null>(null);

  const domains = [
    'ALL',
    'Water',
    'Healthcare',
    'Agriculture',
    'Education',
    'Sanitation',
    'Environment',
    'Infrastructure',
  ];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.clusterId && p.clusterId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain = selectedDomain === 'ALL' || p.domain === selectedDomain;
    const matchesPriority = selectedPriority === 'ALL' || p.priority === selectedPriority;
    const matchesDistrict = selectedDistrict === 'ALL' || p.district.toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesDomain && matchesPriority && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Statewide Civic Problems Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Explore Jharkhand Community Challenges
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            {problems.length} community challenges AI-analyzed, prioritized, and linked with university engineering departments.
          </p>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keywords, district, or cluster (#WTR-102)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-400 shadow-2xs"
            />
          </div>

          {/* District Dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:w-48 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-700 outline-none shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Districts ({districts.length})</option>
            {districts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full sm:w-40 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-700 outline-none shadow-2xs cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Priority</option>
            <option value="MEDIUM">🟡 Medium Priority</option>
          </select>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              {dom === 'ALL' ? 'All Domains' : dom}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map((problem) => {
          const isCritical = problem.priority === 'CRITICAL';
          const isHigh = problem.priority === 'HIGH';

          return (
            <div
              key={problem.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-stone-300"
            >
              <div>
                {/* Image Header with Priority Badge */}
                <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={problem.imageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80'}
                    alt={problem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Priority Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md text-[11px] font-bold text-white shadow-xs"
                    style={{
                      backgroundColor: isCritical ? 'rgba(225, 29, 72, 0.9)' : isHigh ? 'rgba(234, 88, 12, 0.9)' : 'rgba(202, 138, 4, 0.9)',
                    }}
                  >
                    <span>{problem.priority} ({problem.priorityScore}/100)</span>
                  </div>

                  {/* District Pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{problem.district}{problem.block ? `, ${problem.block}` : ''}</span>
                  </div>

                  {/* Domain Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[10px] font-bold text-stone-900 border border-stone-200/80">
                    {problem.domain}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {problem.id}
                    </span>
                    {problem.clusterId && (
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        Cluster #{problem.clusterId} ({problem.clusterCount || 43} reports)
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
                    {problem.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-2 font-medium leading-relaxed">
                    {problem.description}
                  </p>

                  {/* Matched Institution Preview */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                        AI Matched Lab:
                      </span>
                      <span className="font-bold text-stone-900 text-[11px] truncate max-w-[140px]">
                        {problem.matchedUniversityName || 'BIT Mesra'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        Citizens Affected:
                      </span>
                      <span className="font-bold text-stone-900 text-[11px]">
                        ~{(problem.clusterAffectedCitizens || problem.affectedPopulation).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedModalProblem(problem)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  Inspect AI Details
                </button>

                <button
                  onClick={() => {
                    setSelectedProblem(problem);
                    setCurrentView('match-center');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-all"
                >
                  <span>AI Match Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProblems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-stone-900">No matching civic challenges</h3>
          <p className="text-xs text-stone-500 mt-1">Try clearing your filters or search keywords.</p>
        </div>
      )}

      {/* Deep Dive Inspect Modal */}
      {selectedModalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-stone-900">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {selectedModalProblem.id}
                </span>
                <span className="ml-2 text-xs font-bold text-sky-700">
                  {selectedModalProblem.domain} • {selectedModalProblem.district}
                </span>
              </div>
              <button
                onClick={() => setSelectedModalProblem(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {selectedModalProblem.title}
            </h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed mb-6">
              {selectedModalProblem.description}
            </p>

            {/* AI Vector Breakdown */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>AI Severity Analysis (Priority: {selectedModalProblem.priority} - {selectedModalProblem.priorityScore}/100)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-stone-600">
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] text-stone-400">Urgency:</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">92 / 100</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] text-stone-400">Health Impact:</div>
                  <div className="font-bold text-rose-600 text-sm mt-0.5">95 / 100</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] text-stone-400">Affected Pop.:</div>
                  <div className="font-bold text-stone-900 text-sm mt-0.5">~{selectedModalProblem.affectedPopulation} Citizens</div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/80">
                  <div className="text-[10px] text-stone-400">AI Confidence:</div>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">{selectedModalProblem.confidenceScore}%</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedModalProblem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProblem(selectedModalProblem);
                  setSelectedModalProblem(null);
                  setCurrentView('match-center');
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-sm"
              >
                <span>Launch AI Match Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
