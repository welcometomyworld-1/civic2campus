import React, { useState } from 'react';
import {
  StudentSquad,
  SquadMember,
  SquadMilestone,
  SquadTask,
  FieldTestRecord,
  SquadDocumentItem,
  SquadImpactRecord,
  StudentRole,
} from '../../types/squad';
import { squadService } from '../../services/squadService';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  Sparkles,
  Layers,
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  GraduationCap,
  FileText,
  Compass,
  Award,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Download,
  Share2,
  Send,
  Zap,
  TrendingUp,
  MapPin,
  Tag,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SquadDetailViewProps {
  squad: StudentSquad;
  onBack: () => void;
  onEdit: (squad: StudentSquad) => void;
  onSquadUpdated: (updated: StudentSquad) => void;
}

export const SquadDetailView: React.FC<SquadDetailViewProps> = ({
  squad,
  onBack,
  onEdit,
  onSquadUpdated,
}) => {
  const { addNotification } = useApp();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'members'
    | 'problem'
    | 'ai-brief'
    | 'project'
    | 'milestones'
    | 'tasks'
    | 'progress'
    | 'mentor'
    | 'industry'
    | 'documents'
    | 'field-testing'
    | 'impact'
    | 'timeline'
  >('overview');

  // Sub-modals
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddFieldTestOpen, setIsAddFieldTestOpen] = useState(false);
  const [isAddDocOpen, setIsAddDocOpen] = useState(false);
  const [isUpdateImpactOpen, setIsUpdateImpactOpen] = useState(false);
  const [isUpdatePhaseOpen, setIsUpdatePhaseOpen] = useState(false);

  // Form states for sub-modals
  const [newMember, setNewMember] = useState<SquadMember>({
    student_id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    email: '',
    department: 'CSE',
    year: 3,
    skills: [],
    role: 'DEVELOPER',
  });
  const [newSkillInput, setNewSkillInput] = useState('');

  const [newMilestone, setNewMilestone] = useState<SquadMilestone>({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    responsible_member: squad.members[0]?.name || '',
    status: 'IN_PROGRESS',
    progress: 50,
  });

  const [newTask, setNewTask] = useState<SquadTask>({
    title: '',
    description: '',
    assigned_member: squad.members[0]?.name || '',
    priority: 'HIGH',
    due_date: new Date().toISOString().split('T')[0],
    status: 'TODO',
  });

  const [newFieldTest, setNewFieldTest] = useState<FieldTestRecord>({
    location: squad.problem_location || 'Ranchi Ground Zero',
    date: new Date().toISOString().split('T')[0],
    objective: '',
    participants: [squad.team_leader_name || squad.members[0]?.name || 'Squad Lead'],
    observed_results: '',
    issues_found: '',
    feedback: '',
    photos_videos: [],
    status: 'COMPLETED',
  });

  const [newDoc, setNewDoc] = useState<SquadDocumentItem>({
    name: '',
    type: 'Project reports',
    version: '1.0',
    url: '#',
  });

  const [impactForm, setImpactForm] = useState<SquadImpactRecord>({
    people_benefited: squad.impact?.people_benefited || 5000,
    area_covered: squad.impact?.area_covered || 'Jharkhand District',
    problem_resolution_percentage: squad.impact?.problem_resolution_percentage || 75,
    cost_saved: squad.impact?.cost_saved || '₹2,50,000',
    time_saved: squad.impact?.time_saved || '30 Days',
    environmental_impact: squad.impact?.environmental_impact || 'Reduced environmental footprint',
    community_feedback: squad.impact?.community_feedback || 'Positive feedback received from panchayat',
    deployment_date: squad.impact?.deployment_date || new Date().toISOString().split('T')[0],
  });

  const [selectedPhase, setSelectedPhase] = useState(squad.current_phase);
  const [selectedProgress, setSelectedProgress] = useState(squad.progress);

  // Status badges & phases
  const phases = [
    { id: 'PROBLEM_ANALYSIS', label: '1. Problem Analysis' },
    { id: 'RESEARCH', label: '2. Research' },
    { id: 'DESIGN', label: '3. Design' },
    { id: 'PROTOTYPE', label: '4. Prototype' },
    { id: 'TESTING', label: '5. Testing' },
    { id: 'FIELD_TRIAL', label: '6. Field Trial' },
    { id: 'DEPLOYMENT', label: '7. Deployment' },
    { id: 'COMPLETED', label: '8. Completed' },
  ];

  const currentPhaseIdx = phases.findIndex((p) => p.id === squad.current_phase);

  // Sub-handlers
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;
    const skills = newSkillInput.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = await squadService.addMember(squad.squad_id, { ...newMember, skills });
    if (updated) {
      addNotification('Student Added', `${newMember.name} joined squad ${squad.squad_id}.`, 'match');
      onSquadUpdated(updated);
      setIsAddMemberOpen(false);
      setNewMember({
        student_id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        email: '',
        department: 'CSE',
        year: 3,
        skills: [],
        role: 'DEVELOPER',
      });
      setNewSkillInput('');
    }
  };

  const handleRemoveMember = async (studentId: string) => {
    if (squad.members.length === 1) {
      alert('Cannot remove the last member of the squad.');
      return;
    }
    if (confirm(`Are you sure you want to remove student ID ${studentId} from this squad?`)) {
      const updated = await squadService.removeMember(squad.squad_id, studentId);
      if (updated) {
        addNotification('Student Removed', `Student ${studentId} was removed from squad roster.`, 'alert');
        onSquadUpdated(updated);
      }
    }
  };

  const handleAddMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.title) return;
    const updated = await squadService.addMilestone(squad.squad_id, newMilestone);
    if (updated) {
      addNotification('Milestone Created', `Milestone '${newMilestone.title}' added.`, 'match');
      onSquadUpdated(updated);
      setIsAddMilestoneOpen(false);
      setNewMilestone({
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        responsible_member: squad.members[0]?.name || '',
        status: 'IN_PROGRESS',
        progress: 50,
      });
    }
  };

  const handleToggleMilestoneComplete = async (milestone: SquadMilestone) => {
    const nextStatus = milestone.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    const nextProgress = nextStatus === 'COMPLETED' ? 100 : 60;
    const updated = await squadService.updateMilestone(squad.squad_id, milestone.id!, {
      status: nextStatus as any,
      progress: nextProgress,
    });
    if (updated) {
      onSquadUpdated(updated);
    }
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const updated = await squadService.addTask(squad.squad_id, newTask);
    if (updated) {
      addNotification('Task Assigned', `Task '${newTask.title}' assigned to ${newTask.assigned_member}.`, 'match');
      onSquadUpdated(updated);
      setIsAddTaskOpen(false);
      setNewTask({
        title: '',
        description: '',
        assigned_member: squad.members[0]?.name || '',
        priority: 'HIGH',
        due_date: new Date().toISOString().split('T')[0],
        status: 'TODO',
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: any) => {
    const updated = await squadService.updateTask(squad.squad_id, taskId, { status: newStatus });
    if (updated) {
      onSquadUpdated(updated);
    }
  };

  const handleAddFieldTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldTest.objective) return;
    const updated = await squadService.addFieldTest(squad.squad_id, newFieldTest);
    if (updated) {
      addNotification('Field Test Logged', `Field trial at ${newFieldTest.location} recorded.`, 'match');
      onSquadUpdated(updated);
      setIsAddFieldTestOpen(false);
      setNewFieldTest({
        location: squad.problem_location || 'Ranchi Ground Zero',
        date: new Date().toISOString().split('T')[0],
        objective: '',
        participants: [squad.team_leader_name || squad.members[0]?.name || 'Squad Lead'],
        observed_results: '',
        issues_found: '',
        feedback: '',
        photos_videos: [],
        status: 'COMPLETED',
      });
    }
  };

  const handleAddDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name) return;
    const updated = await squadService.addDocument(squad.squad_id, newDoc);
    if (updated) {
      addNotification('Document Registered', `Uploaded '${newDoc.name}'.`, 'match');
      onSquadUpdated(updated);
      setIsAddDocOpen(false);
      setNewDoc({
        name: '',
        type: 'Project reports',
        version: '1.0',
        url: '#',
      });
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (confirm('Delete this document from squad repository?')) {
      const updated = await squadService.deleteDocument(squad.squad_id, docId);
      if (updated) {
        onSquadUpdated(updated);
      }
    }
  };

  const handleUpdatePhaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await squadService.updateSquad(squad.squad_id, {
      current_phase: selectedPhase,
      progress: selectedProgress,
    });
    if (updated) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      addNotification('Phase Advanced', `Squad advanced to ${selectedPhase} (${selectedProgress}%).`, 'match');
      onSquadUpdated(updated);
      setIsUpdatePhaseOpen(false);
    }
  };

  const handleUpdateImpactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await squadService.updateSquad(squad.squad_id, {
      impact: impactForm,
    });
    if (updated) {
      addNotification('Impact Updated', 'Community impact metrics recorded in state matrix.', 'match');
      onSquadUpdated(updated);
      setIsUpdateImpactOpen(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'members', label: `Team Members (${squad.members.length})`, icon: Users },
    { id: 'problem', label: 'Assigned Problem', icon: MapPin },
    { id: 'ai-brief', label: 'AI R&D Brief', icon: Sparkles },
    { id: 'project', label: 'Project Scope', icon: FolderGit2 },
    { id: 'milestones', label: `Milestones (${squad.milestones.length})`, icon: CheckCircle2 },
    { id: 'tasks', label: `Tasks (${squad.tasks.length})`, icon: Clock },
    { id: 'progress', label: `Progress (${squad.progress}%)`, icon: TrendingUp },
    { id: 'mentor', label: 'Faculty Mentor', icon: GraduationCap },
    { id: 'industry', label: 'Industry & CSR', icon: Building2 },
    { id: 'documents', label: `Documents (${squad.documents.length})`, icon: FileText },
    { id: 'field-testing', label: `Field Trials (${squad.field_testing.length})`, icon: Compass },
    { id: 'impact', label: 'Impact Metrics', icon: Award },
    { id: 'timeline', label: `Timeline (${squad.activity_timeline.length})`, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Back to Squads List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-[#141414] text-amber-300">
                {squad.squad_id}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {squad.status}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                Phase: <strong className="text-stone-900">{squad.current_phase}</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {squad.name}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsUpdatePhaseOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Update Phase ({squad.progress}%)</span>
          </button>
          <button
            onClick={() => onEdit(squad)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all border border-stone-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Squad</span>
          </button>
        </div>
      </div>

      {/* 14 Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs font-bold shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-900 text-amber-300 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Visual Phase Pipeline Progress */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>Engineering Lifecycle Phase Pipeline</span>
                </h3>
                <p className="text-xs text-stone-500">8 Stage Field Prototype & Accreditation Tracker</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-800">{squad.progress}%</span>
                <div className="text-[10px] text-stone-400 font-semibold uppercase">Overall Progress</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
              {phases.map((p, idx) => {
                const isPassed = idx < currentPhaseIdx;
                const isCurrent = idx === currentPhaseIdx;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-900 text-amber-300 border-emerald-950 shadow-md ring-2 ring-amber-400'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-bold'
                        : 'bg-stone-50 text-stone-400 border-stone-200'
                    }`}
                  >
                    <div className="text-xs mb-1">
                      {isPassed ? '✅' : isCurrent ? '🟡' : '⚪'}
                    </div>
                    <div className="text-[11px] font-bold leading-tight">{p.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Snapshot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Team Lead Card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Team Leadership</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-base font-black text-stone-900">
                  👑 {squad.team_leader_name || squad.members[0]?.name || 'To be assigned'}
                </div>
                <div className="text-xs text-stone-500">
                  {squad.members.length} Multidisciplinary Student Engineers
                </div>
              </div>
              <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl">
                <strong>Departments:</strong> {squad.members.map((m) => m.department).join(', ')}
              </div>
            </div>

            {/* Mentor & Industry Card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Faculty & Industry Mentors</span>
                <GraduationCap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-1 text-xs">
                <div>🧑‍🏫 <strong>Faculty:</strong> {squad.faculty_mentor_name}</div>
                <div>🏢 <strong>Partner:</strong> {squad.industry_partner_name || 'Open'}</div>
                <div>💰 <strong>Grant:</strong> <span className="font-bold text-emerald-800">{squad.funding_received}</span></div>
              </div>
            </div>

            {/* Field Impact Card */}
            <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                <span>Field Impact Telemetry</span>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div className="space-y-1 text-xs">
                <div>👥 <strong>Beneficiaries:</strong> {squad.impact?.people_benefited?.toLocaleString() || '12,500'} Citizens</div>
                <div>🗺️ <strong>Coverage:</strong> {squad.impact?.area_covered || squad.problem_location}</div>
                <div>✅ <strong>Resolution:</strong> {squad.impact?.problem_resolution_percentage || 75}% Verified</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: TEAM MEMBERS */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">Squad Members Roster</h3>
              <p className="text-xs text-stone-500">
                Manage roles, assignments, and ensure zero conflicting team assignments
              </p>
            </div>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {squad.members.map((member, idx) => (
              <div
                key={member.student_id || idx}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-4 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatar_url ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${member.student_id}`
                      }
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl bg-emerald-50 object-cover border border-stone-200"
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900">{member.name}</h4>
                      <div className="text-[11px] font-mono text-stone-400">{member.student_id}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      member.role === 'TEAM_LEADER'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl">
                  <div>🎓 <strong>Dept:</strong> {member.department} (Year {member.year})</div>
                  {member.email && <div>✉️ <strong>Email:</strong> {member.email}</div>}
                  {member.current_task && (
                    <div className="pt-1 border-t border-stone-200/60 text-[11px]">
                      <strong>Current Task:</strong> <span className="text-stone-800">{member.current_task}</span>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase text-stone-400 mb-1">Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((s) => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
                  <button
                    onClick={() => handleRemoveMember(member.student_id)}
                    className="text-stone-400 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3 & 4: ASSIGNED PROBLEM & AI R&D BRIEF */}
      {/* ========================================================================= */}
      {(activeTab === 'problem' || activeTab === 'ai-brief') && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 p-6 rounded-3xl border border-amber-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI R&D Brief & Problem Matrix</span>
              </span>
              <span className="font-bold text-xs text-stone-600">
                Problem Category: <strong className="text-stone-900">{squad.problem_category || 'Civic'}</strong>
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-stone-900">{squad.problem_title || 'Civic Problem Statement'}</h3>
              <p className="text-xs text-stone-600 mt-1">Location: {squad.problem_location} • Priority: {squad.problem_priority}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Problem Statement & Current Situation</h4>
              <p className="text-xs text-stone-800 leading-relaxed">
                {squad.description || 'Severe rural infrastructure and public utility gap requiring rapid prototyping and field telemetry.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Research Question</h4>
              <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                How can low-power solar IoT nodes coupled with solid-state sensors provide reliable ground telemetry without requiring costly commercial cellular infrastructure?
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Required Expertise & Tech Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {(squad.technologies || ['IoT', 'FastAPI', 'GIS']).map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-bold text-xs border border-emerald-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Expected Community Impact</h4>
              <p className="text-xs text-stone-800 leading-relaxed">
                {squad.expected_outcome || 'Accredited working prototype providing real-time alerts to district administration and gram panchayats.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: PROJECT SCOPE & OBJECTIVES */}
      {/* ========================================================================= */}
      {activeTab === 'project' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div>
            <h3 className="text-lg font-black text-stone-900">Project Deliverables & Milestones Scope</h3>
            <p className="text-xs text-stone-500">Technical charter approved by faculty mentor and industry partner</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">Deliverable Objectives</h4>
            {(squad.objectives || []).map((obj, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: MILESTONES */}
      {/* ========================================================================= */}
      {activeTab === 'milestones' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">Squad Milestones</h3>
              <p className="text-xs text-stone-500">Track key prototype deliverables and due dates</p>
            </div>
            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="space-y-3">
            {squad.milestones.map((m) => (
              <div
                key={m.id}
                className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {m.status}
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-900">{m.title}</h4>
                  </div>
                  {m.description && <p className="text-xs text-stone-600">{m.description}</p>}
                  <div className="text-[11px] text-stone-400 flex items-center gap-3 pt-1">
                    <span>📅 Due: {m.due_date}</span>
                    {m.responsible_member && <span>👤 Responsible: {m.responsible_member}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-black text-emerald-800">{m.progress}%</div>
                  </div>
                  <button
                    onClick={() => handleToggleMilestoneComplete(m)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1 ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{m.status === 'COMPLETED' ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: TASKS */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">Task Management Board</h3>
              <p className="text-xs text-stone-500">Assign and track granular engineering tasks</p>
            </div>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Task</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['TODO', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED'].map((colStatus) => {
              const colTasks = squad.tasks.filter((t) => t.status === colStatus);
              return (
                <div key={colStatus} className="bg-stone-100/80 p-4 rounded-3xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-stone-700">{colStatus}</span>
                    <span className="w-5 h-5 rounded-full bg-white text-stone-900 font-bold text-[10px] flex items-center justify-center shadow-2xs">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.map((task) => (
                      <div key={task.id} className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            task.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            task.priority === 'HIGH' ? 'bg-amber-100 text-amber-900' :
                            'bg-stone-100 text-stone-600'
                          }`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">{task.due_date}</span>
                        </div>
                        <h5 className="font-extrabold text-stone-900 leading-snug">{task.title}</h5>
                        {task.description && <p className="text-[11px] text-stone-500 line-clamp-2">{task.description}</p>}
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-stone-700">👤 {task.assigned_member}</span>
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id!, e.target.value)}
                            className="text-[10px] font-bold bg-stone-50 rounded border border-stone-200 px-1 py-0.5"
                          >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="BLOCKED">BLOCKED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 10: INDUSTRY COLLABORATION */}
      {/* ========================================================================= */}
      {activeTab === 'industry' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span>Industry & CSR Mentorship</span>
              </h3>
              <p className="text-xs text-stone-500">Corporate engineering collaboration and funding partnership</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
              Grant: {squad.funding_received}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="text-[10px] font-bold uppercase text-stone-400">Partner Company</div>
              <div className="text-base font-black text-stone-900">{squad.industry_partner_name || 'Open for Match'}</div>
              <div><strong>Support Type:</strong> {squad.industry_support_type || 'TECHNOLOGY'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="text-[10px] font-bold uppercase text-stone-400">Industry Mentor</div>
              <div className="text-base font-black text-stone-900">{squad.industry_partner_mentor || 'Mr. Rajiv Singhania'}</div>
              <div><strong>Designation:</strong> {squad.industry_partner_designation || 'Principal IoT Architect'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 11: DOCUMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">Project Documents & CAD Repository</h3>
              <p className="text-xs text-stone-500">Research papers, PCB schematics, and field survey files</p>
            </div>
            <button
              onClick={() => setIsAddDocOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {squad.documents.map((doc) => (
              <div key={doc.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase">
                    <span>{doc.type}</span>
                    <span>v{doc.version}</span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm mt-1">{doc.name}</h4>
                  <div className="text-[11px] text-stone-500 mt-1">Uploaded by {doc.uploaded_by} on {doc.upload_date}</div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={doc.url || '#'}
                    onClick={(e) => { e.preventDefault(); alert(`Downloading: ${doc.name}`); }}
                    className="text-emerald-800 hover:text-emerald-950 font-bold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                  <button
                    onClick={() => handleDeleteDoc(doc.id!)}
                    className="text-stone-400 hover:text-red-700 text-xs font-semibold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 12: FIELD TESTING */}
      {/* ========================================================================= */}
      {activeTab === 'field-testing' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg font-black text-stone-900">Field Testing & Ground Validations</h3>
              <p className="text-xs text-stone-500">Live test logs recorded across Jharkhand villages</p>
            </div>
            <button
              onClick={() => setIsAddFieldTestOpen(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Log Field Test</span>
            </button>
          </div>

          <div className="space-y-4">
            {squad.field_testing.map((ft) => (
              <div key={ft.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">📍 {ft.location}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {ft.status}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-stone-900">{ft.objective}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-2xl">
                  <div><strong>Observed Results:</strong> {ft.observed_results}</div>
                  <div><strong>Feedback:</strong> {ft.feedback}</div>
                </div>
                <div className="text-[11px] text-stone-400">Date: {ft.date} • Participants: {ft.participants.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 13: IMPACT */}
      {/* ========================================================================= */}
      {activeTab === 'impact' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900">Post-Deployment Community Impact</h3>
              <p className="text-xs text-stone-500">Measured outcomes across target civic matrix</p>
            </div>
            <button
              onClick={() => setIsUpdateImpactOpen(true)}
              className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-200 cursor-pointer"
            >
              Update Impact Metrics
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-2xl font-black text-emerald-900">{squad.impact?.people_benefited?.toLocaleString() || '12,500'}</div>
              <div className="text-[10px] font-bold text-emerald-700 uppercase mt-1">People Benefited</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-2xl font-black text-blue-900">{squad.impact?.problem_resolution_percentage || 75}%</div>
              <div className="text-[10px] font-bold text-blue-700 uppercase mt-1">Problem Resolution</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <div className="text-2xl font-black text-amber-900">{squad.impact?.cost_saved || '₹3,40,000'}</div>
              <div className="text-[10px] font-bold text-amber-700 uppercase mt-1">Cost Saved</div>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
              <div className="text-2xl font-black text-purple-900">{squad.impact?.time_saved || '45 Days'}</div>
              <div className="text-[10px] font-bold text-purple-700 uppercase mt-1">Time Saved</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 14: TIMELINE */}
      {/* ========================================================================= */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <div>
            <h3 className="text-lg font-black text-stone-900">Squad Activity Timeline</h3>
            <p className="text-xs text-stone-500">Immutable chronological audit log of milestones and updates</p>
          </div>

          <div className="space-y-4 border-l-2 border-emerald-700/30 pl-5 ml-2">
            {squad.activity_timeline.map((act) => (
              <div key={act.id} className="relative space-y-1 text-xs">
                <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-emerald-700 ring-4 ring-white" />
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-stone-900">{act.action}</span>
                  <span className="text-[10px] text-stone-400 font-mono">• {act.date}</span>
                </div>
                <p className="text-stone-600">{act.description}</p>
                <div className="text-[10px] font-bold text-stone-400">By: {act.user}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL: ADD MEMBER */}
      {/* ========================================================================= */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Add Student to Squad</h3>
              <button onClick={() => setIsAddMemberOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Department</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="Civil & Env">Civil & Env</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as StudentRole })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                  >
                    <option value="DEVELOPER">DEVELOPER</option>
                    <option value="RESEARCHER">RESEARCHER</option>
                    <option value="DESIGNER">DESIGNER</option>
                    <option value="DATA_ANALYST">DATA_ANALYST</option>
                    <option value="DOMAIN_SPECIALIST">DOMAIN_SPECIALIST</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="e.g. IoT, Embedded C, Python"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold shadow-xs"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL: ADD MILESTONE */}
      {/* ========================================================================= */}
      {isAddMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Add Project Milestone</h3>
              <button onClick={() => setIsAddMilestoneOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddMilestoneSubmit} className="space-y-3">
              <div>
                <label className="block font-bold mb-1">Milestone Title *</label>
                <input
                  type="text"
                  required
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g. 72-hr Telemetry Stability Test"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Due Date</label>
                <input
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Responsible Student</label>
                <select
                  value={newMilestone.responsible_member}
                  onChange={(e) => setNewMilestone({ ...newMilestone, responsible_member: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                >
                  {squad.members.map((m) => (
                    <option key={m.student_id} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold shadow-xs"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL: UPDATE PHASE & PROGRESS */}
      {/* ========================================================================= */}
      {isUpdatePhaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black">Update Engineering Phase</h3>
              <button onClick={() => setIsUpdatePhaseOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUpdatePhaseSubmit} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Target Phase</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                >
                  {phases.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">
                  Overall Completion Progress: <strong className="text-emerald-800">{selectedProgress}%</strong>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedProgress}
                  onChange={(e) => setSelectedProgress(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdatePhaseOpen(false)}
                  className="px-4 py-2 rounded-xl border font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-900 text-amber-300 font-bold shadow-xs"
                >
                  Confirm Advancement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
