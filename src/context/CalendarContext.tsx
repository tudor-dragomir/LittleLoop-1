import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ActivityCategory,
  Child,
  NotificationSettings,
  ScheduleConflict,
  UpcomingAlert,
  ViewMode,
  ThemeMode,
} from '../types';
import {
  INITIAL_CHILDREN,
  COLOR_PRESETS,
  generateSampleActivities,
} from '../data/sampleData';
import {
  detectConflicts,
  getTodayString,
  getActivityTimeDiffMinutes,
  sendBrowserNotification,
  requestBrowserNotificationPermission,
  formatTimeDisplay,
} from '../utils/dateUtils';
import { playNotificationChime } from '../utils/soundUtils';

interface CalendarContextType {
  children: Child[];
  activities: Activity[];
  selectedChildId: string | 'all';
  selectedCategory: ActivityCategory | 'all';
  searchQuery: string;
  currentDate: string; // YYYY-MM-DD
  viewMode: ViewMode;
  conflicts: ScheduleConflict[];
  filteredActivities: Activity[];
  
  // Notification system
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  upcomingAlerts: UpcomingAlert[];
  dismissedAlertIds: string[];
  dismissAlert: (activityId: string) => void;
  snoozeAlert: (activityId: string, minutes?: number) => void;
  triggerTestNotification: () => void;
  isNotificationSettingsOpen: boolean;
  setIsNotificationSettingsOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  activeToastAlert: UpcomingAlert | null;
  setActiveToastAlert: (alert: UpcomingAlert | null) => void;

  // Theme
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Actions
  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  toggleChecklistItem: (activityId: string, itemId: string) => void;
  addChecklistItem: (activityId: string, text: string) => void;
  removeChecklistItem: (activityId: string, itemId: string) => void;
  toggleActivityCompleted: (activityId: string) => void;
  
  // Child management
  addChild: (child: Omit<Child, 'id'>) => Child;
  updateChild: (child: Child) => void;
  deleteChild: (id: string) => void;
  
