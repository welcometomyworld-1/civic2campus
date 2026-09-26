import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  PlusCircle,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  X,
  Zap,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TechSupportItem, TechSupportStatus, TechSupportType } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface TechSupportViewProps {
  onSelectSupport: (id: string) => void;
}

export const TechSupportView: React.FC<TechSupportViewProps> = ({ onSelectSupport }) => {
  const [supports, setSupports] = useState<TechSupportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newSupport, setNewSupport] = useState({
    project_name: 'Smart Groundwater Desalination & Iron Filter',
    university_name: 'Birla Institute of Technology, Mesra',
    student_squad_name: 'AquaSensors Squad Alpha',
    support_type: 'AI/ML' as TechSupportType,
    technology: 'Python, Edge AI, LoRaWAN',
    description: 'Weekly firmware architecture guidance and noise filtering for low-cost optical iron sensors.',
    assigned_expert: 'Priya Sen',
    assigned_expert_title: 'Principal Sustainability Engineer',
    assigned_expert_email: 'priya.sen@tatasteel.com',
    start_date: new Date().toISOString().split('T')[0],
    target_date: '2026-11-30',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await industryService.listTechSupports({
        status: statusFilter,
        support_type: typeFilter,
        search: search || undefined
      });
      setSupports(res.items || []);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load technical support records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const techArray = newSupport.technology.split(',').map((t) => t.trim()).filter(Boolean);
      await industryService.createTechSupport({
        ...newSupport,
        technology: techArray,
        status: 'IN_PROGRESS',
        progress: 10,
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert('Failed to register technical support.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st: TechSupportStatus) => {
    switch (st) {
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">COMPLETED</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200">APPROVED</span>;
      case 'REQUESTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700 border border-stone-300">REQUESTED</span>;
      case 'BLOCKED':
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">{st}</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-stone-100 text-stone-700">{st}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">Technical Support & Mentorship Command</h2>
            <p className="text-xs text-stone-500">Corporate engineering mentorship, hardware lab access, and code architecture support for student squads</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Provide Technical Support</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project, squad, expert, tech..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Type:</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Support Types</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
            <option value="AI/ML">AI / ML</option>
            <option value="IoT">IoT</option>
            <option value="Cloud">Cloud</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Technical Mentorship">Technical Mentorship</option>
            <option value="Training">Training</option>
            <option value="R&D">R&D</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="APPROVED">Approved</option>
            <option value="REQUESTED">Requested</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">Loading technical support engagements...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
          <p className="text-xs text-rose-800 font-bold">{error}</p>
          <button onClick={loadData} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer">
            Retry
          </button>
        </div>
      ) : supports.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl font-bold">
            🔧
          </div>
          <h3 className="text-sm font-extrabold text-stone-900">No Technical Support Engagements</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">No engineering mentorship or technical support matches your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {supports.map((s) => (
            <div
              key={s.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:border-amber-400/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                      {s.support_id || 'TECH-ENGAGEMENT'}
                    </span>
                    <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                      {s.support_type}
                    </span>
                  </div>
                  {getStatusBadge(s.status)}
                </div>

                <div>
                  <h3
                    className="text-base font-extrabold text-stone-900 hover:text-amber-900 cursor-pointer"
                    onClick={() => onSelectSupport(s.id)}
                  >
                    {s.project_name}
                  </h3>
                  <div className="text-xs text-stone-500 flex items-center gap-2 mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                    <span>{s.university_name}</span>
                    <span>• Squad: <strong className="text-stone-800">{s.student_squad_name || 'Engineering Squad'}</strong></span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.technology?.map((tech, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Assigned Expert */}
                <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <div>
                      <div className="font-extrabold text-stone-900">{s.assigned_expert || 'Senior Technical Lead'}</div>
                      <div className="text-[10px] text-amber-900">{s.assigned_expert_title || 'Corporate Engineer Mentor'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-500 font-semibold">{s.start_date} to {s.target_date}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-stone-500">
                    <span>Sprint Milestone Progress</span>
                    <span>{s.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  {s.tasks?.length || 3} Tasks Assigned
                </span>
                <button
                  onClick={() => onSelectSupport(s.id)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                >
                  <span>Manage Mentorship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Provide Technical Support */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Provide Technical Support & Mentorship</h3>
                  <p className="text-[11px] text-stone-500">Assign company engineering leads and hardware labs to a student squad</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupport} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Target Project *</label>
                <input
                  type="text"
                  required
                  value={newSupport.project_name}
                  onChange={(e) => setNewSupport({ ...newSupport, project_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Partner University *</label>
                  <input
                    type="text"
                    required
                    value={newSupport.university_name}
                    onChange={(e) => setNewSupport({ ...newSupport, university_name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Student Engineering Squad</label>
                  <input
                    type="text"
                    value={newSupport.student_squad_name}
                    onChange={(e) => setNewSupport({ ...newSupport, student_squad_name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Support Category *</label>
                  <select
                    value={newSupport.support_type}
                    onChange={(e) => setNewSupport({ ...newSupport, support_type: e.target.value as TechSupportType })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  >
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="IoT">IoT & Embedded Systems</option>
                    <option value="Hardware">Hardware & Power</option>
                    <option value="Software">Software Architecture</option>
                    <option value="Cloud">Cloud Infrastructure</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Data Analytics">Data Analytics</option>
                    <option value="Technical Mentorship">Technical Mentorship</option>
                    <option value="Testing">Testing & QA</option>
                    <option value="Training">Training</option>
                    <option value="R&D">Joint R&D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={newSupport.technology}
                    onChange={(e) => setNewSupport({ ...newSupport, technology: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Assigned Expert *</label>
                  <input
                    type="text"
                    required
                    value={newSupport.assigned_expert}
                    onChange={(e) => setNewSupport({ ...newSupport, assigned_expert: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Expert Title</label>
                  <input
                    type="text"
                    value={newSupport.assigned_expert_title}
                    onChange={(e) => setNewSupport({ ...newSupport, assigned_expert_title: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Expert Email</label>
                  <input
                    type="email"
                    value={newSupport.assigned_expert_email}
                    onChange={(e) => setNewSupport({ ...newSupport, assigned_expert_email: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Technical Guidance Scope</label>
                <textarea
                  rows={2}
                  value={newSupport.description}
                  onChange={(e) => setNewSupport({ ...newSupport, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newSupport.start_date}
                    onChange={(e) => setNewSupport({ ...newSupport, start_date: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={newSupport.target_date}
                    onChange={(e) => setNewSupport({ ...newSupport, target_date: e.target.value })}
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
                  {submitting ? 'Assigning...' : 'Initiate Support'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
