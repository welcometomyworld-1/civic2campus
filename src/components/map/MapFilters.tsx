import React, { useState } from 'react';
import {
  Filter,
  AlertTriangle,
  GraduationCap,
  Building,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  MapPin,
  Tag,
  Flame,
} from 'lucide-react';
import { MarkerCategory } from '../../data/mapData';

export interface FilterState {
  category: MarkerCategory | 'all';
  domain: string;
  priority: string;
  district: string;
  status: string;
}

interface MapFiltersProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  counts: {
    all: number;
    problems: number;
    universities: number;
    industry: number;
    solutions: number;
  };
  districtsList: string[];
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  filterState,
  setFilterState,
  counts,
  districtsList,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mainCategoryButtons: {
    id: MarkerCategory | 'all';
    label: string;
    icon: any;
    count: number;
    activeStyle: string;
  }[] = [
    {
      id: 'all',
      label: 'All Hotspots',
      icon: Filter,
      count: counts.all,
      activeStyle: 'bg-[#141414] text-white border-[#141414] shadow-xs',
    },
    {
      id: 'problem',
      label: 'Problems',
      icon: AlertTriangle,
      count: counts.problems,
      activeStyle: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-500/20',
    },
    {
      id: 'university',
      label: 'Universities',
      icon: GraduationCap,
      count: counts.universities,
      activeStyle: 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20',
    },
    {
      id: 'industry',
      label: 'Industry',
      icon: Building,
      count: counts.industry,
      activeStyle: 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-500/20',
    },
    {
      id: 'solution',
      label: 'Solutions',
      icon: CheckCircle2,
      count: counts.solutions,
      activeStyle: 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20',
    },
  ];

  const hasActiveAdvanced =
    filterState.domain !== 'all' ||
    filterState.priority !== 'all' ||
    filterState.district !== 'all' ||
    filterState.status !== 'all';

  const resetAllFilters = () => {
    setFilterState({
      category: 'all',
      domain: 'all',
      priority: 'all',
      district: 'all',
      status: 'all',
    });
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Primary Category Pill Filter Row */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
        {mainCategoryButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = filterState.category === btn.id;

          return (
            <button
              key={btn.id}
              onClick={() =>
                setFilterState((prev) => ({ ...prev, category: btn.id }))
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                isActive
                  ? btn.activeStyle
                  : 'bg-white/90 hover:bg-white text-stone-700 border-black/10 hover:border-black/20 shadow-2xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{btn.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                {btn.count}
              </span>
            </button>
          );
        })}

        {/* Toggle Advanced Filters Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            showAdvanced || hasActiveAdvanced
              ? 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-500/20'
              : 'bg-white/90 hover:bg-white text-stone-600 border-black/10 shadow-2xs'
          }`}
          title="Filter by category, priority, location"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Advanced Filters</span>
          <span className="sm:hidden">Filters</span>
          {hasActiveAdvanced && (
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Clear Filters Button (when any active) */}
        {(filterState.category !== 'all' || hasActiveAdvanced) && (
          <button
            onClick={resetAllFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-xl border border-stone-200 transition-colors cursor-pointer"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px] font-semibold">Reset</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="p-3.5 bg-white/95 backdrop-blur-md rounded-2xl border border-black/10 shadow-lg animate-in fade-in slide-in-from-top-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          {/* Domain / Category Filter */}
          <div>
            <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-stone-400" />
              <span>Category / Domain</span>
            </label>
            <select
              value={filterState.domain}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, domain: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="all">All Domains</option>
              <option value="Water">💧 Water & Groundwater</option>
              <option value="Environment">🌱 Environment & Pollution</option>
              <option value="Healthcare">🏥 Healthcare & Diagnostics</option>
              <option value="Agriculture">🌾 Agriculture & Irrigation</option>
              <option value="Infrastructure">🏗️ Infrastructure & Telecom</option>
              <option value="Energy">⚡ Clean Energy & Solar</option>
            </select>
          </div>

          {/* Priority Level */}
          <div>
            <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>Priority Level</span>
            </label>
            <select
              value={filterState.priority}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">🔴 Critical Urgency</option>
              <option value="HIGH">🟠 High Priority</option>
              <option value="MEDIUM">🟡 Medium Priority</option>
              <option value="LOW">🟢 Low Priority</option>
            </select>
          </div>

          {/* District / Location Filter */}
          <div>
            <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>Location / District</span>
            </label>
            <select
              value={filterState.district}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, district: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="all">All Locations</option>
              {districtsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block font-bold text-stone-700 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span>Deployment Status</span>
            </label>
            <select
              value={filterState.status}
              onChange={(e) =>
                setFilterState((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              <option value="all">All Statuses</option>
              <option value="AI_ANALYZED">AI Analyzed</option>
              <option value="MATCHED">University Matched</option>
              <option value="PROTOTYPE">Prototype in Testing</option>
              <option value="PILOT">Village Pilot Active</option>
              <option value="DEPLOYED">State-wide Deployed</option>
            </select>
          </div>

        </div>
      )}
    </div>
  );
};
