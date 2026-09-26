import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Building,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const GovernmentCommandCenterPage: React.FC = () => {
  const {
    districts,
    projects,
    problems,
    totalCitizensImpacted,
    activeProjectsCount,
    criticalProblemsCount,
    advanceProjectStage,
    setSelectedDistrict,
    setCurrentView,
  } = useApp();

  const [selectedZone, setSelectedZone] = useState('ALL');

  const domainChartData = [
    { name: 'Water', value: 34, color: '#0284c7' },
    { name: 'Health', value: 24, color: '#e11d48' },
    { name: 'Agri', value: 22, color: '#16a34a' },
    { name: 'Education', value: 14, color: '#9333ea' },
    { name: 'Sanitation', value: 12, color: '#d97706' },
    { name: 'Environment', value: 10, color: '#0d9488' },
  ];

  const districtSeverityData = districts.slice(0, 6).map((d) => ({
    name: d.name,
    problems: d.totalProblems,
    impacted: Math.round(d.citizensImpacted / 1000),
  }));

  const filteredDistricts = districts.filter(
    (d) => selectedZone === 'ALL' || d.zone === selectedZone
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>State Secretariat & District Innovation Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Jharkhand Civic Telemetry & Deployment Matrix
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Real-time multi-agency surveillance tracking problem resolution across all 24 districts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('map')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <span>Launch 3D Command Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">Reported Issues</div>
          <div className="text-2xl font-black text-stone-900 mt-1">24,821</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across 24 Districts</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">Critical Urgency</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{criticalProblemsCount + 3840}</div>
          <div className="text-[10px] text-rose-600 font-bold mt-0.5">High Priority Queue</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">Active Projects</div>
          <div className="text-2xl font-black text-sky-700 mt-1">{activeProjectsCount}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">In Prototype/Pilot</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">Universities</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">42</div>
          <div className="text-[10px] text-stone-500 mt-0.5">1,248 Researchers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">CSR Co-Funding</div>
          <div className="text-2xl font-black text-purple-700 mt-1">₹18.4 Cr</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">42 Industry Backers</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] font-bold text-stone-500 uppercase">Citizens Impacted</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalCitizensImpacted.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Verified Outcomes</div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* District Problem vs Impact Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">District Challenges vs Verified Citizens Impacted (in thousands)</h3>
              <p className="text-xs text-stone-500">Live comparative telemetry from major districts</p>
            </div>
            <span className="text-xs font-mono font-bold bg-stone-100 px-2.5 py-1 rounded-lg text-stone-700">
              Statewide Audit 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtSeverityData}>
                <XAxis dataKey="name" stroke="#78716c" fontSize={11} />
                <YAxis stroke="#78716c" fontSize={11} />
                <Tooltip />
                <Bar dataKey="problems" fill="#0284c7" name="Total Problems" radius={[6, 6, 0, 0]} />
                <Bar dataKey="impacted" fill="#10b981" name="Impacted (k)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Distribution Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Challenges by Domain (%)</h3>
            <p className="text-xs text-stone-500 mb-4">AI classified statewide problem distribution</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={domainChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {domainChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-100">
            {domainChartData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-stone-600 font-medium">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* District Intelligence Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-stone-900">District Innovation Readiness League</h3>
            <p className="text-xs text-stone-500">Ranked by resolution velocity & academic engagement</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 outline-none"
            >
              <option value="ALL">All Administrative Zones</option>
              <option value="South Chota Nagpur">South Chota Nagpur</option>
              <option value="North Chota Nagpur">North Chota Nagpur</option>
              <option value="Kolhan">Kolhan</option>
              <option value="Santhal Pargana">Santhal Pargana</option>
              <option value="Palamu">Palamu</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase text-[10px]">
                <th className="pb-3">District</th>
                <th className="pb-3">Zone</th>
                <th className="pb-3">Total Issues</th>
                <th className="pb-3">Critical</th>
                <th className="pb-3">Active Projects</th>
                <th className="pb-3">Citizens Impacted</th>
                <th className="pb-3">CSR Funding</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700 font-medium">
              {filteredDistricts.map((d) => (
                <tr key={d.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 font-bold text-stone-900">{d.name}</td>
                  <td className="py-3.5 text-stone-500">{d.zone}</td>
                  <td className="py-3.5 font-semibold text-stone-900">{d.totalProblems}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold">
                      {d.criticalProblems}
                    </span>
                  </td>
                  <td className="py-3.5 text-sky-700 font-bold">{d.activeProjects}</td>
                  <td className="py-3.5 text-emerald-700 font-bold">{d.citizensImpacted.toLocaleString()}</td>
                  <td className="py-3.5 font-bold text-purple-700">{d.csrFunding}</td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedDistrict(d);
                        setCurrentView('map');
                      }}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Inspect 3D
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
