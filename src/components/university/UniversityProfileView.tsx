import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit3,
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Cpu,
  FlaskConical,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { UniversityProfile } from '../../types/university';
import { universityService } from '../../services/universityService';

export const UniversityProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UniversityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UniversityProfile>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Logo upload state
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await universityService.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load university profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await universityService.updateProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoUrlInput.trim()) return;
    try {
      const updated = await universityService.updateProfile({
        logo: logoUrlInput,
        university_logo: logoUrlInput
      });
      setProfile(updated);
      setFormData((prev) => ({
        ...prev,
        logo: logoUrlInput,
        university_logo: logoUrlInput
      }));
      setIsLogoModalOpen(false);
      setLogoUrlInput('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update logo');
    }
  };

  const handleArrayFieldChange = (field: keyof UniversityProfile, value: string) => {
    const items = value.split(',').map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const logoSrc = profile?.logo || profile?.university_logo;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Accreditation & Research Profile</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              University Profile Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Manage your institution's departments, specialized laboratories, verified faculty mentors, and industry collaboration focus areas.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchProfile}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile || {});
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>University institutional profile successfully updated in MongoDB!</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin mx-auto" />
          <p className="text-sm font-bold text-stone-700">Loading university profile...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="text-sm font-bold">Failed to load profile</div>
              <div className="text-xs text-red-600 mt-0.5">{error}</div>
            </div>
          </div>
          <button
            onClick={fetchProfile}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Profile Sections (View & Edit Mode) */}
      {!loading && profile && (
        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs sm:text-sm">
          
          {/* SECTION 1: BASIC INFORMATION & LOGO */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>1. Basic Institutional Information</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-800 to-[#043327] text-amber-300 flex items-center justify-center font-black text-3xl shadow-md shrink-0 border border-emerald-700/50 overflow-hidden">
                {logoSrc ? (
                  <img src={logoSrc} alt={profile.name} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                    University Official Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900"
                    />
                  ) : (
                    <div className="font-extrabold text-stone-900 text-base">{profile.name}</div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                    Official Institutional Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900"
                    />
                  ) : (
                    <div className="font-semibold text-stone-700 flex items-center gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                    Contact Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900"
                    />
                  ) : (
                    <div className="font-semibold text-stone-700 flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                    Institutional Website
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900"
                    />
                  ) : (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-800 hover:underline flex items-center gap-1.5 mt-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{profile.website}</span>
                    </a>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                    Institutional Mission & R&D Overview
                  </label>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
                    />
                  ) : (
                    <p className="text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-2xl">
                      {profile.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: LOCATION & GEOSPATIAL */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>2. Campus Location & Geospatial Coordinates</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="font-semibold text-stone-800">{profile.address}</div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">City / District</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="font-semibold text-stone-800">{profile.city}, {profile.district}</div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">State / Country</label>
                <div className="font-semibold text-stone-800">{profile.state}, {profile.country}</div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">Latitude / Longitude</label>
                <div className="font-mono text-stone-700">{profile.latitude}, {profile.longitude}</div>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACADEMIC & DEPARTMENTS */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>3. Academic Departments & Research Domains</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1.5">
                  Departments (comma separated)
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.departments?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('departments', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.departments?.map((dept) => (
                      <span key={dept} className="px-2.5 py-1 bg-stone-100 rounded-lg text-xs font-bold text-stone-800">
                        {dept}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1.5">
                  Research Domains
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.research_domains?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('research_domains', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.research_domains?.map((dom) => (
                      <span key={dom} className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold">
                        {dom}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 4: TECHNICAL EXPERTISE & FACILITIES */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <span>4. Laboratory Facilities & Engineering Hardware</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1.5">
                  Accredited Laboratories
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.laboratories?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('laboratories', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.laboratories?.map((lab) => (
                      <span key={lab} className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-xs font-bold">
                        {lab}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1.5">
                  Equipment & Rapid Prototyping Hardware
                </label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.equipment?.join(', ') || ''}
                    onChange={(e) => handleArrayFieldChange('equipment', e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.equipment?.map((eq) => (
                      <span key={eq} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 5: CONTACT PERSON */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-black uppercase text-stone-900 tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>5. Authorized Institutional Contact Officer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                  Contact Person Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contact_person || ''}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  />
                ) : (
                  <div className="font-extrabold text-stone-900">{profile.contact_person}</div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase text-stone-400 block mb-1">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                ) : (
                  <div className="font-semibold text-emerald-800">{profile.designation}</div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button (when editing) */}
          {isEditing && (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          )}
        </form>
      )}

      {/* ========================================================================= */}
      {/* UPLOAD LOGO MODAL */}
      {/* ========================================================================= */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900">Upload University Crest / Logo</h3>
              <button onClick={() => setIsLogoModalOpen(false)} className="p-1 rounded-lg text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLogo} className="space-y-4">
              <div>
                <label className="font-bold uppercase text-stone-500 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={logoUrlInput}
                  onChange={(e) => setLogoUrlInput(e.target.value)}
                  placeholder="https://example.com/crest.png"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 rounded-xl font-bold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-amber-300 rounded-xl font-bold"
                >
                  Save Logo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
