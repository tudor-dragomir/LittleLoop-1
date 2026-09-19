import React from 'react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  Plus,
  Bell,
  Users,
  Sparkles,
  Clock
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';

export const MobileBottomNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    navigateDate,
    openAddActivityModal,
    upcomingAlerts,
    setIsNotificationDrawerOpen,
    openKidsManager,
    children,
    setSelectedChildId,
  } = useCalendar();

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg md:hidden no-print transition-colors"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-md mx-auto">
        
        {/* Schedule / Calendar view toggle */}
        <button
          onClick={() => {
            if (viewMode === 'week') setViewMode('month');
            else if (viewMode === 'month') setViewMode('day');
            else setViewMode('week');
          }}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <CalendarIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
            {viewMode}
          </span>
        </button>

        {/* Today quick jump */}
        <button
          onClick={() => {
            navigateDate('today');
            setViewMode('day');
          }}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5 text-amber-800 dark:text-amber-300">
            Today
          </span>
        </button>

        {/* Central Add Activity Button */}
        <div className="flex justify-center -mt-5">
          <button
            id="mobile-nav-add-btn"
            onClick={() => openAddActivityModal()}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg ring-4 ring-white dark:ring-slate-900 active:scale-95 transition-all cursor-pointer"
            title="Add Activity"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Alerts / Notifications */}
        <button
          id="mobile-nav-alerts-btn"
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${upcomingAlerts.length > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`} />
            {upcomingAlerts.length > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-xs animate-pulse">
                {upcomingAlerts.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
            Alerts
          </span>
        </button>

        {/* Kids Profiles / Management */}
        <button
          id="mobile-nav-kids-btn"
          onClick={() => openKidsManager('list')}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
        >
          <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
            Kids ({children.length})
          </span>
        </button>

      </div>
    </nav>
  );
};
