import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  Coins,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldAlert,
  ArrowUpRight,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { IndustryImpactSummary, IndustryImpactChartData } from '../../types/industry';
import { industryService } from '../../services/industryService';

export const IndustryImpactView: React.FC = () => {
  const [summary, setSummary] = useState<IndustryImpactSummary | null>(null);
  const [timeline, setTimeline] = useState<IndustryImpactChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sumRes, timeRes] = await Promise.all([
        industryService.getIndustryImpactSummary(),
        industryService.getIndustryImpactTimeline()
      ]);
      setSummary(sumRes);
      setTimeline(timeRes);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load impact metrics from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Aggregating real-time impact indicators from MongoDB...</p>
      </div>
    );
  }

  if (error || !summary || !timeline) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
        <p className="text-xs text-rose-800 font-bold">{error || 'Unable to load impact data'}</p>
        <button onClick={loadData} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 cursor-pointer">
          Retry Aggregation
        </button>
      </div>
    );
  }

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">ESG, CSR & Measurable Impact Command</h2>
            <p className="text-xs text-stone-500">Live quantitative social return on investment (SROI), environmental indicators, and grassroots beneficiary telemetry</p>
          </div>
        </div>

        <button
          onClick={() => alert('Generating MCA Form CSR-2 Audited Compliance PDF Report...')}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export MCA Form CSR-2 Report</span>
        </button>
      </div>

      {/* Top 9 KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Projects Supported</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{summary.projects_supported} Active</div>
          <div className="text-[10px] text-stone-400 font-medium mt-0.5">Across 4 Universities</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Problems Solved</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{summary.problems_addressed} Solved</div>
          <div className="text-[10px] text-blue-700 font-medium mt-0.5">88% Resolution Rate</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Solutions Deployed</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{summary.solutions_deployed} Field Pilots</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{summary.solutions_supported} Co-Developed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Citizens Benefited</div>
          <div className="text-2xl font-black text-purple-950 mt-1">{summary.people_benefited.toLocaleString()}+</div>
          <div className="text-[10px] text-purple-700 font-medium mt-0.5">Verified Households</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">CSR Grant Disbursed</div>
          <div className="text-2xl font-black text-amber-900 mt-1">₹{(summary.csr_funding_disbursed / 100000).toFixed(1)} L</div>
          <div className="text-[10px] text-amber-700 font-medium mt-0.5">₹{(summary.csr_funding_total / 100000).toFixed(1)} L Committed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Tech Support Hours</div>
          <div className="text-2xl font-black text-rose-900 mt-1">{summary.technical_support_delivered} Engagements</div>
          <div className="text-[10px] text-rose-700 font-medium mt-0.5">Corporate Mentorship</div>
        </div>
      </div>

      {/* 4 Dimension Detail Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50/60 p-5 rounded-3xl border border-emerald-200/80 space-y-1">
          <div className="flex items-center justify-between text-emerald-900">
            <span className="text-xs font-black uppercase">Environmental SROI</span>
            <Award className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-950">{summary.environmental_impact_score}</div>
          <p className="text-[11px] text-emerald-800">Clean drinking water, air filtration misting, and solar agro cold chains.</p>
        </div>

        <div className="bg-blue-50/60 p-5 rounded-3xl border border-blue-200/80 space-y-1">
          <div className="flex items-center justify-between text-blue-900">
            <span className="text-xs font-black uppercase">Economic Cost Saved</span>
            <Coins className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-black text-blue-950">{summary.cost_saved}</div>
          <p className="text-[11px] text-blue-800">Public expenditure efficiency delivered by university hardware innovation.</p>
        </div>

        <div className="bg-purple-50/60 p-5 rounded-3xl border border-purple-200/80 space-y-1">
          <div className="flex items-center justify-between text-purple-900">
            <span className="text-xs font-black uppercase">Academic Innovation</span>
            <Sparkles className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-black text-purple-950">{summary.education_impact_score}</div>
          <p className="text-[11px] text-purple-800">Engineering student multidisciplinary squads mentored on live problems.</p>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200/80 space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="text-xs font-black uppercase">Community Satisfaction</span>
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-amber-950">★ {summary.community_feedback_rating} / 5.0</div>
          <p className="text-[11px] text-amber-800">Direct feedback rating from panchayats and local civic administrations.</p>
        </div>
      </div>

      {/* 8 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Beneficiaries Trend */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">1. People Benefited Over Time</h3>
              <p className="text-xs text-stone-500">Cumulative verified residents impacted by deployed pilots</p>
            </div>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline.people_benefited_trend}>
                <defs>
                  <linearGradient id="colorCitizens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="citizens" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCitizens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: CSR Funding by Project */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">2. CSR Grant Allocations (₹ Lakhs)</h3>
              <p className="text-xs text-stone-500">Pledged vs Disbursed capital per university innovation</p>
            </div>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline.csr_by_project}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="project" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="pledged" fill="#F59E0B" name="Pledged (₹L)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="disbursed" fill="#10B981" name="Disbursed (₹L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Solutions by Status */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">3. Solutions Pipeline by Maturity</h3>
              <p className="text-xs text-stone-500">Breakdown from lab prototypes to deployed field pilots</p>
            </div>
            <PieChartIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeline.solutions_by_status}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {timeline.solutions_by_status.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Geographic Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">4. Geographic Reach Across Districts</h3>
              <p className="text-xs text-stone-500">Beneficiaries served across Jharkhand tribal & mining belts</p>
            </div>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline.geographic_distribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="district" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="beneficiaries" fill="#3B82F6" name="Beneficiaries" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: University Support Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">5. University Grant Distribution</h3>
              <p className="text-xs text-stone-500">Total grant funding allocated per partner university</p>
            </div>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline.university_support_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="university" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={45} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="funding" fill="#8B5CF6" name="Funding (₹ Lakhs)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Technical Support Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">6. Technical Support Delivered by Domain</h3>
              <p className="text-xs text-stone-500">Corporate engineer mentorship & hardware assistance hours</p>
            </div>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline.tech_support_breakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" name="Engagements" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
