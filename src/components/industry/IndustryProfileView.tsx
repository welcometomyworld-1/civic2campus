import React, { useState, useEffect } from 'react';
import {
  Building2,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Award,
  Sparkles,
  Save,
  X,
  Edit3,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Coins,
  Wrench,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IndustryProfile } from '../../types/industry';
import { industryService } from '../../services/industryService';

export const IndustryProfileView: React.FC = () => {
  const [profile, setProfile] = useState<IndustryProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'contact' | 'location' | 'expertise' | 'csr' | 'support'>('company');

  // Form State
  const [formData, setFormData] = useState<Partial<IndustryProfile>>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await industryService.getIndustryProfile();
      setProfile(data);
      setFormData(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load industry profile from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await industryService.updateIndustryProfile(formData);
      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      alert('Company profile updated and saved to MongoDB successfully!');
    } catch (e) {
      alert('Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    const url = prompt('Enter company logo image URL:', profile?.company_logo || '');
    if (url) {
      try {
        await industryService.updateIndustryLogo(url);
        if (profile) setProfile({ ...profile, company_logo: url });
        setFormData({ ...formData, company_logo: url });
        alert('Logo updated successfully!');
      } catch (e) {
        alert('Failed to update logo.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-stone-200 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">Loading company institutional profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-200 text-center space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-600 mx-auto" />
        <p className="text-xs text-rose-800 font-bold">{error || 'Profile not found'}</p>
        <button onClick={loadData} className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#0f172a] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={profile.company_logo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80'}
                alt={profile.company_name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md bg-white"
              />
              <button
                onClick={handleLogoUpload}
                className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-amber-300"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {profile.verification_status || 'Approved Corporate Partner'}
                </span>
                <span className="text-xs text-amber-300 font-bold">• 80G Certified</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black">{profile.company_name}</h1>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-1">{profile.description}</p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setFormData(profile); }}
                  className="px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'company', label: 'Company Information' },
          { id: 'contact', label: 'Authorized Contacts' },
          { id: 'location', label: 'Geospatial Location' },
          { id: 'expertise', label: 'Engineering Expertise' },
          { id: 'csr', label: 'CSR Focus & Domains' },
          { id: 'support', label: 'Support Available' },
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

      {/* Tab: Company Information */}
      {activeTab === 'company' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">Institutional Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-500 font-bold mb-1">Company / Foundation Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company_name || ''}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.company_name}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Industry Domain / Sector</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.industry_type || ''}
                  onChange={(e) => setFormData({ ...formData, industry_type: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.industry_type}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Official CSR Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.official_email || ''}
                  onChange={(e) => setFormData({ ...formData, official_email: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.official_email}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Official Website</label>
              {isEditing ? (
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-blue-600 p-2.5 bg-stone-50 rounded-xl truncate">{profile.website}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-500 font-bold mb-1">Corporate Mandate & CSR Description</label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="text-stone-700 leading-relaxed p-3 bg-stone-50 rounded-xl">{profile.description}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Authorized Contacts */}
      {activeTab === 'contact' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">CSR Nodal Officer & Technical Mentor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-500 font-bold mb-1">Contact Person *</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.contact_person || ''}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.contact_person}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Designation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.designation || ''}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.designation}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Official Direct Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.contact_email || profile.official_email}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Direct Phone / Mobile</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.contact_phone || profile.phone}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Location */}
      {activeTab === 'location' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">Geospatial Headquarters & Plant Coordinates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-stone-500 font-bold mb-1">Registered Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.address}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">City / District</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.city}, {profile.district}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">State & Country</label>
              <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.state}, {profile.country}</div>
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Latitude</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude || 22.8046}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.latitude}</div>
              )}
            </div>

            <div>
              <label className="block text-stone-500 font-bold mb-1">Longitude</label>
              {isEditing ? (
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude || 86.2029}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none"
                />
              ) : (
                <div className="font-bold text-stone-900 p-2.5 bg-stone-50 rounded-xl">{profile.longitude}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Expertise */}
      {activeTab === 'expertise' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">Technical Capacities & Technologies</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="text-stone-500 font-bold mb-1.5 uppercase text-[10px]">Corporate Technical Expertise</div>
              <div className="flex flex-wrap gap-2">
                {profile.expertise?.map((e, idx) => (
                  <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-800 font-bold rounded-lg">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-stone-500 font-bold mb-1.5 uppercase text-[10px]">Supported Technologies</div>
              <div className="flex flex-wrap gap-2">
                {profile.technologies?.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-900 font-bold rounded-lg border border-blue-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: CSR */}
      {activeTab === 'csr' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">CSR Focus Areas & Cause Preferences</h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="text-stone-500 font-bold mb-1.5 uppercase text-[10px]">Priority Impact Mandates</div>
              <div className="flex flex-wrap gap-2">
                {profile.csr_focus_areas?.map((f, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-950 font-bold rounded-lg border border-emerald-200">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-stone-500 font-bold mb-1.5 uppercase text-[10px]">Preferred Pilot Districts</div>
              <div className="flex flex-wrap gap-2">
                {profile.preferred_locations?.map((l, idx) => (
                  <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-950 font-bold rounded-lg border border-amber-200">
                    📍 {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Support Available */}
      {activeTab === 'support' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-stone-900">Forms of Institutional Support Provided</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {profile.support_available?.map((sup, idx) => (
              <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-extrabold text-stone-900">{sup}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
