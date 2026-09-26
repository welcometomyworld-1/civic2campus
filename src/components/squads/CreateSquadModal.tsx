import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  StudentSquad,
  SquadMember,
  StudentRole,
  IndustrySupportType,
} from '../../types/squad';
import { squadService } from '../../services/squadService';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  FolderGit2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Tag,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSquadCreated: (newSquad: StudentSquad) => void;
}

export const CreateSquadModal: React.FC<CreateSquadModalProps> = ({
  isOpen,
  onClose,
  onSquadCreated,
}) => {
  const { problems, addNotification } = useApp();

  // Step tabs
  const [activeStep, setActiveStep] = useState<
    'basic' | 'problem' | 'team' | 'academic' | 'collab' | 'project'
  >('basic');

  // Basic details
  const [squadId, setSquadId] = useState<string>('SE-004');
  const [squadName, setSquadName] = useState('');
  const [description, setDescription] = useState('');
  const [projectName, setProjectName] = useState('');

  // Community problem selection
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');

  // Team
  const [maxTeamSize, setMaxTeamSize] = useState<number>(6);
  const [members, setMembers] = useState<SquadMember[]>([
    {
      student_id: 'STU-1001',
      name: '',
      email: '',
      department: 'CSE',
      year: 4,
      skills: ['Python', 'IoT'],
      role: 'TEAM_LEADER',
      current_task: 'Initial Architecture',
    },
  ]);

  // Academic Details
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [course, setCourse] = useState('B.Tech');
  const [academicYear, setAcademicYear] = useState(4);
  const [facultyMentorName, setFacultyMentorName] = useState('Dr. Arvind Sharma');
  const [facultyMentorEmail, setFacultyMentorEmail] = useState('arvind.sharma@bitmesra.ac.in');
  const [facultyMentorDept, setFacultyMentorDept] = useState('Dept of CSE');

  // Collaboration
  const [industryPartnerName, setIndustryPartnerName] = useState('Tata Steel CSR');
  const [industryMentor, setIndustryMentor] = useState('Er. Rajiv Singhania');
  const [industrySupportType, setIndustrySupportType] = useState<IndustrySupportType>('TECHNOLOGY');
  const [fundingReceived, setFundingReceived] = useState('₹2,00,000');
  const [governmentPartner, setGovernmentPartner] = useState('Urban Development Dept, Jharkhand');
  const [externalMentor, setExternalMentor] = useState('');

  // Project Details
  const [researchArea, setResearchArea] = useState('Civic IoT & AI Telemetry');
  const [technologyInput, setTechnologyInput] = useState('Python, LoRaWAN, FastAPI, React');
  const [objectivesInput, setObjectivesInput] = useState(
    'Deploy field-tested civic telemetry hardware\nProvide instant SMS notifications\nIntegrate with state innovation portal'
  );
  const [expectedOutcome, setExpectedOutcome] = useState(
    'Accredited field prototype with 98% telemetry accuracy for community relief.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-generate next unique ID on modal open
  useEffect(() => {
    if (isOpen) {
      squadService.getSquads().then(({ total }) => {
        const nextNum = total + 1;
        setSquadId(`SE-${String(nextNum).padStart(3, '0')}`);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Selected problem metadata
  const selectedProblem = problems.find((p) => p.id === selectedProblemId);

  const handleAddMember = () => {
    if (members.length >= maxTeamSize) {
      setErrorMessage(`Maximum squad team size (${maxTeamSize}) reached.`);
      return;
    }
    const nextId = `STU-${1000 + members.length + 1}`;
    setMembers([
      ...members,
      {
        student_id: nextId,
        name: '',
        email: '',
        department: 'ECE',
        year: 3,
        skills: ['Embedded C'],
        role: 'DEVELOPER',
      },
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    if (members.length === 1) {
      setErrorMessage('Squad must contain at least 1 member (Team Leader).');
      return;
    }
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof SquadMember, value: any) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: value };
    setMembers(updated);
  };

  const handleSkillChange = (idx: number, skillStr: string) => {
    const skills = skillStr.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = [...members];
    updated[idx] = { ...updated[idx], skills };
    setMembers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!squadName.trim()) {
      setErrorMessage('Please provide a squad name.');
      setActiveStep('basic');
      return;
    }

    if (members.some((m) => !m.name.trim())) {
      setErrorMessage('Please provide names for all squad members.');
      setActiveStep('team');
      return;
    }

    setIsSubmitting(true);

    try {
      const leader = members.find((m) => m.role === 'TEAM_LEADER') || members[0];
      const techList = technologyInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const objList = objectivesInput
        .split('\n')
        .map((o) => o.trim())
        .filter(Boolean);

      const payload: Partial<StudentSquad> = {
        squad_id: squadId,
        name: squadName,
        description,
        project_name: projectName || `${squadName} Capstone`,
        problem_id: selectedProblem?.id,
        problem_title: selectedProblem?.title,
        problem_category: selectedProblem?.category,
        problem_location: selectedProblem?.district,
        problem_priority: selectedProblem?.urgency,
        ai_match_score: 92,
        team_leader_id: leader.student_id,
        team_leader_name: leader.name,
        members,
        max_team_size: maxTeamSize,
        faculty_mentor_name: facultyMentorName,
        faculty_mentor_email: facultyMentorEmail,
        faculty_mentor_department: facultyMentorDept,
        industry_partner_name: industryPartnerName,
        industry_partner_mentor: industryMentor,
        industry_support_type: industrySupportType,
        funding_received: fundingReceived,
        government_partner: governmentPartner,
        external_mentor: externalMentor,
        department,
        course,
        year: academicYear,
        research_area: researchArea,
        technologies: techList,
        objectives: objList,
        expected_outcome: expectedOutcome,
        current_phase: 'PROBLEM_ANALYSIS',
        progress: 15,
        status: 'ACTIVE',
        start_date: new Date().toISOString().split('T')[0],
      };

      const created = await squadService.createSquad(payload);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#047857', '#F9B826', '#10B981'],
      });

      addNotification(
        'Student Engineering Squad Created!',
        `Squad '${created.name}' (ID: ${created.squad_id}) was registered successfully.`,
        'match'
      );

      onSquadCreated(created);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to create squad. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Disciplinary Innovation Squad</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Create New Student Engineering Squad
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              Form an accredited student team to solve an AI-recommended community problem.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Nav Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'basic', label: '1. Basic Details', icon: FolderGit2 },
            { id: 'problem', label: '2. Community Problem', icon: Sparkles },
            { id: 'team', label: '3. Team Members', icon: Users },
            { id: 'academic', label: '4. Academic Mentor', icon: GraduationCap },
            { id: 'collab', label: '5. Industry & CSR', icon: Building2 },
            { id: 'project', label: '6. Scope & Tech', icon: Lightbulb },
          ].map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id as any)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-900 text-amber-300 shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* STEP 1: BASIC DETAILS */}
          {activeStep === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Squad ID (Auto-Generated)
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 font-mono font-bold text-emerald-900">
                    {squadId}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Unique state registered code</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                    Squad Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={squadName}
                    onChange={(e) => setSquadName(e.target.value)}
                    placeholder="e.g. Smart Water Innovation Squad"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. AI Water Quality Monitoring & Telemetry"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Squad Mission & Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem context and engineering solution the squad will build..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-normal"
                />
              </div>
            </div>
          )}

          {/* STEP 2: COMMUNITY PROBLEM */}
          {activeStep === 'problem' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">
                  Link Community Problem (AI Matched)
                </label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => setSelectedProblemId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-xs font-semibold bg-white"
                >
                  <option value="">-- Select from AI Recommended Problems --</option>
                  {problems.map((prob) => (
                    <option key={prob.id} value={prob.id}>
                      [{prob.category}] {prob.title} • {prob.district} ({prob.urgency} Priority)
                    </option>
                  ))}
                </select>
              </div>

              {selectedProblem ? (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-bold text-[10px] uppercase">
                      {selectedProblem.category}
                    </span>
                    <span className="font-bold text-emerald-800 text-[11px]">
                      Location: {selectedProblem.district}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-stone-900">
                    {selectedProblem.title}
                  </h4>
                  <p className="text-stone-700 leading-relaxed text-xs">
                    {selectedProblem.description}
                  </p>
                  <div className="pt-2 border-t border-amber-200/80 flex items-center gap-4 text-[11px] font-bold text-stone-600">
                    <div>Urgency: <strong className="text-red-700">{selectedProblem.urgency}</strong></div>
                    <div>Affected: <strong>{selectedProblem.population?.toLocaleString() || '10,000+'} Citizens</strong></div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-stone-300 text-center text-stone-500">
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-70" />
                  <p className="font-semibold">Select a community problem to attach AI R&D brief</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Or proceed to create a self-defined engineering project squad.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: TEAM MEMBERS */}
          {activeStep === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">Squad Roster</h3>
                  <p className="text-[11px] text-stone-500">
                    Max Team Size: {maxTeamSize} • Current Members: {members.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </button>
              </div>

              <div className="space-y-3">
                {members.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-stone-900 text-xs">
                          {member.role === 'TEAM_LEADER' ? '👑 Team Leader' : `Member ${idx + 1}`}
                        </span>
                      </div>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Student Name *</label>
                        <input
                          type="text"
                          required
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Student ID</label>
                        <input
                          type="text"
                          value={member.student_id}
                          onChange={(e) => handleMemberChange(idx, 'student_id', e.target.value)}
                          placeholder="e.g. STU-1001"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Department</label>
                        <select
                          value={member.department}
                          onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-semibold"
                        >
                          <option value="CSE">CSE</option>
                          <option value="ECE">ECE</option>
                          <option value="Civil & Env">Civil & Env</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="EEE">EEE</option>
                          <option value="AI & ML">AI & ML</option>
                          <option value="Chemical">Chemical</option>
                          <option value="BioTech">BioTech</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Role</label>
                        <select
                          value={member.role}
                          onChange={(e) => handleMemberChange(idx, 'role', e.target.value as StudentRole)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-bold text-emerald-950"
                        >
                          <option value="TEAM_LEADER">TEAM_LEADER</option>
                          <option value="DEVELOPER">DEVELOPER</option>
                          <option value="RESEARCHER">RESEARCHER</option>
                          <option value="DESIGNER">DESIGNER</option>
                          <option value="DATA_ANALYST">DATA_ANALYST</option>
                          <option value="DOMAIN_SPECIALIST">DOMAIN_SPECIALIST</option>
                          <option value="FIELD_COORDINATOR">FIELD_COORDINATOR</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Email Address</label>
                        <input
                          type="email"
                          value={member.email || ''}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          placeholder="student@bitmesra.ac.in"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Skills (comma-separated)</label>
                        <input
                          type="text"
                          value={member.skills.join(', ')}
                          onChange={(e) => handleSkillChange(idx, e.target.value)}
                          placeholder="IoT, Python, PCB, GIS"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: ACADEMIC DETAILS */}
          {activeStep === 'academic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Lead Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Degree / Course</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Cohort Year</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={academicYear}
                    onChange={(e) => setAcademicYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider">Faculty Mentor Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-1">Mentor Name</label>
                    <input
                      type="text"
                      value={facultyMentorName}
                      onChange={(e) => setFacultyMentorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-1">Mentor Email</label>
                    <input
                      type="email"
                      value={facultyMentorEmail}
                      onChange={(e) => setFacultyMentorEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-600 mb-1">Mentor Department</label>
                    <input
                      type="text"
                      value={facultyMentorDept}
                      onChange={(e) => setFacultyMentorDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COLLABORATION */}
          {activeStep === 'collab' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Industry Partner</label>
                  <input
                    type="text"
                    value={industryPartnerName}
                    onChange={(e) => setIndustryPartnerName(e.target.value)}
                    placeholder="e.g. Tata Steel CSR / Coal India"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Industry Mentor</label>
                  <input
                    type="text"
                    value={industryMentor}
                    onChange={(e) => setIndustryMentor(e.target.value)}
                    placeholder="e.g. Er. Rajiv Singhania (Lead Architect)"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Support Type</label>
                  <select
                    value={industrySupportType}
                    onChange={(e) => setIndustrySupportType(e.target.value as IndustrySupportType)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-emerald-950 bg-white"
                  >
                    <option value="TECHNOLOGY">TECHNOLOGY</option>
                    <option value="MENTORSHIP">MENTORSHIP</option>
                    <option value="FUNDING">FUNDING</option>
                    <option value="CSR">CSR</option>
                    <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
                    <option value="R&D">R&D</option>
                    <option value="TRAINING">TRAINING</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Funding / Grant Allocation</label>
                  <input
                    type="text"
                    value={fundingReceived}
                    onChange={(e) => setFundingReceived(e.target.value)}
                    placeholder="e.g. ₹2,50,000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Government Department Linkage</label>
                  <input
                    type="text"
                    value={governmentPartner}
                    onChange={(e) => setGovernmentPartner(e.target.value)}
                    placeholder="e.g. Drinking Water & Sanitation Dept"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">External Subject Expert / Mentor</label>
                  <input
                    type="text"
                    value={externalMentor}
                    onChange={(e) => setExternalMentor(e.target.value)}
                    placeholder="Optional expert advisor"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SCOPE & TECH */}
          {activeStep === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Research Area</label>
                <input
                  type="text"
                  value={researchArea}
                  onChange={(e) => setResearchArea(e.target.value)}
                  placeholder="e.g. IoT Water Hydrology, Solar Thermal Storage"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Required Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={technologyInput}
                  onChange={(e) => setTechnologyInput(e.target.value)}
                  placeholder="LoRaWAN, Python, Embedded C, FastAPI"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Core Deliverable Objectives (1 per line)</label>
                <textarea
                  rows={3}
                  value={objectivesInput}
                  onChange={(e) => setObjectivesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-normal"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1 uppercase tracking-wider text-[10px]">Expected Field Outcome</label>
                <textarea
                  rows={2}
                  value={expectedOutcome}
                  onChange={(e) => setExpectedOutcome(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-normal"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeStep !== 'basic' && (
                <button
                  type="button"
                  onClick={() => {
                    const steps: any[] = ['basic', 'problem', 'team', 'academic', 'collab', 'project'];
                    const idx = steps.indexOf(activeStep);
                    if (idx > 0) setActiveStep(steps[idx - 1]);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}

              {activeStep !== 'project' ? (
                <button
                  type="button"
                  onClick={() => {
                    const steps: any[] = ['basic', 'problem', 'team', 'academic', 'collab', 'project'];
                    const idx = steps.indexOf(activeStep);
                    if (idx < steps.length - 1) setActiveStep(steps[idx + 1]);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold transition-all cursor-pointer shadow-xs"
                >
                  Next Step ➔
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Registering...' : 'Register Squad'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
