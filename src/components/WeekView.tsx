import React from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { getWeekDates, getTodayString, timeToMinutes } from '../utils/dateUtils';
import { ActivityCard } from './ActivityCard';

export const WeekView: React.FC = () => {
  const {
    currentDate,
    filteredActivities,
    openAddActivityModal,
    setCurrentDate,
    setViewMode,
  } = useCalendar();

  const weekDates = getWeekDates(currentDate, false); // Monday start
  const todayStr = getTodayString();

  return (
    <div className="py-2 sm:py-4">
      {/* Mobile Quick Day Selector Strip (md:hidden) */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2.5 mb-2">
        {weekDates.map((dateStr) => {
          const [y, m, d] = dateStr.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = dateStr === todayStr;
          const actsCount = filteredActivities.filter((a) => a.date === dateStr).length;

          return (
            <button
              key={dateStr}
              onClick={() => {
                const el = document.getElementById(`week-col-${dateStr}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`px-3 py-1.5 rounded-xl border text-center shrink-0 transition-all cursor-pointer ${
                isToday
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                {dayName}
              </div>
              <div className="text-sm font-extrabold leading-tight flex items-center justify-center gap-1">
                <span>{d}</span>
                {actsCount > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-amber-500'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 7-Day Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDates.map((dateStr) => {
          const [y, m, d] = dateStr.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = dateStr === todayStr;

          // Day's activities sorted by start time
          const dayActivities = filteredActivities
            .filter((act) => act.date === dateStr)
            .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

          return (
            <div
              id={`week-col-${dateStr}`}
              key={dateStr}
              className={`flex flex-col rounded-2xl border transition-all min-h-[110px] md:min-h-[360px] bg-slate-50/70 dark:bg-slate-900/60 ${
                isToday
                  ? 'border-amber-400/80 dark:border-amber-500/70 bg-amber-50/30 dark:bg-amber-950/20 ring-2 ring-amber-400/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Column Day Header */}
              <div
                className={`p-3 border-b flex items-center justify-between rounded-t-2xl ${
                  isToday
                    ? 'bg-amber-100/60 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/80'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setCurrentDate(dateStr);
                    setViewMode('day');
                  }}
                  title="Click to view full day schedule"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {dayName}
                    </span>
                    <span
                      className={`text-lg font-extrabold ${
                        isToday ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {d}
                    </span>
                  </div>
                  {isToday && (
                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-900/60 px-1.5 py-0.2 rounded-full">
                      Today
                    </span>
                  )}
                </div>

                {/* Add activity for this day */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mr-1">
                    {dayActivities.length > 0 && `${dayActivities.length}`}
                  </span>
                  <button
                    id={`add-activity-day-${dateStr}`}
                    onClick={() => openAddActivityModal(dateStr, '16:00')}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={`Add activity on ${dayName}, ${d}`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Day Activities List */}
              <div className="p-2.5 flex-1 space-y-2 flex flex-col">
                {dayActivities.length === 0 ? (
                  <div className="flex-1 flex flex-row md:flex-col items-center justify-between md:justify-center p-3 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-white/40 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 opacity-40 shrink-0" />
                      <span className="text-xs font-medium">Free day</span>
                    </div>
                    <button
                      onClick={() => openAddActivityModal(dateStr, '16:00')}
                      className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ) : (
                  dayActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} compact />
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
