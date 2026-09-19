import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';

export const ConflictBanner: React.FC = () => {
  const { conflicts, setInspectActivity, setCurrentDate } = useCalendar();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!conflicts || conflicts.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 px-4 sm:px-6 lg:px-8 py-2.5 transition-all no-print">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5 text-amber-900 dark:text-amber-200 min-w-0">
            <span className="p-1 rounded-md bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div className="text-xs sm:text-sm min-w-0">
              <span className="font-bold">
                {conflicts.length} Schedule {conflicts.length === 1 ? 'Conflict' : 'Conflicts'} Detected:
              </span>{' '}
              <span className="text-amber-800 dark:text-amber-300 break-words">
                {conflicts[0].description}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 shrink-0 self-end sm:self-auto">
            {conflicts.length > 1 && (
              <button
                id="toggle-conflicts-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 px-2 py-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                <span>{isExpanded ? 'Hide all' : `View all (${conflicts.length})`}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              id="inspect-first-conflict-btn"
              onClick={() => {
                const target = conflicts[0].activityA;
                setCurrentDate(target.date);
                setInspectActivity(target);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-200 dark:bg-amber-800 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 transition-colors cursor-pointer"
            >
              <span>Review</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Expanded conflict list if multiple */}
        {isExpanded && conflicts.length > 1 && (
          <div className="mt-2.5 pt-2.5 border-t border-amber-200 dark:border-amber-900/60 space-y-2">
            {conflicts.slice(1).map((conflict) => (
              <div
                key={conflict.id}
                className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-900/30 p-2 rounded-lg"
              >
                <span>{conflict.description}</span>
                <button
                  onClick={() => {
                    setCurrentDate(conflict.activityA.date);
                    setInspectActivity(conflict.activityA);
                  }}
                  className="font-semibold text-amber-900 dark:text-amber-200 hover:underline shrink-0 ml-2"
                >
                  Inspect &rarr;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
