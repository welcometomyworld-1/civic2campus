import React, { useState, useEffect } from 'react';
import {
  Handshake,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  ChevronRight,
  Plus
} from 'lucide-react';
import { UniversityCollaboration } from '../../types/university';
import { universityService } from '../../services/universityService';
import { CollaborationDetailView } from './CollaborationDetailView';

export const ActiveCollaborationsView: React.FC = () => {
  const [collaborations, setCollaborations] = useState<UniversityCollaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View switch: cards or table
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedCollab, setSelectedCollab] = useState<UniversityCollaboration | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');

  const fetchCollaborations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await universityService.listCollaborations({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: search || undefined,
        industry: industryFilter !== 'ALL' ? industryFilter : undefined,
      });
      setCollaborations(res.items || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load collaborations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [statusFilter, industryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCollaborations();
  };

  if (selectedCollab) {
    return (
      <CollaborationDetailView
        collaboration={selectedCollab}
        onBack={() => setSelectedCollab(null)}
        onRefresh={fetchCollaborations}
      />
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PROTOTYPE':
      case 'TESTING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'COMPLETED':
      case 'DEPLOYED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'REQUESTED':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CANCELLED':
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
              <Handshake className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Joint Ventures</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Active Collaborations Hub</h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Track and manage all tripartite partnerships between university squads, faculty mentors, and corporate CSR sponsors.
            </p>
          </div>
          <button
            onClick={fetchCollaborations}
            className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Collaborations</span>
          </button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search collaboration, problem title, squad lead, partner..."
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

          {/* View toggle (Grid / Table) */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-end md:self-auto">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">Status Filter:</span>
          {['ALL', 'ACTIVE', 'PROTOTYPE', 'TESTING', 'APPROVED', 'REQUESTED', 'COMPLETED'].map((st) => (
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
          <p className="text-sm font-bold text-stone-700">Loading active collaborations...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="text-sm font-bold">Failed to load collaborations</div>
              <div className="text-xs text-red-600 mt-0.5">{error}</div>
            </div>
          </div>
          <button
            onClick={fetchCollaborations}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && collaborations.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Handshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No active collaborations found</h3>
          <p className="text-xs text-stone-500">
            No active project collaborations match your filter criteria.
          </p>
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setSearch('');
              fetchCollaborations();
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* CARDS VIEW */}
      {!loading && !error && viewMode === 'cards' && collaborations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collaborations.map((collab) => (
            <div
              key={collab.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                      {collab.problem_category}
                    </span>
                    <h3 className="text-sm font-black text-stone-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {collab.title}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${getStatusBadge(collab.status)}`}>
                    {collab.status}
                  </span>
                </div>

                {/* Problem line */}
                <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1">
                  <div className="text-[10px] font-bold uppercase text-stone-400">Community Challenge:</div>
                  <div className="font-semibold text-stone-800 line-clamp-1">{collab.problem_title}</div>
                </div>

                {/* Partners & Squad info */}
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">
                      <strong className="text-stone-700">Partner:</strong> {collab.industry_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">
                      <strong className="text-stone-700">Squad:</strong> {collab.student_squad_name}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-500">{collab.current_phase}</span>
                    <span className="font-black text-emerald-800">{collab.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${collab.progress}%` }}
                    />
                  </div>
                </div>

                {/* Deadline & Last Updated */}
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {collab.deadline}</span>
                  </div>
                  <span>Updated: {collab.last_updated}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedCollab(collab)}
                className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Open Collaboration Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TABLE VIEW */}
      {!loading && !error && viewMode === 'table' && collaborations.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-[10px] font-black uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="p-4">Collaboration / Problem</th>
                  <th className="p-4">Industry Partner</th>
                  <th className="p-4">Squad / Mentor</th>
                  <th className="p-4">Progress & Phase</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                {collaborations.map((collab) => (
                  <tr key={collab.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-stone-900">{collab.title}</div>
                      <div className="text-[11px] text-stone-400 truncate mt-0.5">{collab.problem_title}</div>
                    </td>
                    <td className="p-4 font-semibold text-stone-800">{collab.industry_name}</td>
                    <td className="p-4">
                      <div className="font-bold text-stone-800">{collab.student_squad_name}</div>
                      <div className="text-[11px] text-stone-500">{collab.mentor}</div>
                    </td>
                    <td className="p-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span>{collab.current_phase}</span>
                        <span className="text-emerald-800">{collab.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${collab.progress}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${getStatusBadge(collab.status)}`}>
                        {collab.status}
                      </span>
                    </td>
                    <td className="p-4 text-stone-600 font-semibold">{collab.deadline}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCollab(collab)}
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
