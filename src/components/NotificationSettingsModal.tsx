import React, { useState } from 'react';
import {
  X,
  Bell,
  Clock,
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  Check,
  Play
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { requestBrowserNotificationPermission } from '../utils/dateUtils';

export const NotificationSettingsModal: React.FC = () => {
  const {
    isNotificationSettingsOpen,
    setIsNotificationSettingsOpen,
    notificationSettings,
    updateNotificationSettings,
    triggerTestNotification,
  } = useCalendar();

  const [customMinutes, setCustomMinutes] = useState<string>(
    String(notificationSettings.leadTimeMinutes)
  );
  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  if (!isNotificationSettingsOpen) return null;

  const timeframePresets = [
    { minutes: 10, label: '10 min' },
    { minutes: 15, label: '15 min' },
    { minutes: 30, label: '30 min (Default)' },
    { minutes: 45, label: '45 min' },
    { minutes: 60, label: '1 hour' },
    { minutes: 120, label: '2 hours' },
  ];

  const handleSelectPreset = (mins: number) => {
    setCustomMinutes(String(mins));
    updateNotificationSettings({ leadTimeMinutes: mins });
  };

  const handleCustomMinutesChange = (val: string) => {
    setCustomMinutes(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      updateNotificationSettings({ leadTimeMinutes: num });
    }
  };

  const handleToggleBrowserAlerts = async () => {
    if (!notificationSettings.browserAlertEnabled) {
      const permission = await requestBrowserNotificationPermission();
      setBrowserPermissionStatus(permission);
      if (permission === 'granted') {
        updateNotificationSettings({ browserAlertEnabled: true });
      } else {
        updateNotificationSettings({ browserAlertEnabled: false });
      }
    } else {
      updateNotificationSettings({ browserAlertEnabled: false });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print"
      onClick={() => setIsNotificationSettingsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[88vh] flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Activity Notification Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set custom alert timeframes and reminder preferences
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-slate-700 dark:text-slate-300 overflow-y-auto flex-1 min-h-0">
          
          {/* Master Enable/Disable Switch */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                Activity Notifications
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Alert before scheduled practices and lessons start
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.enabled}
                onChange={(e) => updateNotificationSettings({ enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* User-Defined Timeframe Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Remind Me Before Activity Starts</span>
              </label>
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2 py-0.5 rounded-md">
                {notificationSettings.leadTimeMinutes} min before
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-1.5">
              {timeframePresets.map((preset) => {
                const isSelected = notificationSettings.leadTimeMinutes === preset.minutes;
                return (
                  <button
                    type="button"
                    key={preset.minutes}
                    onClick={() => handleSelectPreset(preset.minutes)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Input */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Or custom minutes:</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="720"
                  value={customMinutes}
                  onChange={(e) => handleCustomMinutesChange(e.target.value)}
                  className="w-20 px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">minutes</span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            
            {/* UI Highlighting */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Highlight Upcoming in UI
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Glowing badges & countdown cards on activities starting soon
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.highlightInUI}
                onChange={(e) => updateNotificationSettings({ highlightInUI: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            {/* Audio Chime */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2">
                {notificationSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Play Chime Sound
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Play a gentle audio tone when activities enter timeframe
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.soundEnabled}
                onChange={(e) => updateNotificationSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
            </div>

            {/* Browser Push Notifications */}
            <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Browser Desktop Alerts
                    </span>
                    {browserPermissionStatus === 'granted' && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.2 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Show native system alerts when running in background
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleBrowserAlerts}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  notificationSettings.browserAlertEnabled
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {notificationSettings.browserAlertEnabled ? 'Enabled' : 'Enable'}
              </button>
            </div>

          </div>

          {/* Test Alert Button */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={triggerTestNotification}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-amber-600 dark:text-amber-400" />
              <span>Test Notification Now</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNotificationSettingsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
