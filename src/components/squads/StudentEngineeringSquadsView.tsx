import React, { useState, useEffect } from 'react';
import { StudentSquad, SquadSummaryKpis as SquadSummaryKpisType } from '../../types/squad';
import { squadService } from '../../services/squadService';
import { SquadSummaryKpis } from './SquadSummaryKpis';
import { SquadCard } from './SquadCard';
import { CreateSquadModal } from './CreateSquadModal';
import { EditSquadModal } from './EditSquadModal';
import { SquadDetailView } from './SquadDetailView';
import {
  Users,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';

export const StudentEngineeringSquadsView: React.FC = () => {
  const [squads, setSquads] = useState<StudentSquad[]>([]);
  const [summary, setSummary] = useState<SquadSummaryKpisType>({
    total_squads: 0,
    active_squads: 0,
    completed_squads: 0,
    students_participating: 0,
    projects_in_progress: 0,
    field_trials: 0,
    solutions_developed: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedSquad, setSelectedSquad] = useState<StudentSquad | null>(null);
  const [editingSquad, setEditingSquad] = useState<StudentSquad | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [mentorFilter, setMentorFilter] = useState('ALL');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [phaseFilter, setPhaseFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('updated_at');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [squadRes, sumRes] = await Promise.all([
        squadService.getSquads({
          search: searchQuery,
          status: statusFilter,
          department: departmentFilter,
          mentor: mentorFilter,
          industry: industryFilter,
          current_phase: phaseFilter,
          sort_by: sortBy,
        }),
        squadService.getSquadSummary(),
      ]);
      setSquads(squadRes.items);
      setSummary(sumRes);
      if (selectedSquad) {
        const refreshed = squadRes.items.find((s) => s.squad_id === selectedSquad.squad_id);
        if (refreshed) setSelectedSquad(refreshed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, departmentFilter, mentorFilter, industryFilter, phaseFilter, sortBy]);

  const handleSquadCreated = (newSquad: StudentSquad) => {
    setSquads([newSquad, ...squads]);
    loadData();
  };

  const handleSquadUpdated = (updated: StudentSquad) => {
    setSquads(squads.map((s) => (s.squad_id === updated.squad_id ? updated : s)));
    if (selectedSquad?.squad_id === updated.squad_id) {
      setSelectedSquad(updated);
    }
    loadData();
  };

  const handleSquadDeleted = (squadId: string) => {
    setSquads(squads.filter((s) => s.squad_id !== squadId));
    if (selectedSquad?.squad_id === squadId) {
      setSelectedSquad(null);
    }
    loadData();
  };

  // If a squad detail is selected, render the 14-section Detail View
  if (selectedSquad) {
    return (
      <div className="space-y-6">
        <SquadDetailView
          squad={selectedSquad}
          onBack={() => setSelectedSquad(null)}
          onEdit={(sq) => setEditingSquad(sq)}
          onSquadUpdated={handleSquadUpdated}
        />
        {editingSquad && (
          <EditSquadModal
            isOpen={!!editingSquad}
            squad={editingSquad}
            onClose={() => setEditingSquad(null)}
            onSquadUpdated={handleSquadUpdated}
            onSquadDeleted={handleSquadDeleted}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header & Register CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Matched Student Capstones</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            <span>Student Engineering Squads</span>
          </h2>
          <p className="text-xs text-stone-600">
            Multidisciplinary student teams building field-ready prototypes for Jharkhand communities
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          id="btn-create-squad"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>+ Create New Squad</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <SquadSummaryKpis summary={summary} />

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Bar */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search squad name, ID, student, tech..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-white"
            >
              <option value="ALL">Status: All</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="DISBANDED">Disbanded</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="sm:col-span-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white"
            >
              <option value="ALL">Dept: All</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="Civil">Civil & Env</option>
              <option value="Mechanical">Mechanical</option>
              <option value="EEE">EEE</option>
              <option value="Chemical">Chemical</option>
            </select>
          </div>

          {/* Phase Filter */}
          <div className="sm:col-span-2">
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-white"
            >
              <option value="ALL">Phase: All</option>
              <option value="PROBLEM_ANALYSIS">Problem Analysis</option>
              <option value="RESEARCH">Research</option>
              <option value="DESIGN">Design</option>
              <option value="PROTOTYPE">Prototype</option>
              <option value="TESTING">Testing</option>
              <option value="FIELD_TRIAL">Field Trial</option>
              <option value="DEPLOYMENT">Deployment</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* View Toggle & Sort */}
          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-2 rounded-xl border border-stone-300 text-[11px] font-bold text-stone-700 bg-white"
            >
              <option value="updated_at">Latest Updated</option>
              <option value="progress">Progress %</option>
              <option value="name">Squad Name</option>
              <option value="squad_id">Squad ID</option>
            </select>

            <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-900 text-amber-300' : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-emerald-900 text-amber-300' : 'text-stone-500 hover:bg-stone-100'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Squad List / Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {squads.map((squad) => (
            <SquadCard
              key={squad.squad_id}
              squad={squad}
              onViewDetails={(sq) => setSelectedSquad(sq)}
              onEdit={(sq) => setEditingSquad(sq)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Squad ID</th>
                  <th className="py-3 px-4">Squad & Project Name</th>
                  <th className="py-3 px-4">Community Problem</th>
                  <th className="py-3 px-4">Leader & Members</th>
                  <th className="py-3 px-4">Mentor & Partner</th>
                  <th className="py-3 px-4">Phase</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {squads.map((sq) => (
                  <tr key={sq.squad_id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                      {sq.squad_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-stone-900">{sq.name}</div>
                      <div className="text-[11px] text-blue-700">{sq.project_name}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <span className="text-stone-800">{sq.problem_title || 'Civic Challenge'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>👑 {sq.team_leader_name || sq.members[0]?.name}</div>
                      <div className="text-[10px] text-stone-400">{sq.members.length} Members</div>
                    </td>
                    <td className="py-3.5 px-4 text-[11px]">
                      <div>🧑‍🏫 {sq.faculty_mentor_name}</div>
                      <div className="text-emerald-800 font-semibold">🏢 {sq.industry_partner_name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[11px] text-stone-700">
                      {sq.current_phase}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-emerald-800">{sq.progress}%</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {sq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedSquad(sq)}
                        className="px-2.5 py-1 bg-emerald-900 text-amber-300 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setEditingSquad(sq)}
                        className="px-2 py-1 bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold rounded-lg text-[11px] cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {squads.length === 0 && !isLoading && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <Users className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No Student Engineering Squads Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try resetting your search query or filters, or click &apos;+ Create New Squad&apos; to register a multidisciplinary team.
          </p>
        </div>
      )}

      {/* Modals */}
      <CreateSquadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSquadCreated={handleSquadCreated}
      />

      {editingSquad && (
        <EditSquadModal
          isOpen={!!editingSquad}
          squad={editingSquad}
          onClose={() => setEditingSquad(null)}
          onSquadUpdated={handleSquadUpdated}
          onSquadDeleted={handleSquadDeleted}
        />
      )}
    </div>
  );
};
