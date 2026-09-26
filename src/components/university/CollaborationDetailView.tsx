import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  FolderGit2,
  Handshake,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  AlertCircle
} from 'lucide-react';
import { UniversityCollaboration } from '../../types/university';
import { universityService } from '../../services/universityService';

interface CollaborationDetailViewProps {
  collaboration: UniversityCollaboration;
  onBack: () => void;
  onRefresh: () => void;
}

export const CollaborationDetailView: React.FC<CollaborationDetailViewProps> = ({
  collaboration: initialCollab,
  onBack,
  onRefresh,
}) => {
  const [collab, setCollab] = useState<UniversityCollaboration>(initialCollab);
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'milestones' | 'tasks' | 'documents' | 'timeline' | 'team'
  >('overview');
  
  // Progress modal
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [newProgress, setNewProgress] = useState(collab.progress);
  const [newPhase, setNewPhase] = useState(collab.current_phase);
  const [newStatus, setNewStatus] = useState(collab.status);

  // Milestone modal
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mDue, setMDue] = useState('');

  // Task modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tAssigned, setTAssigned] = useState('');
  const [tPriority, setTPriority] = useState('HIGH');

  // Document modal
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Technical Specification');

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatusOrProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await universityService.updateCollaboration(collab.id, {
        progress: Number(newProgress),
        current_phase: newPhase,
        status: newStatus,
      });
      setCollab(updated);
      setIsProgressModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update collaboration');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;
    setIsUpdating(true);
    try {
      const updated = await universityService.addMilestone(collab.id, {
        title: mTitle,
        description: mDesc,
        due_date: mDue || '2026-11-30',
      });
      setCollab(updated);
      setMTitle('');
      setMDesc('');
      setIsMilestoneModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add milestone');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim()) return;
    setIsUpdating(true);
    try {
      const updated = await universityService.addTask(collab.id, {
        title: tTitle,
        assigned_to: tAssigned || 'Student Squad Lead',
        priority: tPriority,
      });
      setCollab(updated);
      setTTitle('');
      setIsTaskModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to add task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    setIsUpdating(true);
    try {
      const updated = await universityService.uploadDocument(collab.id, {
        name: docName,
        file_type: docType,
        version: 'v1.0',
      });
      setCollab(updated);
      setDocName('');
      setIsDocModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to record document');
    } finally {
      setIsUpdating(false);
    }
  };

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
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collaborations List</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(collab.status)}`}>
            {collab.status}
          </span>
          <button
            onClick={() => setIsProgressModalOpen(true)}
            className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Update Progress & Phase</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
            <Handshake className="w-3.5 h-3.5 text-amber-400" />
            <span>University-Industry Joint Venture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{collab.title}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-3xl leading-relaxed">
            {collab.description || `Addressing community challenge: ${collab.problem_title}`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15 text-xs">
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Industry Partner</div>
              <div className="font-bold text-white mt-0.5">{collab.industry_name}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Student Squad</div>
              <div className="font-bold text-white mt-0.5">{collab.student_squad_name}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Faculty Mentor</div>
              <div className="font-bold text-white mt-0.5">{collab.mentor}</div>
            </div>
            <div>
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Target Deadline</div>
              <div className="font-bold text-white mt-0.5">{collab.deadline}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Gauge */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="font-bold text-stone-700 flex items-center gap-2">
            <span>Current Sprint Phase:</span>
            <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-900 font-extrabold">
              {collab.current_phase}
            </span>
          </div>
          <div className="font-black text-emerald-800 text-sm">{collab.progress}% Completed</div>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${collab.progress}%` }}
          />
        </div>
      </div>

      {/* Subtabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Problem Brief', icon: FileText },
          { id: 'milestones', label: `Milestones (${collab.milestones?.length || 0})`, icon: CheckCircle2 },
          { id: 'tasks', label: `Sprint Tasks (${collab.tasks?.length || 0})`, icon: Layers },
          { id: 'team', label: `Squad & Mentors (${collab.members?.length || 0})`, icon: Users },
          { id: 'documents', label: `Documents (${collab.documents?.length || 0})`, icon: FolderGit2 },
          { id: 'timeline', label: `Activity Log (${collab.activity_timeline?.length || 0})`, icon: Clock },
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

      {/* SUBTAB CONTENT */}

      {/* 1. Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider">
                Community Problem & AI R&D Context
              </h3>
              <div className="p-4 bg-stone-50 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-stone-900 text-sm">{collab.problem_title}</div>
                <div className="text-stone-500 font-semibold">Category: {collab.problem_category}</div>
                <p className="text-stone-700 leading-relaxed pt-1">
                  This collaboration mobilizes university student engineers and industry technical experts to architect a scalable field-tested solution with continuous telemetry.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">University Host</div>
                  <div className="font-extrabold text-stone-900 mt-0.5">{collab.university_name}</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Industry Co-Sponsor</div>
                  <div className="font-extrabold text-stone-900 mt-0.5">{collab.industry_name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <h4 className="font-bold uppercase text-stone-400 text-[10px] tracking-wider">Quick Actions</h4>
              <button
                onClick={() => setIsMilestoneModalOpen(true)}
                className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer border border-stone-200"
              >
                <span>Add Key Milestone</span>
                <Plus className="w-4 h-4 text-stone-500" />
              </button>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer border border-stone-200"
              >
                <span>Assign Sprint Task</span>
                <Plus className="w-4 h-4 text-stone-500" />
              </button>
              <button
                onClick={() => setIsDocModalOpen(true)}
                className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 text-stone-800 rounded-xl font-bold transition-all flex items-center justify-between cursor-pointer border border-stone-200"
              >
                <span>Upload Technical Document</span>
                <Upload className="w-4 h-4 text-stone-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Milestones */}
      {activeSubTab === 'milestones' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900">Project Milestones</h3>
              <p className="text-xs text-stone-500">Scheduled delivery milestones agreed with industry partner</p>
            </div>
            <button
              onClick={() => setIsMilestoneModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {collab.milestones && collab.milestones.length > 0 ? (
              collab.milestones.map((m, idx) => (
                <div
                  key={m.milestone_id || idx}
                  className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">
                        {idx + 1}
                      </span>
                      <span>{m.title}</span>
                    </div>
                    {m.description && <p className="text-stone-600 text-xs pl-8">{m.description}</p>}
                  </div>

                  <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400 font-bold uppercase">Due Date</div>
                      <div className="font-bold text-stone-700">{m.due_date || 'Pending'}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">No milestones created yet.</div>
            )}
          </div>
        </div>
      )}

      {/* 3. Tasks */}
      {activeSubTab === 'tasks' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-stone-900">Sprint Tasks & Squad Assignments</h3>
              <p className="text-xs text-stone-500">Granular work items for student researchers and industry mentors</p>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {collab.tasks && collab.tasks.length > 0 ? (
              collab.tasks.map((t, idx) => (
                <div
                  key={t.task_id || idx}
                  className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'HIGH' || t.priority === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-200 text-stone-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-bold text-stone-500">{t.status}</span>
                  </div>
                  <div className="font-bold text-stone-900">{t.title}</div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1 border-t border-stone-100">
                    <User className="w-3 h-3 text-stone-400" />
                    <span>Assigned: {t.assigned_to}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center text-stone-400 text-xs">No tasks active.</div>
            )}
          </div>
        </div>
      )}

      {/* 4. Team */}
      {activeSubTab === 'team' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-black text-stone-900">Collaboration Personnel & Roles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {collab.members && collab.members.length > 0 ? (
              collab.members.map((m, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <div className="font-bold text-stone-900">{m.name}</div>
                  <div className="text-emerald-700 font-semibold">{m.role}</div>
                  <div className="text-stone-500 text-[11px]">{m.institution}</div>
                </div>
              ))
            ) : (
              <div className="col-span-3 p-8 text-center text-stone-400 text-xs">
                Squad: {collab.student_squad_name} • Faculty Mentor: {collab.mentor}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Documents */}
      {activeSubTab === 'documents' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-stone-900">Technical Documents & MoUs</h3>
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="space-y-2">
            {collab.documents && collab.documents.length > 0 ? (
              collab.documents.map((d, idx) => (
                <div
                  key={d.doc_id || idx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-stone-900">{d.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {d.file_type} • Version {d.version}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-400">{d.upload_date}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">No documents uploaded yet.</div>
            )}
          </div>
        </div>
      )}

      {/* 6. Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-black text-stone-900">Audit & Activity Timeline</h3>
          <div className="relative border-l-2 border-emerald-800/20 ml-3 space-y-4 pl-4 text-xs">
            {collab.activity_timeline && collab.activity_timeline.length > 0 ? (
              collab.activity_timeline.map((act, idx) => (
                <div key={act.event_id || idx} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-700 border-2 border-white" />
                  <div className="font-bold text-stone-900">{act.action}</div>
                  <div className="text-stone-600 text-xs">{act.description}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {act.user} • {act.date}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-stone-400">Collaboration created on {collab.start_date}</div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPDATE PROGRESS MODAL */}
      {/* ========================================================================= */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Update Sprint Progress</h3>
              <button
                onClick={() => setIsProgressModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusOrProgress} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">
                  Overall Completion Progress ({newProgress}%)
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

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Current Phase</label>
                <input
                  type="text"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                  placeholder="e.g. Field Sensor Calibration, PCB Fabrication..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Collaboration Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900"
                >
                  {['REQUESTED', 'APPROVED', 'ACTIVE', 'PROTOTYPE', 'TESTING', 'COMPLETED', 'DEPLOYED', 'CANCELLED'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProgressModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold shadow-xs disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD MILESTONE MODAL */}
      {/* ========================================================================= */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Add Joint Milestone</h3>
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  placeholder="e.g. Prototype Telemetry Live Testing at Ranchi Dam"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Description / Deliverables</label>
                <textarea
                  rows={3}
                  value={mDesc}
                  onChange={(e) => setMDesc(e.target.value)}
                  placeholder="Hardware specs, LoRa gateway setup..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Target Due Date</label>
                <input
                  type="date"
                  value={mDue}
                  onChange={(e) => setMDue(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold shadow-xs disabled:opacity-50"
                >
                  {isUpdating ? 'Adding...' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD TASK MODAL */}
      {/* ========================================================================= */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Assign Sprint Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Task Description</label>
                <input
                  type="text"
                  required
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  placeholder="e.g. Calibrate pH sensor with standard buffer solution"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Assignee</label>
                <input
                  type="text"
                  value={tAssigned}
                  onChange={(e) => setTAssigned(e.target.value)}
                  placeholder="e.g. Rohan Sharma (Student Squad Lead)"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Priority</label>
                <select
                  value={tPriority}
                  onChange={(e) => setTPriority(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Assigning...' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD DOCUMENT MODAL */}
      {/* ========================================================================= */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Upload Technical Document</h3>
              <button onClick={() => setIsDocModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. LoRaWAN Telemetry Protocol & Architecture Doc"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  <option value="Technical Specification">Technical Specification</option>
                  <option value="MoU / Legal Agreement">MoU / Legal Agreement</option>
                  <option value="Circuit Schematic / Gerber">Circuit Schematic / Gerber</option>
                  <option value="Field Trial Log">Field Trial Log</option>
                  <option value="Financial & CSR Grant Report">Financial & CSR Grant Report</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Recording...' : 'Attach Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
