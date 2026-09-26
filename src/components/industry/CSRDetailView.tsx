import React, { useState, useEffect } from 'react';
import {
  Coins,
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  FolderGit2,
  Calendar,
  Building2,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  Plus,
  Send,
  Download,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CSRFundingItem, CSRStatus } from '../../types/industry';
import { industryService } from '../../services/industryService';

interface CSRDetailViewProps {
  fundingId: string;
  onBack: () => void;
}

export const CSRDetailView: React.FC<CSRDetailViewProps> = ({ fundingId, onBack }) => {
  const [funding, setFunding] = useState<CSRFundingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'impact' | 'documents' | 'timeline'>('overview');
  const [actionLoading, setActionLoading] = useState(false);
  const [customNote, setCustomNote] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await industryService.getCSRFundingById(fundingId);
      setFunding(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load CSR funding details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fundingId]);

  const handleStatusChange = async (newStatus: CSRStatus) => {
    if (!funding) return;
    setActionLoading(true);
    try {
      const updated = await industryService.updateCSRStatus(
        funding.id || funding.funding_id,
        newStatus,
        customNote || `Status changed to ${newStatus}`
      );
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setFunding(updated);
      setCustomNote('');
    } catch (e) {
      alert('Failed to update status on server.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Loading CSR Grant Details...</p>
      </div>
    );
  }

  if (error || !funding) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
        <p className="text-xs text-rose-800 font-bold">{error || 'Record not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 cursor-pointer"
        >
          Back to List
        </button>
      </div>
    );
  }

  const percentDisbursed = Math.round(((funding.amount_released || 0) / funding.amount) * 100);

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CSR Funding List</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 uppercase">
            {funding.funding_id || 'CSR-GRANT'}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            {funding.support_type}
          </span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                Status: {funding.status}
              </span>
              <span className="text-xs text-stone-400 font-medium">• Pledged on {funding.funding_date}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
              {funding.project_name}
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
              <strong>Community Problem:</strong> {funding.problem_name}
            </p>
          </div>

          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 min-w-[260px] space-y-2 shrink-0">
            <div className="text-[11px] font-bold text-stone-500 uppercase">Grant Allocation</div>
            <div className="text-3xl font-black text-stone-900">₹{funding.amount.toLocaleString()}</div>
            <div className="text-xs text-emerald-700 font-bold">
              ₹{(funding.amount_released || 0).toLocaleString()} Disbursed ({percentDisbursed}%)
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${percentDisbursed}%` }} />
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 font-medium">
            Authorized Industry Actions:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusChange('APPROVED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Approve Grant
            </button>
            <button
              onClick={() => handleStatusChange('COMMITTED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Mark Committed
            </button>
            <button
              onClick={() => handleStatusChange('RELEASED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Release Tranche
            </button>
            <button
              onClick={() => handleStatusChange('COMPLETED')}
              disabled={actionLoading}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
            >
              Mark Completed
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Purpose' },
          { id: 'milestones', label: 'Grant Milestones & Tranches' },
          { id: 'impact', label: 'Beneficiaries & Field Impact' },
          { id: 'documents', label: 'Executed MoUs & Audits' },
          { id: 'timeline', label: 'Audit Timeline' },
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

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 mb-1">Grant Purpose & Objective</h3>
              <p className="text-xs text-stone-700 leading-relaxed">{funding.purpose || 'Co-funding student R&D squad field trials and hardware telemetry installation.'}</p>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-stone-900 mb-1">Notes & Governance Terms</h3>
              <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-200">
                {funding.notes || 'Subject to Ministry of Corporate Affairs Section 135 CSR guidelines with quarterly audited fund utilization certificates (Form CSR-1/2).'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="text-[10px] text-emerald-700 font-bold uppercase">Tax Exemption Status</div>
                <div className="text-xs font-black text-emerald-950 mt-0.5">80G / 12A Certified Academic Grant</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-[10px] text-blue-700 font-bold uppercase">Fund Release Mechanism</div>
                <div className="text-xs font-black text-blue-950 mt-0.5">Milestone Linked Direct University Account</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
            <h3 className="text-sm font-extrabold text-stone-900">Stakeholder Details</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Partner University</div>
                <div className="font-bold text-stone-900">{funding.university_name}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Funding Entity</div>
                <div className="font-bold text-stone-900">{funding.industry_name}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Deployment Location</div>
                <div className="font-bold text-stone-900">{funding.deployment_location || 'Jharkhand'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-stone-900">Grant Tranches & Milestones</h3>
              <p className="text-xs text-stone-500">Fund disbursements released upon student squad deliverable validation</p>
            </div>
          </div>

          <div className="space-y-3">
            {funding.milestones?.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  m.completed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.completed ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {m.completed ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{m.title}</h4>
                    <div className="text-[10px] text-stone-500">Target Due: {m.due_date || 'Pending Schedule'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-stone-900">
                    ₹{(m.amount_allocated || 0).toLocaleString()}
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      m.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {m.completed ? 'Disbursed' : 'Awaiting Deliverable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Impact */}
      {activeTab === 'impact' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">Field Telemetry & Beneficiary Reach</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-center">
              <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <div className="text-2xl font-black text-purple-950">
                {(funding.impact?.people_benefited || 1240).toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-700 font-bold uppercase mt-0.5">Citizens Impacted</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="text-base font-black text-blue-950 truncate mt-1">
                {funding.impact?.area_covered || 'Toto Block, Gumla'}
              </div>
              <div className="text-[10px] text-blue-700 font-bold uppercase mt-0.5">Geographic Coverage</div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-base font-black text-emerald-950 truncate mt-1">
                {funding.impact?.environmental_benefit || 'Clean Water & Low Carbon'}
              </div>
              <div className="text-[10px] text-emerald-700 font-bold uppercase mt-0.5">ESG Benefit</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900">CSR Grant Agreements & Utilization Reports</h3>
          </div>

          <div className="space-y-2">
            {(funding.documents || [
              { id: 'd1', name: 'Executed_CSR_Sanction_Order.pdf', url: '/uploads/CSR_Sanction.pdf', uploaded_at: '2026-05-15' }
            ]).map((d, i) => (
              <div key={d.id || i} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div>
                    <div className="text-xs font-bold text-stone-800">{d.name}</div>
                    <div className="text-[10px] text-stone-400">Uploaded {d.uploaded_at?.split('T')[0]}</div>
                  </div>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="text-sm font-extrabold text-stone-900">Audit & Decision History</h3>
          <div className="space-y-3">
            {funding.activity_timeline?.map((a, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
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
    </div>
  );
};
