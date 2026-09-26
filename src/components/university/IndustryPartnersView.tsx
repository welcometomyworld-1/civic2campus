import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Handshake,
  DollarSign,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Send,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { IndustryPartner } from '../../types/university';
import { universityService } from '../../services/universityService';
import { useApp } from '../../context/AppContext';

export const IndustryPartnersView: React.FC = () => {
  const { projects } = useApp();
  const [partners, setPartners] = useState<IndustryPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedIndustryType, setSelectedIndustryType] = useState('ALL');
  const [selectedSupportType, setSelectedSupportType] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Modals
  const [selectedPartner, setSelectedPartner] = useState<IndustryPartner | null>(null);
  const [requestModalPartner, setRequestModalPartner] = useState<IndustryPartner | null>(null);
  const [collabProjectId, setCollabProjectId] = useState('');
  const [collabProposalText, setCollabProposalText] = useState('');
  const [collabSupportType, setCollabSupportType] = useState('FUNDING');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await universityService.listIndustryPartners({
        search: search || undefined,
        industry_type: selectedIndustryType !== 'ALL' ? selectedIndustryType : undefined,
        support_type: selectedSupportType !== 'ALL' ? selectedSupportType : undefined,
        location: selectedLocation !== 'ALL' ? selectedLocation : undefined,
      });
      setPartners(res.items || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load industry partners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [selectedIndustryType, selectedSupportType, selectedLocation]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPartners();
  };

  const handleSendCollabRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalPartner) return;
    setIsSubmitting(true);
    setRequestSuccess(null);
    try {
      await universityService.requestIndustryCollaboration(requestModalPartner.id, {
        project_id: collabProjectId || 'general-r-and-d',
        support_type: collabSupportType,
        proposal: collabProposalText || `Joint R&D and CSR co-funding request with ${requestModalPartner.name}`,
      });
      setRequestSuccess(`Collaboration request successfully submitted to ${requestModalPartner.name}!`);
      setTimeout(() => {
        setRequestModalPartner(null);
        setRequestSuccess(null);
        setCollabProposalText('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportTypeOptions = [
    'TECHNOLOGY',
    'MENTORSHIP',
    'FUNDING',
    'CSR',
    'INFRASTRUCTURE',
    'R&D',
    'TRAINING',
    'INTERNSHIP',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Industry & CSR Co-Innovation Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Industry & CSR Partners Directory
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Discover verified corporate partners, CSR foundations, and industrial mentors supporting Jharkhand civic tech and student capstone prototypes.
            </p>
          </div>
          <button
            onClick={fetchPartners}
            className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Directory</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search partner name, expertise, IoT tech, CSR priority area..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-stone-900"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
              Industry Domain
            </label>
            <select
              value={selectedIndustryType}
              onChange={(e) => setSelectedIndustryType(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Domains</option>
              <option value="Manufacturing">Manufacturing & Heavy Industry</option>
              <option value="Energy">Energy & Mining</option>
              <option value="IT">Information Technology & AI</option>
              <option value="Agriculture">Agri-tech & Water Solutions</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
              Support Offering
            </label>
            <select
              value={selectedSupportType}
              onChange={(e) => setSelectedSupportType(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Support Types</option>
              {supportTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
              Geographic Focus
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="ALL">All Locations</option>
              <option value="Jamshedpur">Jamshedpur</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Bokaro">Bokaro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-700">Loading industry & CSR partners directory...</p>
          <p className="text-xs text-stone-400">Connecting to live MongoDB industrial database</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="text-sm font-bold">Failed to load partners</div>
              <div className="text-xs text-red-600 mt-0.5">{error}</div>
            </div>
          </div>
          <button
            onClick={fetchPartners}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && partners.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">No industry partners found</h3>
          <p className="text-xs text-stone-500">
            No corporate entities match your active filters. Try clearing your search keywords or broadening the location.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedIndustryType('ALL');
              setSelectedSupportType('ALL');
              setSelectedLocation('ALL');
              fetchPartners();
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Partner Cards Grid */}
      {!loading && !error && partners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-emerald-600/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header: Logo / Avatar + Name + Verification */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-[#043327] text-amber-300 flex items-center justify-center font-black text-lg shadow-xs shrink-0 border border-emerald-700/50">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        partner.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-stone-900 leading-tight group-hover:text-emerald-800 transition-colors">
                        {partner.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-stone-500">{partner.industry_type}</span>
                      </div>
                    </div>
                  </div>
                  {partner.is_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold shrink-0">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* CSR Focus */}
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400">CSR Focus Area:</div>
                  <p className="line-clamp-2 leading-relaxed text-stone-800">{partner.csr_focus}</p>
                </div>

                {/* Location + Funding info */}
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{partner.location || `${partner.city}, ${partner.state}`}</span>
                  </div>
                  {partner.active_funding && (
                    <div className="flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md">
                      <DollarSign className="w-3 h-3" />
                      <span>{partner.active_funding}</span>
                    </div>
                  )}
                </div>

                {/* Support Tags */}
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 mb-1.5">
                    Support Available:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {partner.support_available?.map((sup) => (
                      <span
                        key={sup}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200/60 rounded text-[10px] font-extrabold"
                      >
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-center">
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <div className="text-xs font-black text-stone-900">{partner.collaboration_count}</div>
                    <div className="text-[10px] text-stone-500 font-semibold">Active Collabs</div>
                  </div>
                  <div className="p-2 bg-stone-50 rounded-xl">
                    <div className="text-xs font-black text-stone-900">{partner.supported_projects_count}</div>
                    <div className="text-[10px] text-stone-500 font-semibold">Supported Projects</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedPartner(partner)}
                  className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setRequestModalPartner(partner);
                    setCollabProjectId(projects[0]?.id || '');
                  }}
                  className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Handshake className="w-3.5 h-3.5" />
                  <span>Request Collab</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW PARTNER PROFILE MODAL */}
      {/* ========================================================================= */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-[#043327] text-amber-300 flex items-center justify-center font-black text-2xl shadow-sm">
                  {selectedPartner.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900">{selectedPartner.name}</h2>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <span>{selectedPartner.industry_type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedPartner.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-1">
                  CSR Mandate & Priority Focus
                </h4>
                <p className="text-stone-700 bg-stone-50 p-3.5 rounded-2xl leading-relaxed">
                  {selectedPartner.csr_focus}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">
                    Core Technical Expertise
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPartner.expertise?.map((exp) => (
                      <span key={exp} className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg text-xs font-bold">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">
                    Technologies Supported
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPartner.technologies?.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">
                  Institutional Contact Officer
                </h4>
                <div className="bg-emerald-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-amber-300">{selectedPartner.contact_person}</div>
                    <div className="text-xs text-emerald-200">{selectedPartner.designation}</div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <a
                      href={`mailto:${selectedPartner.email}`}
                      className="flex items-center gap-1.5 text-emerald-100 hover:text-white underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedPartner.email}</span>
                    </a>
                    <a
                      href={`tel:${selectedPartner.phone}`}
                      className="flex items-center gap-1.5 text-emerald-100 hover:text-white"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{selectedPartner.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {selectedPartner.supported_projects && selectedPartner.supported_projects.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-2">
                    Active Co-Sponsored Projects in Jharkhand
                  </h4>
                  <div className="space-y-2">
                    {selectedPartner.supported_projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-stone-900">{proj.title}</div>
                          <div className="text-stone-500 text-[11px]">{proj.domain}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-extrabold text-[10px]">
                            {proj.stage}
                          </span>
                          <div className="text-stone-600 font-semibold text-[11px] mt-0.5">{proj.budget}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPartner(null)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setRequestModalPartner(selectedPartner);
                  setSelectedPartner(null);
                }}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Handshake className="w-4 h-4" />
                <span>Initiate MoU Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REQUEST COLLABORATION MODAL */}
      {/* ========================================================================= */}
      {requestModalPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Handshake className="w-4 h-4 text-emerald-700" />
                <span>Request Collaboration with {requestModalPartner.name}</span>
              </h3>
              <button
                onClick={() => setRequestModalPartner(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div className="text-sm font-extrabold text-emerald-900">Request Sent Successfully</div>
                <div className="text-xs text-emerald-700">{requestSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleSendCollabRequest} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                    Select University Project
                  </label>
                  <select
                    value={collabProjectId}
                    onChange={(e) => setCollabProjectId(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.district})
                      </option>
                    ))}
                    <option value="general-r-and-d">General Institutional R&D Lab Collaboration</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                    Requested Support Type
                  </label>
                  <select
                    value={collabSupportType}
                    onChange={(e) => setCollabSupportType(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {supportTypeOptions.map((sup) => (
                      <option key={sup} value={sup}>
                        {sup} Support
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-500 block mb-1">
                    Collaboration Proposal & Scope
                  </label>
                  <textarea
                    rows={4}
                    value={collabProposalText}
                    onChange={(e) => setCollabProposalText(e.target.value)}
                    placeholder="Describe the problem, proposed student squad participation, mentorship requirements, and anticipated community outcome..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRequestModalPartner(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
