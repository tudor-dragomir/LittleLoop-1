import React from 'react';
import {
  Bell,
  Clock,
  Settings,
  X,
  Play,
  MapPin,
  CheckSquare,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { formatTimeDisplay } from '../utils/dateUtils';

export const NotificationDrawerModal: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    upcomingAlerts,
    notificationSettings,
    setIsNotificationSettingsOpen,
    setInspectActivity,
    triggerTestNotification,
    children,
    snoozeAlert,
    dismissAlert,
  } = useCalendar();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print"
      onClick={() => setIsNotificationDrawerOpen(false)}
    >
      {/* Modal dialog */}
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Activity Reminders
                </h2>
                {upcomingAlerts.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                    {upcomingAlerts.length}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Alerting {notificationSettings.leadTimeMinutes} min before start
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="notif-modal-settings-btn"
              onClick={() => {
                setIsNotificationDrawerOpen(false);
                setIsNotificationSettingsOpen(true);
              }}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Adjust Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              id="notif-modal-close-btn"
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body: Activity Alert Items */}
        <div className="overflow-y-auto flex-1 min-h-0 p-3 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
          {upcomingAlerts.length === 0 ? (
            <div className="py-8 px-4 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No activities starting soon
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-0.5">
                  Activities starting within your {notificationSettings.leadTimeMinutes}-minute timeframe will appear here with gear checklists and reminders.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={triggerTestNotification}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/80 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current text-amber-600 dark:text-amber-400" />
                  <span>Send Test Alert</span>
                </button>
              </div>
            </div>
          ) : (
            upcomingAlerts.map((alert) => {
              const act = alert.activity;
              const kids = children.filter((c) => act.childIds.includes(c.id));
              const mins = Math.max(0, alert.startsInMinutes);

              return (
                <div
                  key={act.id}
                  className="pt-2.5 first:pt-0 bg-transparent rounded-xl"
                >
                  <div className="p-3 bg-slate-50/90 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-amber-50/30 dark:hover:bg-slate-800 transition-colors">
                    {/* Top status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 ${
                            alert.isOngoing
                              ? 'bg-orange-500 text-white animate-pulse'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {alert.isOngoing ? 'Happening Now' : `In ${mins === 0 ? '<1' : mins} min`}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {act.title}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                        {formatTimeDisplay(act.startTime)}
                      </span>
                    </div>

                    {/* Kids & Location */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        {kids.map((k) => (
                          <span key={k.id} className="inline-flex items-center gap-0.5">
                            <span>{k.avatar}</span>
                            <span>{k.name}</span>
                          </span>
                        ))}
                      </div>
                      <span>&bull;</span>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </div>
                    </div>

                    {/* Gear packing reminder */}
                    {act.checklist && act.checklist.length > 0 && (
                      <div className="mt-2 text-[11px] p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 truncate">
                          <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="truncate">
                            Packing: {act.checklist.filter((c) => c.checked).length}/{act.checklist.length} items ready
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold ml-2 shrink-0">
                          {act.checklist.filter((c) => c.checked).length === act.checklist.length ? 'Ready! 🎉' : 'Needs prep'}
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-2.5 flex items-center justify-between gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setInspectActivity(act);
                          setIsNotificationDrawerOpen(false);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <span>Open Activity</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => snoozeAlert(act.id, 10)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                        title="Remind again in 10 minutes"
                      >
                        Snooze
                      </button>

                      <button
                        onClick={() => dismissAlert(act.id)}
                        className="px-2.5 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <button
            onClick={triggerTestNotification}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current text-amber-600 dark:text-amber-400" />
            <span>Test Alert</span>
          </button>

          <button
            onClick={() => {
              setIsNotificationDrawerOpen(false);
              setIsNotificationSettingsOpen(true);
            }}
            className="text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Settings ({notificationSettings.leadTimeMinutes}m)</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
