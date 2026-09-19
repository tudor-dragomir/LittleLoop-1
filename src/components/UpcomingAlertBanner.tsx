import React, { useState } from 'react';
import {
  Bell,
  Clock,
  MapPin,
  Car,
  CheckSquare,
  X,
  ChevronRight,
  Sparkles,
  Volume2,
  CalendarCheck
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { formatTimeDisplay } from '../utils/dateUtils';

export const UpcomingAlertBanner: React.FC = () => {
  const {
    upcomingAlerts,
    dismissAlert,
    snoozeAlert,
    setInspectActivity,
    children,
    notificationSettings,
    setIsNotificationSettingsOpen,
    activeToastAlert,
    setActiveToastAlert,
  } = useCalendar();

  const [isExpanded, setIsExpanded] = useState(false);

  // If notifications disabled or no alerts, render nothing
  if (!notificationSettings.enabled) return null;

  // Active floating toast (when a notification was just triggered or tested)
  const renderToast = () => {
    if (!activeToastAlert) return null;
    const act = activeToastAlert.activity;
    const kids = children.filter((c) => act.childIds.includes(c.id));
    const isOngoing = activeToastAlert.isOngoing;
    const mins = Math.max(0, activeToastAlert.startsInMinutes);

    return (
      <div className="fixed bottom-20 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 z-50 max-w-full sm:max-w-md w-auto sm:w-full animate-bounce-short shadow-2xl rounded-2xl bg-slate-900 text-white p-3.5 sm:p-4 border border-amber-400/40 no-print">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 animate-pulse">
            <Bell className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                {isOngoing ? '⚡ Happening Now' : `⏰ Starting in ${mins === 0 ? 'moments' : `${mins} min`}`}
              </span>
              <button
                onClick={() => setActiveToastAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h4 className="text-sm font-bold text-white truncate mt-0.5">
              {act.title}
            </h4>

            <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
              <div className="flex items-center gap-1 font-medium">
                {kids.map((k) => (
                  <span key={k.id} className="inline-flex items-center gap-0.5">
                    <span>{k.avatar}</span>
                    <span>{k.name}</span>
                  </span>
                ))}
              </div>
              <span>&bull;</span>
              <span>{formatTimeDisplay(act.startTime)}</span>
            </div>

            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{act.location}</span>
            </p>

            {/* Checklist reminder */}
            {act.checklist && act.checklist.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-200/90 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">
                  Gear: {act.checklist.filter((c) => c.checked).length}/{act.checklist.length} packed ({act.checklist.map((c) => c.text).slice(0, 2).join(', ')})
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => {
                  setInspectActivity(act);
                  setActiveToastAlert(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
              >
                View Activity
              </button>
              <button
                onClick={() => snoozeAlert(act.id, 10)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Snooze 10m
              </button>
              <button
                onClick={() => dismissAlert(act.id)}
                className="px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (upcomingAlerts.length === 0) {
    return renderToast();
  }

  const primaryAlert = upcomingAlerts[0];
  const primaryAct = primaryAlert.activity;
  const primaryKids = children.filter((c) => primaryAct.childIds.includes(c.id));
  const isOngoing = primaryAlert.isOngoing;
  const mins = Math.max(0, primaryAlert.startsInMinutes);

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 dark:from-amber-700 dark:via-amber-800 dark:to-orange-800 text-white px-3 sm:px-6 lg:px-8 py-2.5 shadow-md transition-all no-print border-b border-amber-400/30 dark:border-amber-600/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2.5">
            
            {/* Left Info */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-lg bg-white/20 dark:bg-black/20 text-white shrink-0 animate-pulse">
                <Clock className="w-4 h-4" />
              </div>

              <div className="text-xs sm:text-sm min-w-0">
                <span className="font-extrabold uppercase tracking-wide text-amber-100 dark:text-amber-200 mr-1.5 text-[11px] sm:text-xs">
                  {isOngoing ? 'Happening Now:' : `Upcoming (${mins === 0 ? 'Starts now' : `in ${mins}m`}):`}
                </span>
                
                <span className="font-bold text-white truncate inline-block align-bottom max-w-[160px] sm:max-w-xs md:max-w-md">
                  {primaryAct.title}
                </span>

                <span className="hidden sm:inline-block ml-2 text-amber-100 dark:text-amber-200 text-xs">
                  for {primaryKids.map((k) => `${k.avatar} ${k.name}`).join(', ')} &bull; {formatTimeDisplay(primaryAct.startTime)} at {primaryAct.location}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {upcomingAlerts.length > 1 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-amber-100 hover:text-white px-2 py-1 rounded-md bg-white/10 dark:bg-black/20 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <span>+{upcomingAlerts.length - 1} more</span>
                </button>
              )}

              <button
                onClick={() => setInspectActivity(primaryAct)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
              >
                <span>Check In</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => snoozeAlert(primaryAct.id, 10)}
                title="Snooze 10 minutes"
                className="hidden sm:inline-flex px-2 py-1 text-xs font-medium rounded-lg bg-white/10 dark:bg-black/20 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                Snooze
              </button>

              <button
                onClick={() => dismissAlert(primaryAct.id)}
                title="Dismiss reminder"
                className="p-1 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 text-amber-100 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Expanded multi-alert list */}
          {isExpanded && upcomingAlerts.length > 1 && (
            <div className="mt-2.5 pt-2.5 border-t border-white/20 dark:border-white/10 space-y-1.5">
              {upcomingAlerts.slice(1).map((alert) => {
                const act = alert.activity;
                const kids = children.filter((c) => act.childIds.includes(c.id));
                return (
                  <div
                    key={act.id}
                    className="flex items-center justify-between text-xs bg-white/10 dark:bg-black/20 p-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-amber-200">
                        in {Math.max(0, alert.startsInMinutes)}m:
                      </span>
                      <span className="font-semibold text-white truncate">{act.title}</span>
                      <span className="text-amber-100 text-[11px]">
                        ({kids.map((k) => k.name).join(', ')}) &bull; {act.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => setInspectActivity(act)}
                        className="text-xs font-bold text-white hover:underline mr-1 cursor-pointer"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => dismissAlert(act.id)}
                        className="text-amber-200 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {renderToast()}
    </>
  );
};
