import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  Car,
  Package,
  Phone,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Plus,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { formatFullDate, formatTimeDisplay } from '../utils/dateUtils';
import { CATEGORY_CONFIG } from '../utils/categoryTheme';

export const ActivityDetailModal: React.FC = () => {
  const {
    inspectActivity,
    setInspectActivity,
    children,
    openEditActivityModal,
    deleteActivity,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    toggleActivityCompleted,
    conflicts,
  } = useCalendar();

  const [newItemText, setNewItemText] = useState('');

  if (!inspectActivity) return null;

  const assignedKids = children.filter((c) => inspectActivity.childIds.includes(c.id));
  const categoryMeta = CATEGORY_CONFIG[inspectActivity.category] || CATEGORY_CONFIG.other;
  const CategoryIcon = categoryMeta.icon;

  const activeConflicts = conflicts.filter(
    (c) => c.activityA.id === inspectActivity.id || c.activityB.id === inspectActivity.id
  );

  const mapsQuery = encodeURIComponent(
    inspectActivity.address
      ? `${inspectActivity.location}, ${inspectActivity.address}`
      : inspectActivity.location
  );

  const handleAddGear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addChecklistItem(inspectActivity.id, newItemText.trim());
    setNewItemText('');
  };

  const primaryKid = assignedKids[0];
  const headerBorderColor = primaryKid ? primaryKid.color : '#F59E0B';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom duration-150 transition-colors"
        style={{ borderTop: `6px solid ${headerBorderColor}` }}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/80 shrink-0">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {assignedKids.map((kid) => (
                <span
                  key={kid.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${kid.badgeClass}`}
                >
                  <span className="text-sm">{kid.avatar}</span>
                  <span>{kid.name}</span>
                </span>
              ))}

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryMeta.badgeClass}`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{categoryMeta.label}</span>
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {inspectActivity.title}
            </h2>
          </div>

          <button
            onClick={() => setInspectActivity(null)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-300">
          
          {/* Conflict Alert if any */}
          {activeConflicts.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800/80 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Scheduling Alert:</span>
                {activeConflicts.map((c) => (
                  <p key={c.id} className="mt-0.5">
                    {c.description}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Time & Date Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  Date & Time
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {formatFullDate(inspectActivity.date)}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">
                  {formatTimeDisplay(inspectActivity.startTime)} – {formatTimeDisplay(inspectActivity.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Car className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  Transportation / Driver
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {inspectActivity.assignedDriver || 'Unassigned'}
                </span>
                {inspectActivity.recurrence === 'weekly' && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    Repeats weekly
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Location Block */}
          {inspectActivity.location && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                    Location
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    {inspectActivity.location}
                  </span>
                  {inspectActivity.address && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">
                      {inspectActivity.address}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 hover:underline shrink-0"
              >
                <span>Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Coach / Instructor Info */}
          {(inspectActivity.contactName || inspectActivity.contactPhone) && (
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 block">
                  Coach / Instructor
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {inspectActivity.contactName || 'Staff'}
                </span>
              </div>

              {inspectActivity.contactPhone && (
                <a
                  href={`tel:${inspectActivity.contactPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{inspectActivity.contactPhone}</span>
                </a>
              )}
            </div>
          )}

          {/* Equipment & Gear Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Gear & Packing Checklist
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {inspectActivity.checklist.filter((i) => i.checked).length} of{' '}
                {inspectActivity.checklist.length} packed
              </span>
            </div>

            <div className="space-y-1.5">
              {inspectActivity.checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(inspectActivity.id, item.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <span
                      className={`text-xs font-semibold ${
                        item.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChecklistItem(inspectActivity.id, item.id);
                    }}
                    className="p-1 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add item inline */}
              <form onSubmit={handleAddGear} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add item to checklist..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </form>
            </div>
          </div>

          {/* Notes */}
          {inspectActivity.notes && (
            <div className="p-3 bg-amber-50/40 dark:bg-slate-800/60 rounded-xl border border-amber-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Parent Notes:
              </span>
              <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                {inspectActivity.notes}
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/90 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleActivityCompleted(inspectActivity.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                inspectActivity.completed
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {inspectActivity.completed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Attended</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Mark Done</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm('Delete this activity?')) {
                  deleteActivity(inspectActivity.id);
                  setInspectActivity(null);
                }
              }}
              className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Delete activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const target = inspectActivity;
                setInspectActivity(null);
                openEditActivityModal(target);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Activity</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
