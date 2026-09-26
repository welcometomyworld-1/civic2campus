import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  FileText,
  FlaskConical,
  FolderGit2,
  Globe,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  X,
  AlertCircle,
  Activity,
  Award,
  Zap
} from 'lucide-react';
import { UniversitySolution } from '../../types/university';
import { universityService } from '../../services/universityService';

interface SolutionDetailViewProps {
  solution: UniversitySolution;
  onBack: () => void;
  onRefresh: () => void;
}

export const SolutionDetailView: React.FC<SolutionDetailViewProps> = ({
  solution: initialSolution,
  onBack,
  onRefresh,
}) => {
  const [solution, setSolution] = useState<UniversitySolution>(initialSolution);
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'prototype' | 'testing' | 'deployment' | 'impact'
  >('overview');

  // Status Modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(solution.current_status);
  const [newProgress, setNewProgress] = useState(solution.progress);

  // Testing Modal
  const [isTestingModalOpen, setIsTestingModalOpen] = useState(false);
  const [testLocation, setTestLocation] = useState('');
  const [testResult, setTestResult] = useState('PASS');
  const [testMetric, setTestMetric] = useState('');
  const [testNotes, setTestNotes] = useState('');

  // Deployment Modal
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false);
  const [depLocation, setDepLocation] = useState(solution.deployment_location || '');
  const [depPeople, setDepPeople] = useState(solution.people_benefited || 1000);
  const [depDate, setDepDate] = useState(solution.deployment_date || '');

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await universityService.updateSolutionStatus(solution.id, {
        status: newStatus,
        progress: Number(newProgress),
      });
      setSolution(updated);
      setIsStatusModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTesting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testLocation.trim()) return;
    setIsUpdating(true);
    try {
      const updated = await universityService.addSolutionTesting(solution.id, {
        test_date: new Date().toISOString().split('T')[0],
        location: testLocation,
        result: testResult,
        metrics_observed: testMetric || 'Telemetry signal RSSI -72dBm, packet loss < 0.2%',
        notes: testNotes || 'Field sensor tested under simulated flood runoff conditions',
      });
      setSolution(updated);
      setIsTestingModalOpen(false);
      setTestLocation('');
      setTestMetric('');
      setTestNotes('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to record test');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await universityService.updateSolution(solution.id, {
        deployment_location: depLocation,
        people_benefited: Number(depPeople),
        deployment_date: depDate || new Date().toISOString().split('T')[0],
        current_status: 'DEPLOYED',
        progress: 100,
      });
      setSolution(updated);
      setIsDeploymentModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to record deployment');
    } finally {
      setIsUpdating(false);
    }
  };

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
      {/* Top Breadcrumbs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Solutions Repository</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(solution.current_status)}`}>
            {solution.current_status}
          </span>
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Update Status</span>
          </button>
          <button
            onClick={() => setIsTestingModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Log Test Run</span>
          </button>
          <button
            onClick={() => setIsDeploymentModalOpen(true)}
            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Record Field Deployment</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Prototype & Civic Innovation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{solution.title}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            {solution.description || `Engineered to remediate: ${solution.problem_title}`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15 text-xs">
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Development Team</div>
              <div className="font-bold text-white mt-0.5">{solution.development_team}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Deployment District</div>
              <div className="font-bold text-white mt-0.5">{solution.deployment_location || 'Field Trials in Progress'}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Citizens Benefited</div>
              <div className="font-black text-amber-300 mt-0.5">{solution.people_benefited?.toLocaleString() || 0} Citizens</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Deployment Date</div>
              <div className="font-bold text-white mt-0.5">{solution.deployment_date || 'Q4 2026'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] font-extrabold uppercase text-stone-400 mr-2 flex items-center gap-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Technology Architecture:</span>
        </span>
        {solution.technology?.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-lg text-xs font-bold"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Problem Link', icon: FileText },
          { id: 'prototype', label: 'Hardware / Software Architecture', icon: Cpu },
          { id: 'testing', label: `Field Testing Logs (${solution.testing_runs?.length || 0})`, icon: FlaskConical },
          { id: 'deployment', label: 'Deployment & Telemetry', icon: Globe },
          { id: 'impact', label: 'Statewide Impact Metrics', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-amber-300 shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB CONTENTS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider">
                Problem Statement & AI R&D Alignment
              </h3>
              <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm">{solution.problem_title}</div>
                <p className="text-stone-700 leading-relaxed">
                  {solution.description || 'Continuous municipal infrastructure monitoring solution with solar power backup and low-latency cloud synchronization.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Related Project</div>
                  <div className="font-bold text-stone-900 mt-0.5">{solution.project_name}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Collaboration</div>
                  <div className="font-bold text-stone-900 mt-0.5">{solution.collaboration_name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase text-stone-400 text-[10px] tracking-wider">Solution Progress</h4>
              <div className="flex items-center justify-between font-bold">
                <span className="text-stone-700">Readiness Score</span>
                <span className="text-emerald-800 text-sm">{solution.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${solution.progress}%` }} />
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                Field validation accredited under Jharkhand Academic R&D Framework 2026.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Logs */}
      {activeSubTab === 'testing' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900">Field Testing & Validation Logs</h3>
              <p className="text-xs text-stone-500">Live environmental performance benchmarks recorded by student squad</p>
            </div>
            <button
              onClick={() => setIsTestingModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Test Run</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {solution.testing_runs && solution.testing_runs.length > 0 ? (
              solution.testing_runs.map((test, idx) => (
                <div
                  key={test.run_id || idx}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black ${
                          test.result === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {test.result}
                      </span>
                      <span className="font-bold text-stone-900">{test.location}</span>
                    </div>
                    <div className="text-stone-600 text-xs font-semibold">{test.metrics_observed}</div>
                    {test.notes && <p className="text-stone-500 text-[11px]">{test.notes}</p>}
                  </div>
                  <div className="text-stone-400 text-[11px] shrink-0">{test.test_date}</div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">No testing runs logged yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Deployment & Telemetry */}
      {activeSubTab === 'deployment' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900">Field Deployment Configuration</h3>
            <button
              onClick={() => setIsDeploymentModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Update Deployment
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Deployment Site</div>
              <div className="font-extrabold text-stone-900 text-sm">{solution.deployment_location || 'Not Specified'}</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Commissioning Date</div>
              <div className="font-extrabold text-stone-900 text-sm">{solution.deployment_date || 'Scheduled 2026'}</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Citizen Impact Direct</div>
              <div className="font-black text-emerald-900 text-sm">{solution.people_benefited?.toLocaleString() || 0} Benefited</div>
            </div>
          </div>
        </div>
      )}

      {/* Impact */}
      {activeSubTab === 'impact' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <h3 className="text-sm font-black text-stone-900">Estimated Civic Impact Profile</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl text-center">
              <div className="text-2xl font-black text-stone-900">{solution.people_benefited?.toLocaleString() || 0}</div>
              <div className="text-[10px] text-stone-500 font-bold uppercase mt-1">People Benefited</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl text-center">
              <div className="text-2xl font-black text-emerald-800">84%</div>
              <div className="text-[10px] text-stone-500 font-bold uppercase mt-1">Resolution Rate</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl text-center">
              <div className="text-2xl font-black text-blue-800">₹4.2 L</div>
              <div className="text-[10px] text-stone-500 font-bold uppercase mt-1">Cost Saved</div>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl text-center">
              <div className="text-2xl font-black text-purple-800">24/7</div>
              <div className="text-[10px] text-stone-500 font-bold uppercase mt-1">IoT Telemetry</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STATUS UPDATE MODAL */}
      {/* ========================================================================= */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Update Solution Lifecycle Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  {['PROTOTYPE', 'TESTING', 'APPROVED', 'DEPLOYED', 'FAILED', 'ARCHIVED'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">
                  Readiness Progress ({newProgress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TESTING MODAL */}
      {/* ========================================================================= */}
      {isTestingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Record Field Testing Run</h3>
              <button onClick={() => setIsTestingModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTesting} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Test Location</label>
                <input
                  type="text"
                  required
                  value={testLocation}
                  onChange={(e) => setTestLocation(e.target.value)}
                  placeholder="e.g. Ranchi Dam Spillway / BIT Mesra Lab 4"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Result</label>
                <select
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  <option value="PASS">PASS - Validation Succeeded</option>
                  <option value="PARTIAL_PASS">PARTIAL PASS - Minor Calibration Needed</option>
                  <option value="FAIL">FAIL - Hardware Revision Required</option>
                </select>
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Observed Metrics</label>
                <input
                  type="text"
                  value={testMetric}
                  onChange={(e) => setTestMetric(e.target.value)}
                  placeholder="e.g. 99.4% packet delivery rate, battery life > 18 hours"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTestingModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Recording...' : 'Record Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEPLOYMENT MODAL */}
      {/* ========================================================================= */}
      {isDeploymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Record Live Field Deployment</h3>
              <button onClick={() => setIsDeploymentModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateDeployment} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Deployment Location</label>
                <input
                  type="text"
                  required
                  value={depLocation}
                  onChange={(e) => setDepLocation(e.target.value)}
                  placeholder="e.g. Ranchi Municipal Ward 12, Jharkhand"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Citizens Benefited</label>
                <input
                  type="number"
                  required
                  value={depPeople}
                  onChange={(e) => setDepPeople(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Deployment Date</label>
                <input
                  type="date"
                  value={depDate}
                  onChange={(e) => setDepDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeploymentModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Deploying...' : 'Confirm Field Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
