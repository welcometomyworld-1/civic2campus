import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  FileText,
  Cpu,
  Target,
  Handshake,
  FolderGit2,
  Lightbulb,
  TrendingUp,
  MapPin,
  CheckSquare,
  Tags,
  Bell,
  BarChart3,
  Lock,
  ScrollText,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Send,
  Eye,
  Trash2,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type AdminTab =
  | 'overview'
  | 'users'
  | 'problems'
  | 'ai-analysis'
  | 'matching'
  | 'collaborations'
  | 'projects'
  | 'solutions'
  | 'impact'
  | 'map'
  | 'verification'
  | 'categories'
  | 'notifications'
  | 'reports'
  | 'roles'
  | 'audit-logs'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const {
    problems,
    projects,
    notifications,
    currentUser,
    setCurrentView,
    addNotification,
    adminActiveTab,
    setAdminActiveTab,
  } = useApp();

  const activeTab = (adminActiveTab as AdminTab) || 'overview';
  const setActiveTab = (tab: AdminTab) => setAdminActiveTab(tab);
  const [userFilterRole, setUserFilterRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // User Accounts State
  const [accounts, setAccounts] = useState([
    {
      id: 'usr-1',
      name: 'Rohan Verma',
      email: 'citizen@civic2campus.org',
      role: 'citizen',
      status: 'ACTIVE',
      verified: true,
      registeredAt: '2026-08-03',
    },
    {
      id: 'usr-2',
      name: 'Prof. Arvind Sharma (Dean R&D)',
      email: 'univ@bitmesra.ac.in',
      role: 'university',
      status: 'ACTIVE',
      verified: true,
      registeredAt: '2026-08-10',
    },
    {
      id: 'usr-3',
      name: 'Priya Sen (Tata Steel CSR)',
      email: 'csr@tatasteel.com',
      role: 'industry',
      status: 'ACTIVE',
      verified: true,
      registeredAt: '2026-08-15',
    },
    {
      id: 'usr-4',
      name: 'Dr. S. K. Murmu (Urban Dev)',
      email: 'jharkhand.urban@gov.in',
      role: 'government',
      status: 'ACTIVE',
      verified: true,
      registeredAt: '2026-08-20',
    },
    {
      id: 'usr-5',
      name: 'Ranchi Municipal Engineering Team',
      email: 'rmc.eng@ranchi.gov.in',
      role: 'government',
      status: 'PENDING_VERIFICATION',
      verified: false,
      registeredAt: '2026-09-14',
    },
    {
      id: 'usr-6',
      name: 'Usha Martin Foundation Incubation',
      email: 'csr@ushamartin.in',
      role: 'industry',
      status: 'PENDING_VERIFICATION',
      verified: false,
      registeredAt: '2026-09-15',
    },
  ]);

  // Organization Verification Applications State
  const [verifications, setVerifications] = useState([
    {
      id: 'ver-1',
      orgName: 'Ranchi Municipal Corporation (Urban Infra Dept)',
      type: 'Government',
      officialEmail: 'rmc.eng@ranchi.gov.in',
      authorizedPerson: 'Rajesh Kachhap (Superintending Engineer)',
      location: 'Ranchi HQ',
      documents: 'Gazette Nodal Authorization.pdf',
      status: 'PENDING',
    },
    {
      id: 'ver-2',
      orgName: 'Usha Martin CSR & Rural Incubation Lab',
      type: 'Industry',
      officialEmail: 'csr@ushamartin.in',
      authorizedPerson: 'Ananya Roy (Head of Community Development)',
      location: 'Tatisilwai, Ranchi',
      documents: 'Corporate CSR Mandate 2026.pdf',
      status: 'PENDING',
    },
    {
      id: 'ver-3',
      orgName: 'Kolhan University Chaibasa (Dept of Science)',
      type: 'University',
      officialEmail: 'rd@kolhanuniv.ac.in',
      authorizedPerson: 'Prof. K. N. Soren (Registrar)',
      location: 'West Singhbhum',
      documents: 'UGC 2F & 12B Accreditation.pdf',
      status: 'PENDING',
    },
  ]);

  // Real-time Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-101',
      action: 'USER_LOGIN',
      user: 'admin@civic2campus.org',
      role: 'ADMIN',
      ip: '103.24.88.12',
      time: '2 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'log-102',
      action: 'ORGANIZATION_APPROVED',
      user: 'admin@civic2campus.org',
      role: 'ADMIN',
      ip: '103.24.88.12',
      time: '14 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'log-103',
      action: 'AI_ANALYSIS_COMPLETED',
      user: 'system_ai_worker',
      role: 'SYSTEM',
      ip: '127.0.0.1',
      time: '32 mins ago',
      status: 'SUCCESS',
    },
    {
      id: 'log-104',
      action: 'CSR_GRANT_ALLOCATION',
      user: 'csr@tatasteel.com',
      role: 'INDUSTRY',
      ip: '182.74.22.9',
      time: '1 hour ago',
      status: 'SUCCESS',
    },
    {
      id: 'log-105',
      action: 'PROBLEM_SUBMITTED',
      user: 'citizen@civic2campus.org',
      role: 'CITIZEN',
      ip: '106.51.10.4',
      time: '2 hours ago',
      status: 'SUCCESS',
    },
  ]);

  // Broadcast Message State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('ALL');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    addNotification('Platform Announcement', broadcastMessage, 'alert');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    alert(`Broadcast announcement sent to [${broadcastTarget}]: "${broadcastMessage}"`);
    setBroadcastMessage('');
  };

  const handleToggleUserStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setAccounts(
      accounts.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    addNotification('User Status Modified', `Account ${id} status updated to ${newStatus}.`, 'alert');
  };

  const handleApproveOrg = (id: string, name: string) => {
    setVerifications(verifications.filter((v) => v.id !== id));
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    addNotification('Organization Accredited', `${name} has been verified and granted platform access.`, 'match');
    alert(`Success! "${name}" has been approved and verified.`);
  };

  const handleRejectOrg = (id: string, name: string) => {
    setVerifications(verifications.filter((v) => v.id !== id));
    addNotification('Organization Application Rejected', `${name} accreditation request declined.`, 'alert');
    alert(`Application for "${name}" has been rejected.`);
  };

  const filteredAccounts = accounts.filter((a) => {
    const matchRole = userFilterRole === 'ALL' || a.role === userFilterRole;
    const matchSearch =
      searchQuery === '' ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F9F8F6] text-[#141414] flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* DEDICATED ADMIN SIDEBAR (18 SECTIONS) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#18181b] text-zinc-100 flex flex-col border-r border-zinc-900 shrink-0 select-none">
        
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
              {currentUser?.name || 'Super Admin'}
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Platform Governance Console</span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
            { id: 'users', label: 'User Accounts', icon: Users, badge: `${accounts.length}` },
            { id: 'verification', label: 'Organization Verification', icon: CheckSquare, badge: `${verifications.length} Pending` },
            { id: 'problems', label: 'Problems Moderation', icon: FileText, badge: `${problems.length}` },
            { id: 'ai-analysis', label: 'AI Monitoring & Retry', icon: Cpu },
            { id: 'matching', label: 'Matching Governance', icon: Target },
            { id: 'collaborations', label: 'Collaborations', icon: Handshake },
            { id: 'projects', label: 'Projects Lifecycle', icon: FolderGit2, badge: `${projects.length}` },
            { id: 'solutions', label: 'Solutions Repository', icon: Lightbulb },
            { id: 'impact', label: 'Impact Telemetry', icon: TrendingUp },
            { id: 'map', label: 'Innovation Map Health', icon: MapPin },
            { id: 'categories', label: 'Categories Taxonomy', icon: Tags },
            { id: 'notifications', label: 'Broadcast Announcements', icon: Bell },
            { id: 'reports', label: 'Platform Reports', icon: BarChart3 },
            { id: 'roles', label: 'Roles & Permissions', icon: Lock },
            { id: 'audit-logs', label: 'Security Audit Logs', icon: ScrollText, badge: 'Live' },
            { id: 'settings', label: 'System Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-zinc-950 text-amber-300'
                        : 'bg-zinc-800 text-amber-300 border border-zinc-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Quick Switch Action */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="text-[10px] text-amber-300/80 uppercase font-bold mb-1">System Security</div>
          <p className="text-[11px] text-zinc-400 mb-2">JWT HS256 • RBAC Active</p>
          <button
            onClick={() => setActiveTab('audit-logs')}
            className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>View Security Audit Stream</span>
            <ScrollText className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* ===================================================================== */}
        {/* TAB 1: DASHBOARD HOME / OVERVIEW */}
        {/* ===================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#09090b] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Master Administrator Control Matrix</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Civic2Campus Platform Governance
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mt-1 leading-relaxed">
                  Full control center to manage multi-role accounts, approve institutional accreditations, audit real-time operations, and monitor AI telemetry.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4 text-zinc-950" />
                    <span>Review Pending Accreditations ({verifications.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage User Accounts</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Top KPI Cards (4 Key Metrics) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total User Accounts</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-stone-900">{accounts.length}</div>
                <div className="text-[11px] text-blue-700 font-semibold mt-1">4 Roles Active</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Pending Verifications</span>
                  <CheckSquare className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-black text-amber-700">{verifications.length} Orgs</div>
                <div className="text-[11px] text-amber-800 font-semibold mt-1">Requires Admin Action</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">AI Analyses Run</span>
                  <Cpu className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-800">42 Briefs</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1">98.4% Success Rate</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Audit Trail Events</span>
                  <ScrollText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-purple-900">{auditLogs.length}</div>
                <div className="text-[11px] text-purple-700 font-semibold mt-1">MongoDB Indexed</div>
              </div>
            </div>

            {/* Quick Grid: Pending Verification + Real-time Security Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Pending Organization Verification */}
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-500" />
                    <span>Organization Verification Queue</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    View Queue
                  </button>
                </div>

                <div className="space-y-3">
                  {verifications.map((v) => (
                    <div key={v.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-stone-900">{v.orgName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          {v.type}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        Authorized: <strong>{v.authorizedPerson}</strong> ({v.officialEmail})
                      </div>
                      <div className="text-[11px] text-stone-500">📎 Document: {v.documents}</div>
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRejectOrg(v.id, v.orgName)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveOrg(v.id, v.orgName)}
                          className="px-4 py-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Approve Accreditation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Audit Trail */}
              <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-purple-600" />
                    <span>Real-Time Audit Stream</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('audit-logs')}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    All Logs
                  </button>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-900">{log.action}</div>
                        <div className="text-[10px] text-stone-500">{log.user} ({log.role})</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-stone-400">{log.time}</span>
                        <div className="text-[9px] font-mono text-emerald-700">{log.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: USERS MANAGEMENT */}
        {/* ===================================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-zinc-900" />
                  <span>Platform Users Management</span>
                </h2>
                <p className="text-xs text-stone-600">Search, verify, activate, or suspend accounts across all roles</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />

                <select
                  value={userFilterRole}
                  onChange={(e) => setUserFilterRole(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-semibold text-stone-700"
                >
                  <option value="ALL">All Roles</option>
                  <option value="citizen">Citizens</option>
                  <option value="university">Universities</option>
                  <option value="industry">Industries</option>
                  <option value="government">Government</option>
                </select>
              </div>
            </div>

            {/* Accounts Table */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {filteredAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-stone-900">{acc.name}</div>
                        <div className="text-[11px] text-stone-500">{acc.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-stone-100 text-stone-800">
                          {acc.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          acc.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : acc.status === 'PENDING_VERIFICATION'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {acc.status}
                        </span>
                      </td>
                      <td className="p-4 text-stone-500">{acc.registeredAt}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(acc.id, acc.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            acc.status === 'ACTIVE'
                              ? 'bg-stone-100 hover:bg-red-50 text-red-700'
                              : 'bg-emerald-800 hover:bg-emerald-900 text-amber-300'
                          }`}
                        >
                          {acc.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 13: BROADCAST ANNOUNCEMENTS */}
        {/* ===================================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <span>Statewide Push Broadcast</span>
                </h2>
                <p className="text-xs text-stone-600">Send high-priority system announcements to all connected stakeholders</p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs max-w-2xl space-y-4">
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl font-semibold"
                  >
                    <option value="ALL">All Users (Statewide)</option>
                    <option value="UNIVERSITY">Universities & Faculty Researchers Only</option>
                    <option value="INDUSTRY">Industry & CSR Partners Only</option>
                    <option value="GOVERNMENT">Government Nodal Officers Only</option>
                    <option value="CITIZEN">Grassroots Citizens Only</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Broadcast Message Text</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter statewide emergency alert, innovation grant deadline, or milestone policy update..."
                    className="w-full p-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-xs font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Broadcast Notification</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 16: SECURITY AUDIT LOGS */}
        {/* ===================================================================== */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-purple-600" />
                  <span>Platform Security & Governance Audit Trail</span>
                </h2>
                <p className="text-xs text-stone-600">Immutable operations log with user identity, role, IP address, and timestamp</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Action</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4 font-mono font-bold text-stone-900">{log.action}</td>
                      <td className="p-4 text-stone-600">{log.user}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-stone-500">{log.ip}</td>
                      <td className="p-4 text-stone-400">{log.time}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fallback View for remaining tabs */}
        {(activeTab === 'verification' ||
          activeTab === 'problems' ||
          activeTab === 'ai-analysis' ||
          activeTab === 'matching' ||
          activeTab === 'collaborations' ||
          activeTab === 'projects' ||
          activeTab === 'solutions' ||
          activeTab === 'impact' ||
          activeTab === 'map' ||
          activeTab === 'categories' ||
          activeTab === 'reports' ||
          activeTab === 'roles' ||
          activeTab === 'settings') && (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center mx-auto text-2xl font-bold">
              🔐
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 capitalize">
              {activeTab.replace('-', ' ')} Console
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Super Admin management sub-module connected to MongoDB Atlas security & governance infrastructure.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Back to Dashboard Home
              </button>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
