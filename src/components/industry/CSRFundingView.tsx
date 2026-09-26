import React, { useState, useEffect } from 'react';
import {
  Coins,
  Search,
  Filter,
  PlusCircle,
  FolderGit2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  AlertCircle,
  X,
  FileText,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CSRFundingItem, CSRSummaryMetrics, CSRStatus, CSRSupportType } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface CSRFundingViewProps {
  onSelectFunding: (id: string) => void;
}

export const CSRFundingView: React.FC<CSRFundingViewProps> = ({ onSelectFunding }) => {
  const [summary, setSummary] = useState<CSRSummaryMetrics | null>(null);
  const [fundings, setFundings] = useState<CSRFundingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supportFilter, setSupportFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newFunding, setNewFunding] = useState({
    project_name: '',
    problem_name: '',
    university_name: 'Birla Institute of Technology, Mesra',
    amount: 350000,
    support_type: 'CSR' as CSRSupportType,
    purpose: '',
    funding_date: new Date().toISOString().split('T')[0],
    notes: '',
    people_benefited: 1500,
    area_covered: 'Ranchi, Jharkhand',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, listRes] = await Promise.all([
        industryService.getCSRSummary(),
        industryService.listCSRFundings({
          status: statusFilter,
          support_type: supportFilter,
          search: search || undefined
        })
      ]);
      setSummary(sumRes);
      setFundings(listRes.items || []);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load CSR funding data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, supportFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateFunding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await industryService.createCSRFunding({
        ...newFunding,
        status: 'COMMITTED',
        amount_released: 0,
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert('Failed to pledge CSR grant. Please check backend server.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st: CSRStatus) => {
    switch (st) {
      case 'COMMITTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">COMMITTED</span>;
      case 'RELEASED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">RELEASED</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">COMPLETED</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">APPROVED</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-300">PENDING</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">{st}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700">{st}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">CSR Funding & Grants Command</h2>
              <p className="text-xs text-stone-500">Manage corporate 80G CSR capital commitments, grant disbursements, and impact milestones</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add CSR Support</span>
        </button>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total CSR Commitment</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">
            ₹{((summary?.total_csr_commitment || 1270000) / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-stone-500 font-semibold mt-1">
            Across {summary?.projects_funded || 4} Co-Funded Projects
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Amount Released</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">
            ₹{((summary?.amount_released || 850000) / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Tranches Verified & Disbursed
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Amount Remaining</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900">
            ₹{((summary?.amount_remaining || 420000) / 100000).toFixed(1)} L
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Milestone Contingent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizens Benefited</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-950">
            {(summary?.people_benefited || 5900).toLocaleString()}+
          </div>
          <div className="text-[11px] text-stone-500 font-semibold mt-1">
            {summary?.areas_covered || 5} Districts Impacted
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project, problem, university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
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
            <option value="COMMITTED">Committed</option>
            <option value="RELEASED">Released</option>
            <option value="COMPLETED">Completed</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
          </select>

          <select
            value={supportFilter}
            onChange={(e) => setSupportFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Support Types</option>
            <option value="CSR">CSR</option>
            <option value="FUNDING">Funding</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="TRAINING">Training</option>
            <option value="COMMUNITY_PROGRAM">Community Program</option>
            <option value="R&D">R&D</option>
          </select>
        </div>
      </div>

      {/* Main List Table / Cards */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading CSR funding records from MongoDB...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <p className="text-xs text-rose-800 font-bold">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : fundings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl font-bold">
            🌱
          </div>
          <h3 className="text-sm font-extrabold text-stone-900">No CSR Funding Records Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">No funding commitments match the selected filter criteria.</p>
          <button
            onClick={() => { setStatusFilter('ALL'); setSupportFilter('ALL'); setSearch(''); }}
            className="px-4 py-2 bg-stone-900 text-amber-300 text-xs font-bold rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {fundings.map((f) => (
            <div
              key={f.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-amber-400/60 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      {f.funding_id || 'CSR-GRANT'}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md uppercase">
                      {f.support_type}
                    </span>
                    {getStatusBadge(f.status)}
                    {f.problem_category && (
                      <span className="text-[10px] text-stone-400 font-semibold">• {f.problem_category}</span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 hover:text-amber-900 cursor-pointer" onClick={() => onSelectFunding(f.id)}>
                    {f.project_name}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium mt-0.5">
                    Problem: <strong className="text-stone-700">{f.problem_name}</strong>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg sm:text-xl font-black text-stone-900">
                    ₹{f.amount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold">
                    ₹{(f.amount_released || 0).toLocaleString()} Disbursed
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{f.university_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Pledged: {f.funding_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="truncate">{f.deployment_location || 'Jharkhand'}</span>
                </div>
              </div>

              {/* Progress bar of disbursement */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-stone-500">
                  <span>Funding Disbursement Ratio</span>
                  <span>{Math.round(((f.amount_released || 0) / f.amount) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.round(((f.amount_released || 0) / f.amount) * 100))}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-stone-500 font-medium">
                  Impact: <strong className="text-stone-800">{(f.impact?.people_benefited || 1200).toLocaleString()} Citizens</strong> in {f.impact?.area_covered || 'Jharkhand'}
                </div>
                <button
                  onClick={() => onSelectFunding(f.id)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add CSR Support Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Pledge New CSR Support</h3>
                  <p className="text-[11px] text-stone-500">Create a binding corporate grant allocation for an academic project</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFunding} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart IoT Groundwater Purification & Telemetry"
                  value={newFunding.project_name}
                  onChange={(e) => setNewFunding({ ...newFunding, project_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Community Problem *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arsenic Contamination in Rural Handpumps"
                  value={newFunding.problem_name}
                  onChange={(e) => setNewFunding({ ...newFunding, problem_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Partner University *</label>
                  <select
                    value={newFunding.university_name}
                    onChange={(e) => setNewFunding({ ...newFunding, university_name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="Birla Institute of Technology, Mesra">Birla Institute of Technology, Mesra</option>
                    <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad</option>
                    <option value="Birla Agricultural University">Birla Agricultural University</option>
                    <option value="National Institute of Technology, Jamshedpur">NIT Jamshedpur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Support Type *</label>
                  <select
                    value={newFunding.support_type}
                    onChange={(e) => setNewFunding({ ...newFunding, support_type: e.target.value as CSRSupportType })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="CSR">CSR (Section 135)</option>
                    <option value="FUNDING">Direct R&D Funding</option>
                    <option value="INFRASTRUCTURE">Hardware / Equipment</option>
                    <option value="TRAINING">Skill & Training</option>
                    <option value="COMMUNITY_PROGRAM">Community Program</option>
                    <option value="R&D">Joint R&D Grant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Grant Amount (₹) *</label>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    required
                    value={newFunding.amount}
                    onChange={(e) => setNewFunding({ ...newFunding, amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Funding Date</label>
                  <input
                    type="date"
                    value={newFunding.funding_date}
                    onChange={(e) => setNewFunding({ ...newFunding, funding_date: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Purpose / Scope of Support</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hardware sensor procurement, solar panels, and lab testing reagents"
                  value={newFunding.purpose}
                  onChange={(e) => setNewFunding({ ...newFunding, purpose: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Target Citizens Benefited</label>
                  <input
                    type="number"
                    value={newFunding.people_benefited}
                    onChange={(e) => setNewFunding({ ...newFunding, people_benefited: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Deployment District / Area</label>
                  <input
                    type="text"
                    value={newFunding.area_covered}
                    onChange={(e) => setNewFunding({ ...newFunding, area_covered: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
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
                  {submitting ? 'Pledging...' : 'Commit CSR Grant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