  // Navigation & Filtering
  navigateDate: (direction: 'prev' | 'next' | 'today') => void;
  setCurrentDate: (dateStr: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedChildId: (id: string | 'all') => void;
  setSelectedCategory: (cat: ActivityCategory | 'all') => void;
  setSearchQuery: (q: string) => void;
  resetToDefaults: () => void;
  
  // Modals & Drawers
  isActivityModalOpen: boolean;
  editingActivity: Activity | null;
  activityModalDefaults: { date?: string; startTime?: string; childId?: string };
  openAddActivityModal: (date?: string, startTime?: string, childId?: string) => void;
  openEditActivityModal: (activity: Activity) => void;
  closeActivityModal: () => void;
  
  isChildModalOpen: boolean;
  editingChild: Child | null;
  openAddChildModal: () => void;
  openEditChildModal: (child: Child) => void;
  closeChildModal: () => void;

  isKidsManagerOpen: boolean;
  setIsKidsManagerOpen: (open: boolean) => void;
  kidsManagerInitialView: 'list' | 'add' | 'edit';
  kidsManagerInitialChild: Child | null;
  openKidsManager: (view?: 'list' | 'add' | 'edit', child?: Child | null) => void;
  closeKidsManager: () => void;

  inspectActivity: Activity | null;
  setInspectActivity: (act: Activity | null) => void;

  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CHILDREN: 'kids_cal_children_v1',
  ACTIVITIES: 'kids_cal_activities_v1',
  VIEW_MODE: 'kids_cal_viewmode_v1',
  NOTIFICATIONS: 'kids_cal_notifications_v1',
  THEME: 'kids_cal_theme_v1',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: true,
  leadTimeMinutes: 30, // user-defined timeframe: 30 mins before start
  soundEnabled: true,
  browserAlertEnabled: false,
  highlightInUI: true,
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Normalize child styling to guarantee high contrast across light & dark themes
  const normalizeChild = (child: Child): Child => {
    const preset =
      COLOR_PRESETS.find((p) => p.color.toLowerCase() === child.color?.toLowerCase()) ||
      COLOR_PRESETS[0];
    return {
      ...child,
      bgLight: preset.bgLight,
      borderClass: preset.borderClass,
      textClass: preset.textClass,
      badgeClass: preset.badgeClass,
    };
  };

  // Children State
  const [kids, setKids] = useState<Child[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHILDREN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeChild);
        }
      }
    } catch (e) {
      console.error('Failed to parse saved children', e);
    }
    return INITIAL_CHILDREN;
  });

  // Activities State
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved activities', e);
    }
    return generateSampleActivities();
  });

  // Navigation & View States
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      if (saved && ['week', 'month', 'day', 'agenda'].includes(saved)) {
        return saved as ViewMode;
      }
    } catch (e) {
      // ignore
    }
    return 'week';
  });

  const [selectedChildId, setSelectedChildId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & UI States
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityModalDefaults, setActivityModalDefaults] = useState<{ date?: string; startTime?: string; childId?: string }>({});

  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const [isKidsManagerOpen, setIsKidsManagerOpen] = useState(false);
  const [kidsManagerInitialView, setKidsManagerInitialView] = useState<'list' | 'add' | 'edit'>('list');
  const [kidsManagerInitialChild, setKidsManagerInitialChild] = useState<Child | null>(null);

  const [inspectActivity, setInspectActivity] = useState<Activity | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Theme State
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    } catch (e) {
      console.error('Failed to parse saved theme', e);
    }
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = isDark ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  // Notification State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) {
        return { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(saved) };
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);
  const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, number>>({});
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [activeToastAlert, setActiveToastAlert] = useState<UpcomingAlert | null>(null);

  const notifiedRef = useRef<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Periodic clock check every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Sync notification settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notificationSettings));
    } catch (e) {
      console.error('Error saving notification settings', e);
    }
  }, [notificationSettings]);

  // Update notification settings
  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Calculate upcoming alerts based on user-defined timeframe
  const upcomingAlerts = useMemo(() => {
    if (!notificationSettings.enabled) return [];

    const leadMinutes = notificationSettings.leadTimeMinutes;
    const now = currentTime;
    const list: UpcomingAlert[] = [];

    for (const act of activities) {
      if (act.completed) continue;
      if (dismissedAlertIds.includes(act.id)) continue;
      if (snoozedAlerts[act.id] && snoozedAlerts[act.id] > now.getTime()) continue;

      const startDiff = getActivityTimeDiffMinutes(act.date, act.startTime, now);
      const endDiff = getActivityTimeDiffMinutes(act.date, act.endTime, now);

      const isStartingSoon = startDiff >= 0 && startDiff <= leadMinutes;
      const isOngoing = startDiff < 0 && endDiff > 0;

      if (isStartingSoon || isOngoing) {
        list.push({
          activity: act,
          startsInMinutes: startDiff,
          isStartingSoon,
          isOngoing,
        });
      }
    }

    return list.sort((a, b) => a.startsInMinutes - b.startsInMinutes);
  }, [activities, notificationSettings, currentTime, dismissedAlertIds, snoozedAlerts]);

  // Audio / browser alerts when an event crosses threshold
  useEffect(() => {
    if (!notificationSettings.enabled || upcomingAlerts.length === 0) return;

    for (const alert of upcomingAlerts) {
      if (alert.isStartingSoon && !notifiedRef.current.has(alert.activity.id)) {
        notifiedRef.current.add(alert.activity.id);

        if (notificationSettings.soundEnabled) {
          playNotificationChime();
        }

        setActiveToastAlert(alert);

        if (notificationSettings.browserAlertEnabled) {
          const kidNames = alert.activity.childIds
            .map((id) => kids.find((k) => k.id === id)?.name)
            .filter(Boolean)
            .join(', ');

          sendBrowserNotification(
            `Activity in ${Math.max(1, alert.startsInMinutes)} mins: ${alert.activity.title}`,
            {
              body: `Kids: ${kidNames}\nLocation: ${alert.activity.location}\nDriver: ${alert.activity.assignedDriver || 'Unassigned'}`,
            }
          );
        }
      }
    }
  }, [upcomingAlerts, notificationSettings, kids]);

  const dismissAlert = (activityId: string) => {
    setDismissedAlertIds((prev) => [...prev, activityId]);
    if (activeToastAlert?.activity.id === activityId) {
      setActiveToastAlert(null);
    }
  };

  const snoozeAlert = (activityId: string, minutes: number = 10) => {
    const wakeTime = Date.now() + minutes * 60 * 1000;
    setSnoozedAlerts((prev) => ({ ...prev, [activityId]: wakeTime }));
    if (activeToastAlert?.activity.id === activityId) {
      setActiveToastAlert(null);
    }
  };

  const triggerTestNotification = () => {
    if (notificationSettings.soundEnabled) {
      playNotificationChime();
    }

    // Pick first upcoming or first activity as test sample
    const sampleAct = activities[0] || {
      id: 'test-act',
      title: 'Thunder FC Soccer Practice',
      childIds: [kids[0]?.id || 'child-1'],
      category: 'sports',
      date: getTodayString(),
      startTime: formatTimeDisplay('17:00'),
      endTime: formatTimeDisplay('18:15'),
      location: 'Riverside Community Park, Field #3',
      assignedDriver: 'Mom',
      checklist: [{ id: '1', text: 'Cleats & Shin Guards', checked: false }],
    };

    const testAlert: UpcomingAlert = {
      activity: sampleAct as Activity,
      startsInMinutes: notificationSettings.leadTimeMinutes,
      isStartingSoon: true,
      isOngoing: false,
    };

    setActiveToastAlert(testAlert);

    if (notificationSettings.browserAlertEnabled) {
      sendBrowserNotification(`Reminder: ${sampleAct.title} in ${notificationSettings.leadTimeMinutes} mins!`, {
        body: `Location: ${sampleAct.location}\nDriver: ${sampleAct.assignedDriver}`,
      });
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(kids));
    } catch (e) {
      console.error('Error saving children', e);
    }
  }, [kids]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activities', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    } catch (e) {
      // ignore
    }
  }, [viewMode]);

  // Detect conflicts across all activities
  const conflicts = useMemo(() => {
    return detectConflicts(activities, kids);
  }, [activities, kids]);

  // Filtered activities based on active filters
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Filter by child
      if (selectedChildId !== 'all') {
        if (!act.childIds.includes(selectedChildId)) return false;
      }
      // Filter by category
      if (selectedCategory !== 'all') {
        if (act.category !== selectedCategory) return false;
      }
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = act.title.toLowerCase().includes(q);
        const matchesLocation = act.location.toLowerCase().includes(q);
        const matchesDriver = act.assignedDriver?.toLowerCase().includes(q) || false;
        const matchesNotes = act.notes?.toLowerCase().includes(q) || false;
        const matchesKids = act.childIds.some((id) => {
          const c = kids.find((k) => k.id === id);
          return c?.name.toLowerCase().includes(q);
        });
        if (!matchesTitle && !matchesLocation && !matchesDriver && !matchesNotes && !matchesKids) {
          return false;
        }
      }
      return true;
    });
  }, [activities, selectedChildId, selectedCategory, searchQuery, kids]);

  // Activity CRUD
  const addActivity = (actData: Omit<Activity, 'id'>): Activity => {
    const newId = `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newActivity: Activity = { ...actData, id: newId };
    setActivities((prev) => [...prev, newActivity]);
    return newActivity;
  };

  const updateActivity = (updated: Activity) => {
    setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    if (inspectActivity?.id === updated.id) {
      setInspectActivity(updated);
    }
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    if (inspectActivity?.id === id) {
      setInspectActivity(null);
    }
  };

  const toggleChecklistItem = (activityId: string, itemId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const updatedChecklist = act.checklist.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        const updatedAct = { ...act, checklist: updatedChecklist };
        if (inspectActivity?.id === activityId) {
          setInspectActivity(updatedAct);
        }
        return updatedAct;
      })
    );
  };

  const addChecklistItem = (activityId: string, text: string) => {
    if (!text.trim()) return;
    const newItemId = `item-${Date.now()}`;
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const updatedChecklist = [...act.checklist, { id: newItemId, text: text.trim(), checked: false }];
        const updatedAct = { ...act, checklist: updatedChecklist };
        if (inspectActivity?.id === activityId) {
          setInspectActivity(updatedAct);
        }
        return updatedAct;
      })
    );
  };

  const removeChecklistItem = (activityId: string, itemId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const updatedChecklist = act.checklist.filter((item) => item.id !== itemId);
        const updatedAct = { ...act, checklist: updatedChecklist };
        if (inspectActivity?.id === activityId) {
          setInspectActivity(updatedAct);
        }
        return updatedAct;
      })
    );
  };

  const toggleActivityCompleted = (activityId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id !== activityId) return act;
        const updatedAct = { ...act, completed: !act.completed };
        if (inspectActivity?.id === activityId) {
          setInspectActivity(updatedAct);
        }
        return updatedAct;
      })
    );
  };

  // Child CRUD
  const addChild = (childData: Omit<Child, 'id'>): Child => {
    const newId = `child-${Date.now()}`;
    const newChild: Child = { ...childData, id: newId };
    setKids((prev) => [...prev, newChild]);
    return newChild;
  };

  const updateChild = (updated: Child) => {
    setKids((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteChild = (id: string) => {
    setKids((prev) => prev.filter((c) => c.id !== id));
    // Also remove from any activities
    setActivities((prev) =>
      prev.map((act) => ({
        ...act,
        childIds: act.childIds.filter((cId) => cId !== id),
      }))
    );
    if (selectedChildId === id) {
      setSelectedChildId('all');
    }
  };

  // Date Navigation
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(getTodayString());
      return;
    }

    const [year, month, day] = currentDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);

    let offsetDays = 0;
    if (viewMode === 'day') {
      offsetDays = direction === 'next' ? 1 : -1;
      d.setDate(d.getDate() + offsetDays);
    } else if (viewMode === 'week') {
      offsetDays = direction === 'next' ? 7 : -7;
      d.setDate(d.getDate() + offsetDays);
    } else if (viewMode === 'month') {
      d.setMonth(d.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      // Agenda view
      offsetDays = direction === 'next' ? 7 : -7;
      d.setDate(d.getDate() + offsetDays);
    }

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    setCurrentDate(`${y}-${m}-${dayStr}`);
  };

  const resetToDefaults = () => {
    setKids(INITIAL_CHILDREN);
    setActivities(generateSampleActivities());
    setSelectedChildId('all');
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentDate(getTodayString());
  };

  // Modal open/close helpers
  const openAddActivityModal = (date?: string, startTime?: string, childId?: string) => {
    setEditingActivity(null);
    setActivityModalDefaults({
      date: date || currentDate,
      startTime: startTime || '16:00',
      childId: childId || (selectedChildId !== 'all' ? selectedChildId : undefined),
    });
    setIsActivityModalOpen(true);
  };

  const openEditActivityModal = (activity: Activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
    setActivityModalDefaults({});
  };

  const openAddChildModal = () => {
    setEditingChild(null);
    setIsChildModalOpen(true);
  };

  const openEditChildModal = (child: Child) => {
    setEditingChild(child);
    setIsChildModalOpen(true);
  };

  const closeChildModal = () => {
    setIsChildModalOpen(false);
    setEditingChild(null);
  };

  const openKidsManager = (view: 'list' | 'add' | 'edit' = 'list', child: Child | null = null) => {
    setKidsManagerInitialView(view);
    setKidsManagerInitialChild(child);
    setIsKidsManagerOpen(true);
  };

  const closeKidsManager = () => {
    setIsKidsManagerOpen(false);
    setKidsManagerInitialChild(null);
    setKidsManagerInitialView('list');
  };

  return (
    <CalendarContext.Provider
      value={{
        children: kids,
        activities,
        selectedChildId,
        selectedCategory,
        searchQuery,
        currentDate,
        viewMode,
        conflicts,
        filteredActivities,
        notificationSettings,
        updateNotificationSettings,
        upcomingAlerts,
        dismissedAlertIds,
        dismissAlert,
        snoozeAlert,
        triggerTestNotification,
        isNotificationSettingsOpen,
        setIsNotificationSettingsOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        activeToastAlert,
        setActiveToastAlert,
        addActivity,
        updateActivity,
        deleteActivity,
        toggleChecklistItem,
        addChecklistItem,
        removeChecklistItem,
        toggleActivityCompleted,
        addChild,
        updateChild,
        deleteChild,
        navigateDate,
        setCurrentDate,
        setViewMode,
        setSelectedChildId,
        setSelectedCategory,
        setSearchQuery,
        resetToDefaults,
        isActivityModalOpen,
        editingActivity,
        activityModalDefaults,
        openAddActivityModal,
        openEditActivityModal,
        closeActivityModal,
        isChildModalOpen,
        editingChild,
        openAddChildModal,
        openEditChildModal,
        closeChildModal,
        isKidsManagerOpen,
        setIsKidsManagerOpen,
        kidsManagerInitialView,
        kidsManagerInitialChild,
        openKidsManager,
        closeKidsManager,
        inspectActivity,
        setInspectActivity,
        isExportModalOpen,
        setIsExportModalOpen,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
