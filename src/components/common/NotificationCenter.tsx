import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Sparkles, FolderGit2, X } from 'lucide-react';

export const NotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, markNotificationRead, setCurrentView } = useApp();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 text-stone-900">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-bold text-stone-900">Civic Ecosystem Notifications</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 text-xs">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-stone-400">No active notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkUrl?.includes('workspace')) setCurrentView('workspace');
                else if (n.linkUrl?.includes('map')) setCurrentView('map');
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-stone-50/60 border-stone-100 text-stone-600'
                  : 'bg-emerald-50/40 border-emerald-200 text-stone-900 font-medium'
              } hover:border-stone-300`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5">
                  {n.type === 'match' && <Sparkles className="w-4 h-4 text-sky-600" />}
                  {n.type === 'funding' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                  {n.type === 'deploy' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {n.type === 'progress' && <FolderGit2 className="w-4 h-4 text-amber-600" />}
                  {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold truncate">{n.title}</span>
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{n.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-stone-100 flex justify-between items-center text-[11px] text-stone-500">
        <span>Statewide automated triggers</span>
        <button
          onClick={() => {
            notifications.forEach((n) => markNotificationRead(n.id));
          }}
          className="text-emerald-700 hover:text-emerald-800 font-semibold"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
