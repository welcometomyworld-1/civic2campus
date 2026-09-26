import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Handshake,
  Award,
  AlertTriangle,
  Clock,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { UniversityNotificationItem } from '../../types/university';
import { universityService } from '../../services/universityService';
import { useApp } from '../../context/AppContext';

export const NotificationsHubView: React.FC = () => {
  const { setUniversityActiveTab } = useApp();
  const [notifications, setNotifications] = useState<UniversityNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'COLLABORATION' | 'SOLUTION' | 'MATCH' | 'PROJECT'>('ALL');

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await universityService.listNotifications();
      setNotifications(data.items || []);
    } catch (e) {
      console.warn('Error loading notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await universityService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
    } catch (e) {
      console.warn('Error marking read:', e);
    }
  };

  const handleMarkReadAndNavigate = async (notif: UniversityNotificationItem) => {
    try {
      await universityService.markNotificationRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true, is_read: true } : n))
      );
    } catch (e) {
      console.warn('Error marking read:', e);
    }

    // Auto-navigate based on notification type / related_type
    const t = (notif.type || '').toLowerCase();
    if (t.includes('collab')) {
      setUniversityActiveTab('active-collabs');
    } else if (t.includes('solut') || t.includes('deploy')) {
      setUniversityActiveTab('solutions');
    } else if (t.includes('match') || t.includes('problem')) {
      setUniversityActiveTab('ai-problems');
    } else if (t.includes('project') || t.includes('squad')) {
      setUniversityActiveTab('my-projects');
    } else if (t.includes('impact')) {
      setUniversityActiveTab('impact');
    }
  };

  const getIcon = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('collab')) return <Handshake className="w-4 h-4 text-amber-500" />;
    if (t.includes('deploy') || t.includes('solut')) return <Award className="w-4 h-4 text-purple-500" />;
    if (t.includes('milestone') || t.includes('due')) return <Clock className="w-4 h-4 text-blue-500" />;
    return <Sparkles className="w-4 h-4 text-emerald-500" />;
  };

  const unreadCount = notifications.filter((n) => !n.read && !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.read && !n.is_read;
    const typeStr = (n.type || '').toLowerCase();
    if (activeFilter === 'UNREAD') return isUnread;
    if (activeFilter === 'COLLABORATION') return typeStr.includes('collab');
    if (activeFilter === 'SOLUTION') return typeStr.includes('solut') || typeStr.includes('deploy');
    if (activeFilter === 'MATCH') return typeStr.includes('match') || typeStr.includes('problem');
    if (activeFilter === 'PROJECT') return typeStr.includes('project') || typeStr.includes('squad');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#043327] via-[#064e3b] to-[#04281f] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Institutional Feeds</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              University Notifications & Alerts Hub
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
              Real-time audit alerts from corporate collaboration requests, capstone sprint milestones, and field prototype telemetry events across Jharkhand.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchNotifs}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center gap-2 text-xs font-bold shadow-2xs">
        <span className="text-[10px] font-extrabold uppercase text-stone-400 mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Category Filter:</span>
        </span>
        {[
          { id: 'ALL', label: `All Alerts (${notifications.length})` },
          { id: 'UNREAD', label: `Unread (${unreadCount})` },
          { id: 'COLLABORATION', label: 'Collaborations' },
          { id: 'SOLUTION', label: 'Solutions & IoT' },
          { id: 'MATCH', label: 'AI Matches' },
          { id: 'PROJECT', label: 'Squad Projects' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-emerald-800 text-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-3">
        {loading ? (
          <div className="py-12 text-center text-stone-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-700" />
            <span>Loading notifications from MongoDB...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <div className="font-bold text-stone-700">No notifications in this category.</div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredNotifications.map((notif) => {
              const isUnread = !notif.read && !notif.is_read;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkReadAndNavigate(notif)}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs cursor-pointer hover:shadow-md hover:border-emerald-600/50 group ${
                    isUnread
                      ? 'bg-emerald-50/50 border-emerald-200 text-stone-900 shadow-2xs'
                      : 'bg-stone-50/60 border-stone-150 text-stone-600'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-white rounded-xl shadow-2xs border border-stone-100 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                          {notif.title}
                        </span>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-stone-600 text-xs leading-relaxed max-w-2xl">{notif.message}</p>
                      <div className="text-[10px] text-stone-400 font-semibold pt-0.5">
                        {notif.created_at}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <span className="text-[11px] font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>View Resource</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
