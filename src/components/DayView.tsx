import React from 'react';
import {
  Clock,
  Plus,
  Package,
  Car,
  CheckCircle2,
  Circle,
  Phone,
  MapPin,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { formatFullDate, formatTimeDisplay, timeToMinutes } from '../utils/dateUtils';
import { CATEGORY_CONFIG } from '../utils/categoryTheme';

export const DayView: React.FC = () => {
  const {
    currentDate,
    navigateDate,
    filteredActivities,
    children,
    openAddActivityModal,
    openEditActivityModal,
    toggleChecklistItem,
    toggleActivityCompleted,
    conflicts,
  } = useCalendar();

  const childMap = new Map(children.map((c) => [c.id, c]));

  // Activities for this exact day, sorted by time
  const dayActivities = filteredActivities
    .filter((a) => a.date === currentDate)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  // Collect all packing checklist items for this day
  const allGearItems: {
    actId: string;
    actTitle: string;
    kidName: string;
    kidColor: string;
    itemId: string;
    text: string;
    checked: boolean;
  }[] = [];

  dayActivities.forEach((act) => {
    const kid = childMap.get(act.childIds[0]);
    act.checklist.forEach((item) => {
      allGearItems.push({
        actId: act.id,
        actTitle: act.title,
        kidName: kid ? kid.name : 'Family',
        kidColor: kid ? kid.color : '#64748B',
        itemId: item.id,
        text: item.text,
        checked: item.checked,
      });
    });
  });

  const packedCount = allGearItems.filter((i) => i.checked).length;
  const totalGearCount = allGearItems.length;

  return (
    <div className="py-4 space-y-6">
      
      {/* Day Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {formatFullDate(currentDate)}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'} scheduled today
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddActivityModal(currentDate, '16:00')}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Activity for This Day</span>
        </button>
      </div>

      {/* Gear Packing Checklist Card (if any gear is listed today) */}
      {totalGearCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-200/70 dark:bg-amber-900/60 rounded-lg text-amber-900 dark:text-amber-200">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Today's Gear & Backpack Checklist
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Check off what’s packed before heading out the door
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 bg-white/80 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                {packedCount} of {totalGearCount} packed
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-amber-200/60 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-3.5">
            <div
              className="bg-amber-500 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${totalGearCount > 0 ? (packedCount / totalGearCount) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Checkable items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {allGearItems.map((item) => (
              <div
                key={`${item.actId}-${item.itemId}`}
                onClick={() => toggleChecklistItem(item.actId, item.itemId)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                  item.checked
                    ? 'bg-white/90 dark:bg-slate-800/90 border-emerald-300 dark:border-emerald-700/60 text-slate-500 dark:text-slate-400 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 border-amber-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-amber-300 dark:hover:border-amber-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => {}} // handled by parent onClick
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.kidColor }}
                    />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
                      {item.kidName} &bull; {item.actTitle}
                    </span>
                  </div>
                  <p
                    className={`text-xs font-semibold truncate ${
                      item.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Schedule Timeline */}
      <div className="space-y-4">
        {dayActivities.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              No Activities on this Date
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Enjoy a free day or schedule practices, lessons, or appointments for the kids.
            </p>
            <button
              onClick={() => openAddActivityModal(currentDate, '16:00')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Activity</span>
            </button>
          </div>
        ) : (
          dayActivities.map((act) => {
            const assignedKids = children.filter((c) => act.childIds.includes(c.id));
            const categoryMeta = CATEGORY_CONFIG[act.category] || CATEGORY_CONFIG.other;
            const CategoryIcon = categoryMeta.icon;
            const primaryKid = assignedKids[0];
            const borderLeftColor = primaryKid ? primaryKid.color : '#94A3B8';

            const hasConflict = conflicts.some(
              (c) => (c.activityA.id === act.id || c.activityB.id === act.id) && c.date === currentDate
            );

            return (
              <div
                key={act.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all ${
                  act.completed ? 'opacity-65 bg-slate-50/70 dark:bg-slate-900/60' : ''
                }`}
                style={{ borderLeftWidth: '5px', borderLeftColor }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    {/* Kid Badges & Category */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {assignedKids.map((k) => (
                        <span
                          key={k.id}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${k.badgeClass}`}
                        >
                          <span>{k.avatar}</span>
                          <span>{k.name}</span>
                        </span>
                      ))}

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${categoryMeta.badgeClass}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        <span>{categoryMeta.label}</span>
                      </span>

                      {hasConflict && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Schedule Overlap</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 ${
                        act.completed ? 'line-through text-slate-500 dark:text-slate-500' : ''
                      }`}
                    >
                      {act.title}
                    </h3>

                    {/* Time & Location */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>
                          {formatTimeDisplay(act.startTime)} – {formatTimeDisplay(act.endTime)}
                        </span>
                      </div>

                      {act.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>{act.location}</span>
                          {act.address && (
                            <span className="text-slate-400 dark:text-slate-500 hidden md:inline">
                              ({act.address})
                            </span>
                          )}
                        </div>
                      )}

                      {act.assignedDriver && (
                        <div className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          <Car className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>Driver: {act.assignedDriver}</span>
                        </div>
                      )}
                    </div>

                    {/* Coach or Notes if present */}
                    {(act.contactName || act.contactPhone || act.notes) && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        {act.contactName && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Contact:</span>
                            <span>{act.contactName}</span>
                            {act.contactPhone && (
                              <a
                                href={`tel:${act.contactPhone}`}
                                className="inline-flex items-center gap-0.5 text-amber-700 dark:text-amber-400 hover:underline font-semibold ml-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{act.contactPhone}</span>
                              </a>
                            )}
                          </div>
                        )}
                        {act.notes && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                            <span className="italic">{act.notes}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Specific activity checklist preview */}
                    {act.checklist.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Equipment & Items:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {act.checklist.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleChecklistItem(act.id, item.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                item.checked
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 line-through'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              <span className="w-3 h-3 flex items-center justify-center">
                                {item.checked ? '✓' : '○'}
                              </span>
                              <span>{item.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-2 sm:pt-0">
                    <button
                      onClick={() => toggleActivityCompleted(act.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                        act.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {act.completed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Attended</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          <span>Mark done</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => openEditActivityModal(act)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Edit details
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
