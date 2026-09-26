import React, { useState, useEffect } from 'react';
import {
  Wrench,
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  Layers,
  Plus,
  Send,
  AlertCircle,
  FileText,
  TrendingUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TechSupportItem, TechSupportStatus } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface TechSupportDetailViewProps {
  supportId: string;
  onBack: () => void;
}

export const TechSupportDetailView: React.FC<TechSupportDetailViewProps> = ({ supportId, onBack }) => {
  const [support, setSupport] = useState<TechSupportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'expert' | 'documents' | 'timeline'>('tasks');
  const [actionLoading, setActionLoading] = useState(false);

  // New Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assigned_to: '', due_date: '' });

  // Progress Update
  const [newProgress, setNewProgress] = useState(50);
  const [mentorshipNote, setMentorshipNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await industryService.getTechSupportById(supportId);
      setSupport(data);
      setNewProgress(data.progress || 50);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load technical support details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supportId]);

  const handleStatusChange = async (st: TechSupportStatus) => {
    if (!support) return;
    setActionLoading(true);
    try {
      const updated = await industryService.updateTechSupportStatus(
        support.id || support.support_id,
        st,
        mentorshipNote || `Status updated to ${st}`
      );
      confetti({ particleCount: 40, spread: 50 });
      setSupport(updated);
      setMentorshipNote('');
    } catch (e) {
      alert('Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProgressSave = async () => {
    if (!support) return;
    setActionLoading(true);
    try {
      const updated = await industryService.updateTechSupport(support.id || support.support_id, {
        progress: newProgress,
        timeline_note: mentorshipNote ? `Progress updated to ${newProgress}%: ${mentorshipNote}` : undefined
      });
      setSupport(updated);
      setMentorshipNote('');
      alert('Progress updated successfully!');
    } catch (e) {
      alert('Failed to update progress.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!support || !newTask.title) return;
    try {
      const updated = await industryService.addTechSupportTask(support.id || support.support_id, {
        title: newTask.title,
        assigned_to: newTask.assigned_to || support.assigned_expert || 'Engineer',
        due_date: newTask.due_date || new Date().toISOString().split('T')[0]
      });
      setSupport(updated);
      setIsTaskModalOpen(false);
      setNewTask({ title: '', assigned_to: '', due_date: '' });
    } catch (e) {
      alert('Failed to add task.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Loading Technical Support Engagement...</p>
      </div>
    );
  }

  if (error || !support) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
        <p className="text-xs text-rose-800 font-bold">{error || 'Engagement not found'}</p>
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
          <span>Back to Tech Support Hub</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 uppercase">
            {support.support_id || 'TECH-ENGAGEMENT'}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            {support.support_type}
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                Status: {support.status}
              </span>
              <span className="text-xs text-stone-400 font-medium">• {support.start_date} to {support.target_date}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {support.project_name}
            </h1>
            <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                {support.university_name}
              </span>
              <span>• Squad: <strong className="text-stone-800">{support.student_squad_name || 'Engineering Squad'}</strong></span>
            </div>
          </div>

          {/* Quick Progress Slider Card */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 min-w-[280px] space-y-3 shrink-0">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-600">Sprint Progress</span>
              <span className="font-black text-blue-700 text-base">{newProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={newProgress}
              onChange={(e) => setNewProgress(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <button
              onClick={handleProgressSave}
              disabled={actionLoading}
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Save Progress
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            Engagement Status:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('APPROVED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Approve Support
            </button>
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Set In Progress
            </button>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'tasks', label: `Technical Tasks (${support.tasks?.length || 0})` },
          { id: 'expert', label: 'Assigned Mentors & Lab Access' },
          { id: 'documents', label: 'Architecture Docs & Schematics' },
          { id: 'timeline', label: 'Sprint Activity Log' },
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

      {/* Tab: Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">Sprint Technical Tasks</h3>
              <p className="text-xs text-stone-500">Milestone deliverables monitored by industry mentor</p>
            </div>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {support.tasks?.map((task, idx) => (
              <div
                key={task.id || idx}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      task.completed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {task.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{task.title}</h4>
                    <div className="text-[10px] text-stone-500">
                      Assigned to: <strong className="text-stone-700">{task.assigned_to || 'Squad Lead'}</strong> • Due: {task.due_date || 'Ongoing'}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {task.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Expert */}
      {activeTab === 'expert' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Industry Expert Mentor Profile</h3>
          <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center font-black text-lg">
                {support.assigned_expert ? support.assigned_expert.charAt(0) : 'E'}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-stone-900">{support.assigned_expert || 'Corporate Engineering Lead'}</h4>
                <div className="text-xs text-amber-900 font-bold">{support.assigned_expert_title || 'Lead Sustainability Engineer'}</div>
                <div className="text-xs text-stone-500">{support.assigned_expert_email || 'csr.mentor@tatasteel.com'}</div>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed pt-2 border-t border-amber-200/60">
              Conducting weekly sprint architectural reviews, PCB schematic evaluations, and facilitating corporate telemetry testing lab access for the student engineering squad.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Technical Architecture Documents</h3>
          <div className="space-y-2">
            {(support.documents || [
              { id: 'd1', name: 'Hardware_Firmware_Architecture.pdf', url: '/uploads/Hardware_Firmware.pdf', uploaded_at: '2026-06-01' }
            ]).map((d, idx) => (
              <div key={d.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-stone-800">{d.name}</span>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Sprint Mentorship Timeline</h3>
          <div className="space-y-3">
            {support.activity_timeline?.map((a, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
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

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Add Technical Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center cursor-pointer text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct thermal stress testing on solar battery"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Assignee</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sen / Squad Lead"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer shadow-xs"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
