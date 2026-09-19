import React from 'react';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { formatFullDate, getTodayString, timeToMinutes } from '../utils/dateUtils';
import { ActivityCard } from './ActivityCard';
import { Activity } from '../types';

export const AgendaView: React.FC = () => {
  const {
    filteredActivities,
    currentDate,
    openAddActivityModal,
  } = useCalendar();

  const todayStr = getTodayString();

  // Sort all activities chronologically by date and start time
  const sorted = [...filteredActivities].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
  });

  // Group by date
  const groupedByDate: { [date: string]: Activity[] } = {};
  sorted.forEach((act) => {
    if (!groupedByDate[act.date]) {
      groupedByDate[act.date] = [];
    }
    groupedByDate[act.date].push(act);
  });

  const dates = Object.keys(groupedByDate).sort();

  const getDateHeaderLabel = (dateStr: string) => {
    if (dateStr === todayStr) {
      return 'Today';
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const [ty, tm, td] = todayStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const todayObj = new Date(ty, tm - 1, td);
    
    const diffDays = Math.round((dateObj.getTime() - todayObj.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="py-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Upcoming Schedule Agenda</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological view of practices, lessons, and events
          </p>
        </div>

        <button
          onClick={() => openAddActivityModal(currentDate, '16:00')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Activity</span>
        </button>
      </div>

      {dates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
          <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">No scheduled activities found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters or add a new activity for the kids.
          </p>
        </div>
      ) : (
        dates.map((dateStr) => {
          const acts = groupedByDate[dateStr];
          const relativeLabel = getDateHeaderLabel(dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div key={dateStr} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      isToday
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {relativeLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {formatFullDate(dateStr)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {acts.length} {acts.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {/* Day Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {acts.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
