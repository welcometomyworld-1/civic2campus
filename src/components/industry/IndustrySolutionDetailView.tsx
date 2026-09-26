import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  Layers,
  FileText,
  AlertCircle,
  Plus,
  Send,
  Download,
  Award,
  Cpu,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IndustrySolutionItem, IndustrySolutionStatus } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface IndustrySolutionDetailViewProps {
  solutionId: string;
  onBack: () => void;
}

export const IndustrySolutionDetailView: React.FC<IndustrySolutionDetailViewProps> = ({ solutionId, onBack }) => {
  const [solution, setSolution] = useState<IndustrySolutionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'testing' | 'deployment' | 'impact' | 'timeline'>('overview');
  const [actionLoading, setActionLoading] = useState(false);

  // Testing Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testRun, setTestRun] = useState({
    tested_by: 'Dr. Rahul Kumar',
    parameters: 'Continuous 72-hour stress test and water quality sensor calibration',
    result: 'PASS',
    notes: 'Turbidity sensor drift < 1.2%, battery reserve maintained 100% on solar.'
  });

  // Deployment Modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployInfo, setDeployInfo] = useState({
    deployment_location: 'Toto Village Public Water Station, Gumla',
    deployment_date: new Date().toISOString().split('T')[0],
    people_benefited: 1240,
    outcomes: 'Zero iron sediment reported by village panchayat and primary health center.'
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await industryService.getIndustrySolutionById(solutionId);
      setSolution(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load solution details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [solutionId]);

  const handleStatusChange = async (st: IndustrySolutionStatus) => {
    if (!solution) return;
    setActionLoading(true);
    try {
      const updated = await industryService.updateIndustrySolutionStatus(solution.id, st);
      confetti({ particleCount: 50, spread: 60 });
      setSolution(updated);
    } catch (e) {
      alert('Failed to update solution status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTestRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution) return;
    try {
      const updated = await industryService.addIndustrySolutionTesting(solution.id, testRun);
      setSolution(updated);
      setIsTestModalOpen(false);
      alert('Testing run logged successfully!');
    } catch (e) {
      alert('Failed to log testing record.');
    }
  };

  const handleAddDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solution) return;
    try {
      const updated = await industryService.addIndustrySolutionDeployment(solution.id, deployInfo);
      confetti({ particleCount: 80, spread: 70 });
      setSolution(updated);
      setIsDeployModalOpen(false);
      alert('Field deployment recorded successfully!');
    } catch (e) {
      alert('Failed to record field deployment.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Loading Solution Specifications...</p>
      </div>
    );
  }

  if (error || !solution) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
        <p className="text-xs text-rose-800 font-bold">{error || 'Solution not found'}</p>
        <button onClick={onBack} className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer">
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Solutions Repository</span>
        </button>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 uppercase">
          {solution.problem_category || 'Water & Sanitation'}
        </span>
      </div>

      {/* Main Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                Status: {solution.status}
              </span>
              <span className="text-xs text-stone-400 font-medium">• Deployed: {solution.deployment_date || 'In Testing'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {solution.solution_name}
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              <strong>Addressing Problem:</strong> {solution.problem_name}
            </p>
          </div>

          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 min-w-[260px] space-y-1 shrink-0 text-center sm:text-left">
            <div className="text-[10px] text-emerald-700 font-bold uppercase">Citizens Impacted</div>
            <div className="text-3xl font-black text-emerald-950">{(solution.people_benefited || 1200).toLocaleString()}</div>
            <div className="text-xs text-emerald-800 font-medium truncate">
              📍 {solution.deployment_location || 'Gumla District'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            Solution Lifecycle Actions:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('TESTING')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Set Testing
            </button>
            <button
              onClick={() => handleStatusChange('APPROVED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Approve for Field
            </button>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Record Field Deployment
            </button>
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              + Log Lab Test Run
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Technical Specifications & R&D' },
          { id: 'testing', label: `Testing Runs (${solution.testing_runs?.length || 0})` },
          { id: 'deployment', label: `Field Trials & Pilots (${solution.field_trials?.length || 0})` },
          { id: 'impact', label: 'Beneficiaries & ESG Metrics' },
          { id: 'timeline', label: 'Activity Audit Log' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-amber-400 text-slate-950 font-black shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 mb-1">AI R&D Brief & Innovation Approach</h3>
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {solution.ai_rd_brief || 'Hardware filtration unit backed by continuous LoRa turbidity and heavy metal concentration sensors transmitting real-time analytics to the platform dashboard.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-stone-900 mb-1">Prototype Hardware Architecture</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {solution.prototype_details || 'Multi-stage granular activated carbon and catalytic iron media chamber with automated high-pressure backwash cycles driven by micro-solar panels and lithium-iron-phosphate battery buffers.'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-stone-900 mb-2">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {solution.technology?.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">Co-Development Team</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">University & Squad</div>
                <div className="font-bold text-stone-900">{solution.university_name}</div>
                <div className="text-[10px] text-stone-500">{solution.student_squad || 'AquaSensors Squad Alpha'}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Industry Partner</div>
                <div className="font-bold text-stone-900">{solution.industry_name || 'Tata Steel CSR Foundation'}</div>
                <div className="text-[10px] text-stone-500">{solution.industry_contribution || 'Corporate Grant & PCB Review'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Testing Runs */}
      {activeTab === 'testing' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">Lab Trials & QA Sensor Calibration</h3>
              <p className="text-xs text-stone-500">Verified by university research mentors and corporate test engineers</p>
            </div>
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Log Test Run</span>
            </button>
          </div>

          <div className="space-y-3">
            {solution.testing_runs?.map((tr, idx) => (
              <div key={tr.id || idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        tr.result === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tr.result}
                    </span>
                    <span className="text-xs font-bold text-stone-900">Tested on {tr.date}</span>
                    <span className="text-xs text-stone-400">• By {tr.tested_by}</span>
                  </div>
                  <div className="text-xs text-stone-700"><strong>Parameters:</strong> {tr.parameters}</div>
                  {tr.notes && <div className="text-xs text-stone-500 italic">Notes: {tr.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Field Trials */}
      {activeTab === 'deployment' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900">Field Pilots & Community Trials</h3>
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Deployment</span>
            </button>
          </div>

          <div className="space-y-3">
            {solution.field_trials?.map((ft, idx) => (
              <div key={ft.id || idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-950">{ft.location}</span>
                    <span className="text-[10px] text-emerald-700">• Date: {ft.date}</span>
                  </div>
                  <p className="text-xs text-stone-700">{ft.outcomes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Impact */}
      {activeTab === 'impact' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Socio-Economic & Environmental ROI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center">
              <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-purple-950">{(solution.people_benefited || 1200).toLocaleString()}</div>
              <div className="text-[10px] text-purple-700 font-bold uppercase mt-0.5">Citizens Served</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-base font-black text-blue-950 truncate mt-1">{solution.deployment_location || 'Gumla District'}</div>
              <div className="text-[10px] text-blue-700 font-bold uppercase mt-0.5">Deployment Geography</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-base font-black text-emerald-950 mt-1">94% Quality Compliance</div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">Lab Verification Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Solution Audit Log</h3>
          <div className="space-y-3">
            {solution.activity_timeline?.map((a, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900">{a.action}</span>
                    <span className="text-[10px] text-stone-400">{a.timestamp?.split('T')[0]}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-medium">By: {a.by}</div>
                  {a.details && <p className="text-xs text-stone-700 mt-1">{a.details}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Log Lab Test Run</h3>
              <button onClick={() => setIsTestModalOpen(false)} className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTestRun} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Tested By *</label>
                <input
                  type="text"
                  required
                  value={testRun.tested_by}
                  onChange={(e) => setTestRun({ ...testRun, tested_by: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Test Parameters *</label>
                <input
                  type="text"
                  required
                  value={testRun.parameters}
                  onChange={(e) => setTestRun({ ...testRun, parameters: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Test Result</label>
                <select
                  value={testRun.result}
                  onChange={(e) => setTestRun({ ...testRun, result: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                >
                  <option value="PASS">PASS</option>
                  <option value="FAIL">FAIL</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Notes / Observations</label>
                <textarea
                  rows={2}
                  value={testRun.notes}
                  onChange={(e) => setTestRun({ ...testRun, notes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsTestModalOpen(false)} className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs">
                  Save Test Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Deployment Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Record Field Deployment</h3>
              <button onClick={() => setIsDeployModalOpen(false)} className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDeployment} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Deployment Location *</label>
                <input
                  type="text"
                  required
                  value={deployInfo.deployment_location}
                  onChange={(e) => setDeployInfo({ ...deployInfo, deployment_location: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Deployment Date</label>
                <input
                  type="date"
                  value={deployInfo.deployment_date}
                  onChange={(e) => setDeployInfo({ ...deployInfo, deployment_date: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Beneficiaries Count</label>
                <input
                  type="number"
                  value={deployInfo.people_benefited}
                  onChange={(e) => setDeployInfo({ ...deployInfo, people_benefited: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Outcomes / Panchayat Feedback</label>
                <textarea
                  rows={2}
                  value={deployInfo.outcomes}
                  onChange={(e) => setDeployInfo({ ...deployInfo, outcomes: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsDeployModalOpen(false)} className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl cursor-pointer shadow-xs">
                  Confirm Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
