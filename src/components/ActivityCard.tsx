import React from 'react';
import {
  Clock,
  MapPin,
  Car,
  Package,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from 'lucide-react';
import { Activity, Child } from '../types';
import { useCalendar } from '../context/CalendarContext';
import { CATEGORY_CONFIG } from '../utils/categoryTheme';
import { formatTimeDisplay } from '../utils/dateUtils';

interface ActivityCardProps {
  activity: Activity;
  compact?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, compact = false }) => {
  const {
    children,
    conflicts,
    setInspectActivity,
    toggleActivityCompleted,
    upcomingAlerts,
    notificationSettings,
  } = useCalendar();

  // Associated children
  const assignedKids = children.filter((c) => activity.childIds.includes(c.id));
  const categoryConfig = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.other;
  const CategoryIcon = categoryConfig.icon;

  // Conflict check for this specific activity
  const hasConflict = conflicts.some(
    (c) => c.activityA.id === activity.id || c.activityB.id === activity.id
  );

  // Upcoming notification alert check
  const upcomingAlert = upcomingAlerts.find((a) => a.activity.id === activity.id);
  const isUpcoming = Boolean(upcomingAlert && notificationSettings.highlightInUI && !activity.completed);

  // Packing list stats
  const totalItems = activity.checklist.length;
  const packedItems = activity.checklist.filter((i) => i.checked).length;
  const allPacked = totalItems > 0 && packedItems === totalItems;

  const primaryKid = assignedKids[0];
  const borderLeftColor = primaryKid ? primaryKid.color : '#94A3B8';

  return (
    <div
      id={`activity-card-${activity.id}`}
      onClick={() => setInspectActivity(activity)}
      className={`group relative bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden ${
        activity.completed ? 'opacity-65 bg-slate-50/80 dark:bg-slate-900/60' : ''
      } ${
        isUpcoming ? 'ring-2 ring-amber-500 shadow-md bg-amber-50/20 dark:bg-amber-950/20' : ''
      } ${compact ? 'p-2.5' : 'p-3.5'}`}
      style={{ borderLeftWidth: '4px', borderLeftColor }}
    >
      {/* Top row: Kid avatar/name & Category icon */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {assignedKids.map((kid) => (
            <span
              key={kid.id}
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold ${kid.badgeClass}`}
            >
              <span className="text-xs leading-none">{kid.avatar}</span>
              <span>{kid.name}</span>
            </span>
          ))}

          {isUpcoming && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white animate-pulse shadow-xs"
              title="Starts within your notification timeframe"
            >
              <Clock className="w-2.5 h-2.5" />
              <span>
                {upcomingAlert?.isOngoing ? 'NOW' : `In ${Math.max(0, upcomingAlert?.startsInMinutes || 0)}m`}
              </span>
            </span>
          )}

          {hasConflict && (
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
              title="Schedule Conflict detected!"
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Overlap</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`p-1 rounded-md ${categoryConfig.bgLight} ${categoryConfig.textClass}`}
            title={categoryConfig.label}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActivityCompleted(activity.id);
            }}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5"
            title={activity.completed ? 'Mark incomplete' : 'Mark completed'}
          >
            {activity.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="w-4 h-4 hover:stroke-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Activity Title */}
      <h3
        className={`font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-1 ${
          compact ? 'text-xs' : 'text-sm'
        } ${activity.completed ? 'line-through text-slate-500 dark:text-slate-500' : ''}`}
      >
        {activity.title}
      </h3>

      {/* Time Range */}
      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-1">
        <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
        <span>
          {formatTimeDisplay(activity.startTime)} – {formatTimeDisplay(activity.endTime)}
        </span>
      </div>

      {/* Location */}
      {activity.location && (
        <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate">{activity.location}</span>
        </div>
      )}

      {/* Driver & Packing Badges */}
      <div className="flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
        {/* Driver info */}
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 truncate">
          <Car className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate font-medium">
            {activity.assignedDriver || 'Unassigned'}
          </span>
        </div>

        {/* Gear / Checklist Status */}
        {totalItems > 0 && (
          <div
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] shrink-0 ${
              allPacked
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title={`Gear packing status: ${packedItems}/${totalItems}`}
          >
            <Package className="w-2.5 h-2.5" />
            <span>
              {packedItems}/{totalItems}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
