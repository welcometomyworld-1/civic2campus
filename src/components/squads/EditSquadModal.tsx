import React, { useState } from 'react';
import {
  StudentSquad,
  SquadStatus,
  SquadPhase,
} from '../../types/squad';
import { squadService } from '../../services/squadService';
import { useApp } from '../../context/AppContext';
import {
  X,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface EditSquadModalProps {
  isOpen: boolean;
  squad: StudentSquad | null;
  onClose: () => void;
  onSquadUpdated: (updated: StudentSquad) => void;
  onSquadDeleted?: (squadId: string) => void;
}

export const EditSquadModal: React.FC<EditSquadModalProps> = ({
  isOpen,
  squad,
  onClose,
  onSquadUpdated,
  onSquadDeleted,
}) => {
  const { addNotification } = useApp();

  if (!isOpen || !squad) return null;

  const [name, setName] = useState(squad.name);
  const [description, setDescription] = useState(squad.description || '');
  const [projectName, setProjectName] = useState(squad.project_name || '');
  const [teamLeaderName, setTeamLeaderName] = useState(squad.team_leader_name || '');
  const [facultyMentorName, setFacultyMentorName] = useState(squad.faculty_mentor_name || '');
  const [facultyMentorEmail, setFacultyMentorEmail] = useState(squad.faculty_mentor_email || '');
  const [industryPartnerName, setIndustryPartnerName] = useState(squad.industry_partner_name || '');
  const [industryMentor, setIndustryMentor] = useState(squad.industry_partner_mentor || '');
  const [fundingReceived, setFundingReceived] = useState(squad.funding_received || '₹0');
  const [researchArea, setResearchArea] = useState(squad.research_area || '');
  const [technologiesStr, setTechnologiesStr] = useState((squad.technologies || []).join(', '));
  const [objectivesStr, setObjectivesStr] = useState((squad.objectives || []).join('\n'));
  const [expectedOutcome, setExpectedOutcome] = useState(squad.expected_outcome || '');
  const [status, setStatus] = useState<SquadStatus>(squad.status);
  const [currentPhase, setCurrentPhase] = useState<SquadPhase>(squad.current_phase);
  const [progress, setProgress] = useState<number>(squad.progress);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Squad name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const techList = technologiesStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const objList = objectivesStr
        .split('\n')
        .map((o) => o.trim())
        .filter(Boolean);

      const updatePayload: Partial<StudentSquad> = {
        name,
        description,
        project_name: projectName,
        team_leader_name: teamLeaderName,
        faculty_mentor_name: facultyMentorName,
        faculty_mentor_email: facultyMentorEmail,
        industry_partner_name: industryPartnerName,
        industry_partner_mentor: industryMentor,
        funding_received: fundingReceived,
        research_area: researchArea,
        technologies: techList,
        objectives: objList,
        expected_outcome: expectedOutcome,
        status,
        current_phase: currentPhase,
        progress,
      };

      const updated = await squadService.updateSquad(squad.squad_id, updatePayload);
      if (updated) {
        addNotification(
          'Squad Updated',
          `Squad '${updated.name}' (${updated.squad_id}) was successfully updated.`,
          'match'
        );
        onSquadUpdated(updated);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update squad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await squadService.deleteSquad(squad.squad_id);
      addNotification(
        'Squad Disbanded & Removed',
        `Squad '${squad.name}' (${squad.squad_id}) has been removed.`,
        'alert'
      );
      if (onSquadDeleted) onSquadDeleted(squad.squad_id);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to delete squad.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-[32px] shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-900 font-bold flex items-center justify-center text-sm font-mono">
              {squad.squad_id}
            </div>
            <div>
              <h2 className="text-xl font-black">Edit Squad: {squad.name}</h2>
              <p className="text-xs text-stone-400">Update metadata, milestones, mentorship, or lifecycle status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800">
            {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleUpdate} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Squad Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Squad Mission / Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          {/* Status & Phase Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Squad Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SquadStatus)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="DISBANDED">DISBANDED</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Current Engineering Phase</label>
              <select
                value={currentPhase}
                onChange={(e) => setCurrentPhase(e.target.value as SquadPhase)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-emerald-950"
              >
                <option value="PROBLEM_ANALYSIS">PROBLEM_ANALYSIS</option>
                <option value="RESEARCH">RESEARCH</option>
                <option value="DESIGN">DESIGN</option>
                <option value="PROTOTYPE">PROTOTYPE</option>
                <option value="TESTING">TESTING</option>
                <option value="FIELD_TRIAL">FIELD_TRIAL</option>
                <option value="DEPLOYMENT">DEPLOYMENT</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Progress: <span className="text-emerald-800 font-extrabold">{progress}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* Mentors & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Team Leader Name</label>
              <input
                type="text"
                value={teamLeaderName}
                onChange={(e) => setTeamLeaderName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Faculty Mentor Name</label>
              <input
                type="text"
                value={facultyMentorName}
                onChange={(e) => setFacultyMentorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Industry Partner</label>
              <input
                type="text"
                value={industryPartnerName}
                onChange={(e) => setIndustryPartnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Industry Mentor</label>
              <input
                type="text"
                value={industryMentor}
                onChange={(e) => setIndustryMentor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">Funding Received</label>
              <input
                type="text"
                value={fundingReceived}
                onChange={(e) => setFundingReceived(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Technologies (comma-separated)</label>
            <input
              type="text"
              value={technologiesStr}
              onChange={(e) => setTechnologiesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Key Objectives (1 per line)</label>
            <textarea
              rows={2}
              value={objectivesStr}
              onChange={(e) => setObjectivesStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          {/* Delete Danger Zone */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Destructive Action</span>
                </h4>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Disband and delete this squad. This will clear active tasks and squad assignment.
                </p>
              </div>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[11px] transition-colors cursor-pointer"
                >
                  Delete Squad...
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 rounded-lg text-[11px] font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-[11px] cursor-pointer shadow-xs"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-amber-300 font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
