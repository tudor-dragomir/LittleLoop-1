import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Search,
  X,
  Bell,
  SlidersHorizontal,
  Sun,
  Moon,
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { ViewMode } from '../types';
import { formatFullDate } from '../utils/dateUtils';

export const Header: React.FC = () => {
  const {
    currentDate,
    navigateDate,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    openAddActivityModal,
    setIsExportModalOpen,
    upcomingAlerts,
    setIsNotificationDrawerOpen,
    isDark,
    toggleTheme,
  } = useCalendar();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [year, month, day] = currentDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const getHeaderDateTitle = () => {
    if (viewMode === 'month') {
      return dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (viewMode === 'day') {
      return formatFullDate(currentDate);
    }
    // Week or Agenda view
    const startOfWeek = new Date(year, month - 1, day - (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const sameMonth = startOfWeek.getMonth() === endOfWeek.getMonth();
    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });

    return sameMonth
      ? `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`
      : `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  };

  const viewModes: { id: ViewMode; label: string }[] = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'day', label: 'Day' },
    { id: 'agenda', label: 'Agenda' },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs no-print transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Header Bar */}
        <div className="py-2.5 sm:py-3.5 flex flex-col gap-2.5">
          
          {/* Top Row: Brand & Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            
            {/* Logo & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-sm ring-2 ring-amber-100 dark:ring-amber-900/40 shrink-0">
                <CalendarIcon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                    Kids Activity Hub
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                    Family Calendar
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                  Coordinating practices, lessons, carpools & gear packing
                </p>
              </div>
            </div>

            {/* Header Right Action Tools */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 rounded-xl border transition-all sm:hidden cursor-pointer ${
                  searchQuery || isMobileSearchOpen
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Search activities"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Desktop Search Input */}
              <div className="relative hidden sm:block w-40 lg:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Theme Toggle (Dark / Light) */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Late-night scheduling)'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 transition-transform rotate-0 scale-100" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform rotate-0 scale-100 text-slate-600" />
                )}
              </button>

              {/* Notification Bell with Badge */}
              <button
                id="header-notification-bell-btn"
                onClick={() => setIsNotificationDrawerOpen(true)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  upcomingAlerts.length > 0
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title="Activity Reminders & Notifications"
              >
                <Bell className="w-4 h-4" />
                {upcomingAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-xs">
                    {upcomingAlerts.length}
                  </span>
                )}
              </button>

              {/* Print / Sync Button */}
              <button
                id="export-open-btn"
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
                title="Print or Export iCal"
              >
                <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="hidden md:inline">Print / Sync</span>
              </button>

              {/* Add Activity Primary Button */}
              <button
                id="add-activity-header-btn"
                onClick={() => openAddActivityModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Activity</span>
              </button>
            </div>
          </div>

          {/* Collapsible Search for Mobile */}
          {isMobileSearchOpen && (
            <div className="sm:hidden relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                id="mobile-search-input"
                type="text"
                autoFocus
                placeholder="Search activities, kids, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-amber-300 dark:border-amber-600 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white dark:focus:bg-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Bottom Row: Date Navigation & View Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            
            {/* Date Navigation Bar */}
            <div className="flex items-center justify-between bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-0.5">
                <button
                  id="nav-prev-btn"
                  onClick={() => navigateDate('prev')}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:bg-white dark:active:bg-slate-700 transition-all shadow-xs cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="nav-today-btn"
                  onClick={() => navigateDate('today')}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:bg-white dark:active:bg-slate-700 transition-all shadow-xs cursor-pointer"
                >
                  Today
                </button>
                <button
                  id="nav-next-btn"
                  onClick={() => navigateDate('next')}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 active:bg-white dark:active:bg-slate-700 transition-all shadow-xs cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 px-2 truncate text-right sm:text-center">
                {getHeaderDateTitle()}
              </div>
            </div>

            {/* View Mode Selector Tabs */}
            <div className="grid grid-cols-4 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-center">
              {viewModes.map((vm) => (
                <button
                  key={vm.id}
                  id={`view-tab-${vm.id}`}
                  onClick={() => setViewMode(vm.id)}
                  className={`py-1.5 sm:px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === vm.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {vm.label}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
