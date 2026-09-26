import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  Search,
  Filter,
  PlusCircle,
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  X,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IndustrySolutionItem, IndustrySolutionStatus } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface IndustrySolutionsViewProps {
  onSelectSolution: (id: string) => void;
}

export const IndustrySolutionsView: React.FC<IndustrySolutionsViewProps> = ({ onSelectSolution }) => {
  const [solutions, setSolutions] = useState<IndustrySolutionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSolution, setNewSolution] = useState({
    solution_name: '',
    problem_name: '',
    university_name: 'Birla Institute of Technology, Mesra',
    student_squad: 'AquaSensors Squad Alpha',
    technology: 'IoT, Solar Power, Edge AI',
    status: 'PROTOTYPE' as IndustrySolutionStatus,
    deployment_location: 'Gumla District, Jharkhand',
    people_benefited: 1200,
    industry_contribution: 'Provided ₹3,50,000 grant and corporate telemetry engineering review.',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await industryService.listIndustrySolutions({
        status: statusFilter,
        search: search || undefined
      });
      setSolutions(res.items || []);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load industry solutions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const techList = newSolution.technology.split(',').map((t) => t.trim()).filter(Boolean);
      await industryService.createIndustrySolution({
        ...newSolution,
        technology: techList,
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert('Failed to register solution.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st: IndustrySolutionStatus) => {
    switch (st) {
      case 'DEPLOYED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">DEPLOYED</span>;
      case 'TESTING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">TESTING</span>;
      case 'PROTOTYPE':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">PROTOTYPE</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">APPROVED</span>;
      case 'FAILED':
      case 'ARCHIVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">{st}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700">{st}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Supported Solutions & Pilots Repository</h2>
            <p className="text-xs text-stone-500">Track field-tested hardware innovations, software telemetry, and commercialization pathways</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Register Solution / Pilot</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by solution name, problem, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DEPLOYED">Deployed</option>
            <option value="TESTING">Testing</option>
            <option value="PROTOTYPE">Prototype</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading solutions repository...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <p className="text-xs text-rose-800 font-bold">{error}</p>
          <button onClick={loadData} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer">
            Retry
          </button>
        </div>
      ) : solutions.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl font-bold">
            💡
          </div>
          <h3 className="text-sm font-extrabold text-stone-900">No Solutions Registered</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">No prototypes or co-developed solutions found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-amber-400/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {sol.problem_category || 'Water & Sanitation'}
                  </span>
                  {getStatusBadge(sol.status)}
                </div>

                <div>
                  <h3
                    className="text-base font-extrabold text-stone-900 hover:text-amber-900 cursor-pointer"
                    onClick={() => onSelectSolution(sol.id)}
                  >
                    {sol.solution_name}
                  </h3>
                  <div className="text-xs text-stone-500 mt-1">
                    Problem: <strong className="text-stone-700">{sol.problem_name}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 pt-1">
                  <div className="p-2.5 bg-stone-50 rounded-xl">
                    <div className="text-[10px] text-stone-400 font-bold uppercase">University & Squad</div>
                    <div className="font-bold text-stone-800 truncate">{sol.university_name}</div>
                    <div className="text-[10px] text-stone-500">{sol.student_squad || 'Squad Alpha'}</div>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">Beneficiaries</div>
                    <div className="font-black text-emerald-900">{(sol.people_benefited || 1200).toLocaleString()} Citizens</div>
                    <div className="text-[10px] text-emerald-700 truncate">{sol.deployment_location || 'Jharkhand'}</div>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sol.technology?.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Industry Contribution Note */}
                {sol.industry_contribution && (
                  <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-xl">
                    "{sol.industry_contribution}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  Deployed: {sol.deployment_date || 'In Testing'}
                </span>
                <button
                  onClick={() => onSelectSolution(sol.id)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                >
                  <span>View Solution Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register Solution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Register Supported Solution / Pilot</h3>
                  <p className="text-[11px] text-stone-500">Record a joint innovation co-developed with an engineering university</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSolution} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Solution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Telemetry Iron Removal Filter Unit"
                  value={newSolution.solution_name}
                  onChange={(e) => setNewSolution({ ...newSolution, solution_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Community Problem *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Iron Contamination in Village Borewells"
                  value={newSolution.problem_name}
                  onChange={(e) => setNewSolution({ ...newSolution, problem_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Partner University *</label>
                  <input
                    type="text"
                    required
                    value={newSolution.university_name}
                    onChange={(e) => setNewSolution({ ...newSolution, university_name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Student Squad</label>
                  <input
                    type="text"
                    value={newSolution.student_squad}
                    onChange={(e) => setNewSolution({ ...newSolution, student_squad: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={newSolution.technology}
                    onChange={(e) => setNewSolution({ ...newSolution, technology: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Current Status</label>
                  <select
                    value={newSolution.status}
                    onChange={(e) => setNewSolution({ ...newSolution, status: e.target.value as IndustrySolutionStatus })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="PROTOTYPE">Prototype</option>
                    <option value="TESTING">Testing / Lab Trial</option>
                    <option value="APPROVED">Approved for Deployment</option>
                    <option value="DEPLOYED">Deployed in Field</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Deployment Location</label>
                  <input
                    type="text"
                    value={newSolution.deployment_location}
                    onChange={(e) => setNewSolution({ ...newSolution, deployment_location: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Citizens Benefited</label>
                  <input
                    type="number"
                    value={newSolution.people_benefited}
                    onChange={(e) => setNewSolution({ ...newSolution, people_benefited: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Corporate / CSR Contribution</label>
                <textarea
                  rows={2}
                  value={newSolution.industry_contribution}
                  onChange={(e) => setNewSolution({ ...newSolution, industry_contribution: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs"
                >
                  {submitting ? 'Registering...' : 'Register Solution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
