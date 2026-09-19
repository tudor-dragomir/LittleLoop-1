import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Clock,
  Car,
  Package,
  User,
  Phone,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { Activity, ActivityCategory, ChecklistItem } from '../types';
import { ACTIVITY_TEMPLATES } from '../data/sampleData';
import { CATEGORY_CONFIG } from '../utils/categoryTheme';
import { minutesToTime, timeToMinutes } from '../utils/dateUtils';

export const ActivityModal: React.FC = () => {
  const {
    isActivityModalOpen,
    closeActivityModal,
    editingActivity,
    activityModalDefaults,
    addActivity,
    updateActivity,
    deleteActivity,
    children,
  } = useCalendar();

  // Form State
  const [title, setTitle] = useState('');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [category, setCategory] = useState<ActivityCategory>('sports');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:15');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [assignedDriver, setAssignedDriver] = useState('Mom');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [recurrence, setRecurrence] = useState<'none' | 'weekly'>('none');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Prepopulate when modal opens
  useEffect(() => {
    if (editingActivity) {
      setTitle(editingActivity.title);
      setSelectedChildIds(editingActivity.childIds);
      setCategory(editingActivity.category);
      setDate(editingActivity.date);
      setStartTime(editingActivity.startTime);
      setEndTime(editingActivity.endTime);
      setLocation(editingActivity.location);
      setAddress(editingActivity.address || '');
      setAssignedDriver(editingActivity.assignedDriver || 'Mom');
      setChecklist(editingActivity.checklist || []);
      setRecurrence(editingActivity.recurrence === 'weekly' ? 'weekly' : 'none');
      setContactName(editingActivity.contactName || '');
      setContactPhone(editingActivity.contactPhone || '');
      setNotes(editingActivity.notes || '');
    } else if (isActivityModalOpen) {
      // New activity defaults
      setTitle('');
      setSelectedChildIds(
        activityModalDefaults.childId
          ? [activityModalDefaults.childId]
          : children.length > 0
          ? [children[0].id]
          : []
      );
      setCategory('sports');
      setDate(activityModalDefaults.date || new Date().toISOString().split('T')[0]);
      setStartTime(activityModalDefaults.startTime || '16:00');
      
      const startMins = timeToMinutes(activityModalDefaults.startTime || '16:00');
      setEndTime(minutesToTime(startMins + 60));

      setLocation('');
      setAddress('');
      setAssignedDriver('Mom');
      setChecklist([
        { id: 'item-1', text: 'Water bottle', checked: false },
      ]);
      setRecurrence('none');
      setContactName('');
      setContactPhone('');
      setNotes('');
    }
  }, [editingActivity, isActivityModalOpen, activityModalDefaults, children]);

  if (!isActivityModalOpen) return null;

  const handleApplyTemplate = (tmpl: typeof ACTIVITY_TEMPLATES[0]) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    const startMins = timeToMinutes(startTime);
    setEndTime(minutesToTime(startMins + tmpl.durationMinutes));
    setChecklist(
      tmpl.checklist.map((item, idx) => ({
        id: `tpl-${Date.now()}-${idx}`,
        text: item,
        checked: false,
      }))
    );
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: `c-${Date.now()}`,
        text: newChecklistText.trim(),
        checked: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((i) => i.id !== id));
  };

  const handleToggleChild = (childId: string) => {
    if (selectedChildIds.includes(childId)) {
      if (selectedChildIds.length > 1) {
        setSelectedChildIds(selectedChildIds.filter((id) => id !== childId));
      }
    } else {
      setSelectedChildIds([...selectedChildIds, childId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedChildIds.length === 0 || !date) return;

    const activityPayload = {
      title: title.trim(),
      childIds: selectedChildIds,
      category,
      date,
      startTime,
      endTime,
      location: location.trim(),
      address: address.trim() || undefined,
      assignedDriver: assignedDriver.trim(),
      checklist,
      recurrence,
      contactName: contactName.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      notes: notes.trim() || undefined,
      completed: editingActivity?.completed || false,
    };

    if (editingActivity) {
      updateActivity({ ...activityPayload, id: editingActivity.id });
    } else {
      addActivity(activityPayload);
    }
    closeActivityModal();
  };

  const categories: ActivityCategory[] = [
    'sports',
    'arts',
    'academics',
    'social',
    'health',
    'other',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in slide-in-from-bottom duration-150 transition-colors">
        
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingActivity ? 'Edit Activity' : 'Add New Activity'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set schedules, locations, transportation, and gear checklists
            </p>
          </div>
          <button
            onClick={closeActivityModal}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Templates (Only when adding) */}
          {!editingActivity && (
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Activity Templates:</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                {ACTIVITY_TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl.title}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950/60 hover:text-amber-900 dark:hover:text-amber-300 hover:border-amber-300 dark:hover:border-amber-700 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
                  >
                    {tmpl.title.split('/')[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Child Assignment (Multi-select) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Which Child / Children? *
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {children.map((child) => {
                const isChecked = selectedChildIds.includes(child.id);
                return (
                  <button
                    type="button"
                    key={child.id}
                    onClick={() => handleToggleChild(child.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isChecked
                        ? `${child.badgeClass} ring-2 ring-offset-1 ring-slate-400/40`
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span>{child.avatar}</span>
                    <span>{child.name}</span>
                    {isChecked && <span className="ml-1 text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Thunder FC Soccer Practice, Piano Lesson..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {categories.map((cat) => {
                const conf = CATEGORY_CONFIG[cat];
                const Icon = conf.icon;
                const isSelected = category === cat;

                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.badgeClass} ring-1 ring-offset-1 ring-amber-400/30 font-bold`
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time *
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Location & Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location Name
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Westside Community Center"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Driver / Carpool
              </label>
              <div className="relative">
                <Car className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Mom, Dad, Carpool with Sarah"
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Gear / Backpack Packing Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Equipment & Items to Bring
            </label>
            <div className="space-y-1.5 mb-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200 ml-1.5">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add gear item (e.g. Cleats, Shin guards, Goggles)..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Coach / Instructor & Parent Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Coach / Teacher Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Coach Dave / Ms. Evans"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. (555) 234-8891"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes for Parents
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Wear navy jersey, bring $5 for team pizza, bring signed permission slip..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingActivity ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this activity?')) {
                    deleteActivity(editingActivity.id);
                    closeActivityModal();
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeActivityModal}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
              >
                {editingActivity ? 'Save Changes' : 'Create Activity'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
