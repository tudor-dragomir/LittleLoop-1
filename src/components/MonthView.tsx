import React from 'react';
import { Plus } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { getMonthMatrix, timeToMinutes } from '../utils/dateUtils';
import { formatTimeDisplay } from '../utils/dateUtils';

export const MonthView: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    setViewMode,
    filteredActivities,
    openAddActivityModal,
    setInspectActivity,
    children,
  } = useCalendar();

  const [year, month] = currentDate.split('-').map(Number);
  const matrix = getMonthMatrix(year, month - 1);

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map kids for easy color lookups
  const childMap = new Map(children.map((c) => [c.id, c]));

  return (
    <div className="py-2 sm:py-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
        
        {/* Day of week headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-center">
          {dayHeaders.map((dh) => (
            <div
              key={dh}
              className="py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              <span className="sm:hidden">{dh[0]}</span>
              <span className="hidden sm:inline">{dh}</span>
            </div>
          ))}
        </div>

        {/* 7-column calendar matrix */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 dark:divide-slate-800">
          {matrix.map((cell) => {
            const dayActs = filteredActivities
              .filter((a) => a.date === cell.dateStr)
              .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

            return (
              <div
                key={cell.dateStr}
                onClick={() => {
                  setCurrentDate(cell.dateStr);
                  setViewMode('day');
                }}
                className={`group min-h-[64px] sm:min-h-[120px] p-1 sm:p-2 transition-colors cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/40 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600'
                    : cell.isToday
                    ? 'bg-amber-50/50 dark:bg-amber-950/20'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/60'
                }`}
              >
                {/* Cell Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full text-[11px] sm:text-xs font-bold ${
                      cell.isToday
                        ? 'bg-amber-500 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {/* Add button on hover (desktop) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddActivityModal(cell.dateStr, '16:00');
                    }}
                    className="hidden sm:inline-flex opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-opacity cursor-pointer"
                    title={`Add activity on ${cell.dateStr}`}
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </div>

                {/* Mobile dots preview (< sm) */}
                <div className="sm:hidden flex items-center justify-center gap-1 flex-wrap mt-1">
                  {dayActs.slice(0, 3).map((act) => {
                    const kid = childMap.get(act.childIds[0]);
                    return (
                      <span
                        key={act.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: kid?.color || '#F59E0B' }}
                      />
                    );
                  })}
                  {dayActs.length > 3 && (
                    <span className="text-[9px] font-black text-slate-500 dark:text-slate-400">
                      +{dayActs.length - 3}
                    </span>
                  )}
                </div>

                {/* Desktop Activities list (sm+) */}
                <div className="hidden sm:block space-y-1 overflow-hidden flex-1 mt-1">
                  {dayActs.slice(0, 3).map((act) => {
                    const firstKid = childMap.get(act.childIds[0]);
                    const badgeBg = firstKid?.badgeClass || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                    return (
                      <div
                        key={act.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectActivity(act);
                        }}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold truncate border transition-transform hover:scale-[1.02] flex items-center gap-1 ${badgeBg}`}
                        title={`${act.title} (${formatTimeDisplay(act.startTime)})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: firstKid?.color || '#94A3B8' }} />
                        <span className="font-bold shrink-0">{act.startTime}</span>
                        <span className="truncate">{act.title}</span>
                      </div>
                    );
                  })}

                  {dayActs.length > 3 && (
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1">
                      +{dayActs.length - 3} more
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
