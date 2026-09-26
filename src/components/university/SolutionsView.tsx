import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Cpu,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { UniversitySolution } from '../../types/university';
import { universityService } from '../../services/universityService';
import { SolutionDetailView } from './SolutionDetailView';
import { useApp } from '../../context/AppContext';

export const SolutionsView: React.FC = () => {
  const { problems, projects } = useApp();
  const [solutions, setSolutions] = useState<UniversitySolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSolution, setSelectedSolution] = useState<UniversitySolution | null>(null);

  // Create Solution Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newProblemId, setNewProblemId] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [newCollabName, setNewCollabName] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newTeam, setNewTeam] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchSolutions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await universityService.listSolutions({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search || undefined,
      });
      setSolutions(res.items || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load solutions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSolutions();
  };

  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const selectedProb = problems.find((p) => p.id === newProblemId) || problems[0];
      const selectedProj = projects.find((pr) => pr.id === newProjectId) || projects[0];

      await universityService.createSolution({
        title: newTitle,
        description: newDesc,
        problem_id: selectedProb ? selectedProb.id : 'prob-101',
        problem_title: selectedProb ? selectedProb.title : 'Groundwater Contamination',
        project_id: selectedProj ? selectedProj.id : 'proj-101',
        project_name: selectedProj ? selectedProj.title : 'Smart IoT Water Monitoring',
        collaboration_name: newCollabName || 'Tata Steel CSR & BIT Mesra Squad',
        technology: newTech ? newTech.split(',').map((t) => t.trim()) : ['ESP32', 'LoRaWAN', 'FastAPI'],
        development_team: newTeam || 'Squad JalDoot - ECE & Environmental Dept',
        current_status: 'PROTOTYPE',
        progress: 25,
      });

      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      fetchSolutions();
    } catch (err: any) {
      alert(err.message || 'Failed to register solution');
    } finally {
      setIsCreating(false);
    }
  };

  if (selectedSolution) {
    return (
      <SolutionDetailView
        solution={selectedSolution}
        onBack={() => setSelectedSolution(null)}
        onRefresh={fetchSolutions}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DEPLOYED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'TESTING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PROTOTYPE':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>University IP & Innovation Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Solutions & IoT Prototypes Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Catalogue, test, and deploy field-ready prototypes engineered by student squads and faculty researchers for civic challenges.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchSolutions}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setNewProblemId(problems[0]?.id || '');
                setNewProjectId(projects[0]?.id || '');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Prototype</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search solutions, hardware stack, problem statement, development team..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">Lifecycle Status:</span>
          {['ALL', 'PROTOTYPE', 'TESTING', 'APPROVED', 'DEPLOYED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-700">Loading university solutions repository...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="text-sm font-bold">Failed to load solutions</div>
              <div className="text-xs text-red-600 mt-0.5">{error}</div>
            </div>
          </div>
          <button
            onClick={fetchSolutions}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && solutions.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No solutions found</h3>
          <p className="text-xs text-stone-500">
            No prototypes currently match your search. Register a new student prototype to begin tracking.
          </p>
        </div>
      )}

      {/* Solutions Cards Grid */}
      {!loading && !error && solutions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {sol.title}
                    </h3>
                    <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                      Team: {sol.development_team}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${getStatusBadge(sol.current_status)}`}>
                    {sol.current_status}
                  </span>
                </div>

                {/* Problem line */}
                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase text-stone-400">Target Problem:</div>
                  <div className="font-semibold text-stone-800 line-clamp-1">{sol.problem_title}</div>
                </div>

                {/* Tech Pills */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {sol.technology?.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-bold"
                      >
                        {t}
                      </span>
                    ))}
                    {sol.technology && sol.technology.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded text-[10px] font-bold">
                        +{sol.technology.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Readiness Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-500">Readiness Progress</span>
                    <span className="font-black text-emerald-800">{sol.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${sol.progress}%` }}
                    />
                  </div>
                </div>

                {/* Impact / Location Footer */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate max-w-[120px]">
                      {sol.deployment_location || 'Lab Testing'}
                    </span>
                  </div>
                  <div className="font-bold text-emerald-800">
                    {sol.people_benefited ? `${sol.people_benefited.toLocaleString()} Benefited` : '0 Benefited'}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedSolution(sol)}
                className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>View Solution Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTER SOLUTION MODAL */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Register Prototype / Solution</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSolution} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Solution Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Solar Telemetric Groundwater Monitoring Node"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Target Community Problem</label>
                <select
                  value={newProblemId}
                  onChange={(e) => setNewProblemId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  {problems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Related Project</label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold uppercase text-stone-500 block mb-1">Development Squad</label>
                  <input
                    type="text"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    placeholder="e.g. Squad JalDoot (ECE)"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold uppercase text-stone-500 block mb-1">Collaboration Name</label>
                  <input
                    type="text"
                    value={newCollabName}
                    onChange={(e) => setNewCollabName(e.target.value)}
                    placeholder="e.g. Tata Steel CSR"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">
                  Technologies (comma separated)
                </label>
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="ESP32, LoRaWAN, Solar PV, Python, MQTT"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Description & Scope</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Hardware specifications, power consumption, sensor sensitivity..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isCreating ? 'Saving...' : 'Register Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
