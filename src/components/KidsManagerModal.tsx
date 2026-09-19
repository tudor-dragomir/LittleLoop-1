import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  X,
  Edit2,
  Trash2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Heart,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { Child } from '../types';
import { COLOR_PRESETS } from '../data/sampleData';
import { formatTimeDisplay } from '../utils/dateUtils';

const EMOJI_OPTIONS = [
  '⚽', '🎨', '🦖', '🩰', '🏊', '🎹', '🥋', '🚀',
  '🦄', '🌟', '🏀', '🛹', '🎸', '📚', '🐶', '🏎️',
  '🚴', '🎭', '🎾', '🧁', '🔬', '🏐', '🧗', '🎮'
];

export const KidsManagerModal: React.FC = () => {
  const {
    isKidsManagerOpen,
    closeKidsManager,
    kidsManagerInitialView,
    kidsManagerInitialChild,
    children,
    activities,
    addChild,
    updateChild,
    deleteChild,
    setSelectedChildId,
  } = useCalendar();

  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentEditingChild, setCurrentEditingChild] = useState<Child | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Child | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('⚽');
  const [selectedPreset, setSelectedPreset] = useState(COLOR_PRESETS[0]);
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize or reset when modal opens or initial view changes
  useEffect(() => {
    if (isKidsManagerOpen) {
      setView(kidsManagerInitialView || 'list');
      setDeleteCandidate(null);
      setValidationError(null);

      if (kidsManagerInitialView === 'edit' && kidsManagerInitialChild) {
        setupFormForChild(kidsManagerInitialChild);
      } else if (kidsManagerInitialView === 'add') {
        setupFormForNewChild();
      }
    }
  }, [isKidsManagerOpen, kidsManagerInitialView, kidsManagerInitialChild]);

  if (!isKidsManagerOpen) return null;

  const setupFormForChild = (child: Child) => {
    setCurrentEditingChild(child);
    setName(child.name);
    setAvatar(child.avatar);
    const matchedPreset = COLOR_PRESETS.find((p) => p.color === child.color) || COLOR_PRESETS[0];
    setSelectedPreset(matchedPreset);
    setAge(child.age || '');
    setGrade(child.grade || '');
    setNotes(child.notes || '');
    setValidationError(null);
  };

  const setupFormForNewChild = () => {
    setCurrentEditingChild(null);
    setName('');
    // Pick an unused emoji if possible
    const usedAvatars = new Set(children.map((c) => c.avatar));
    const availableEmoji = EMOJI_OPTIONS.find((e) => !usedAvatars.has(e)) || '🌟';
    setAvatar(availableEmoji);

    // Pick an unused color preset if possible
    const usedColors = new Set(children.map((c) => c.color));
    const availablePreset = COLOR_PRESETS.find((p) => !usedColors.has(p.color)) || COLOR_PRESETS[children.length % COLOR_PRESETS.length];
    setSelectedPreset(availablePreset);

    setAge('');
    setGrade('');
    setNotes('');
    setValidationError(null);
  };

  const handleStartAdd = () => {
    setupFormForNewChild();
    setView('add');
  };

  const handleStartEdit = (child: Child) => {
    setupFormForChild(child);
    setView('edit');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter the child\'s name.');
      return;
    }

    const childPayload = {
      name: name.trim(),
      avatar,
      color: selectedPreset.color,
      bgLight: selectedPreset.bgLight,
      borderClass: selectedPreset.borderClass,
      textClass: selectedPreset.textClass,
      badgeClass: selectedPreset.badgeClass,
      age: age.trim() || undefined,
      grade: grade.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (view === 'edit' && currentEditingChild) {
      updateChild({ ...childPayload, id: currentEditingChild.id });
    } else {
      addChild(childPayload);
    }

    // Return to list view
    setView('list');
    setCurrentEditingChild(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    deleteChild(deleteCandidate.id);
    setDeleteCandidate(null);
    if (view === 'edit') {
      setView('list');
      setCurrentEditingChild(null);
    }
  };

  const getChildActivitiesCount = (childId: string) => {
    return activities.filter((a) => a.childIds.includes(childId)).length;
  };

  const getChildUpcomingActivities = (childId: string) => {
    return activities
      .filter((a) => a.childIds.includes(childId))
      .slice(0, 2);
  };

  const handleFilterToChild = (childId: string) => {
    setSelectedChildId(childId);
    closeKidsManager();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print"
      onClick={closeKidsManager}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[88vh] flex flex-col transition-colors animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            {view !== 'list' ? (
              <button
                onClick={() => setView('list')}
                className="p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Back to kids list"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 shrink-0">
                <Users className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {view === 'list'
                    ? 'Family Kids Management'
                    : view === 'add'
                    ? 'Add New Child Profile'
                    : `Edit ${currentEditingChild?.name || 'Child'}'s Profile`}
                </h2>
                {view === 'list' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                    {children.length} {children.length === 1 ? 'kid' : 'kids'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {view === 'list'
                  ? 'Manage child profiles, signature calendar colors, and schedules'
                  : 'Assign signature calendar colors, emojis, notes & gear details'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {view === 'list' && (
              <button
                id="kids-manager-add-btn"
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Kid</span>
              </button>
            )}
            <button
              id="kids-manager-close-btn"
              onClick={closeKidsManager}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 min-h-0 p-4 sm:p-5">
          {/* Delete Confirmation Alert Banner / Overlay */}
          {deleteCandidate && (
            <div className="mb-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/90 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 animate-in fade-in duration-150">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-100">
                    Remove {deleteCandidate.name} ({deleteCandidate.avatar})?
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                    {getChildActivitiesCount(deleteCandidate.id) > 0 ? (
                      <>
                        <strong>{deleteCandidate.name}</strong> is tagged in{' '}
                        <strong>{getChildActivitiesCount(deleteCandidate.id)} scheduled activities</strong>. Removing this child will remove their profile and unassign them from their activities.
                      </>
                    ) : (
                      <>Are you sure you want to remove this child profile from your family calendar?</>
                    )}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setDeleteCandidate(null)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="confirm-delete-child-btn"
                      onClick={handleConfirmDelete}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
                    >
                      Yes, Remove {deleteCandidate.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: List of Kids */}
          {view === 'list' && (
            <div className="space-y-3.5">
              {children.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      No Children Added Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                      Add profiles for your kids to track practices, lessons, carpools, and gear with signature color-coding!
                    </p>
                  </div>
                  <button
                    onClick={handleStartAdd}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add First Child</span>
                  </button>
                </div>
              ) : (
                children.map((child) => {
                  const actCount = getChildActivitiesCount(child.id);
                  const upcoming = getChildUpcomingActivities(child.id);

                  return (
                    <div
                      key={child.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs"
                    >
                      {/* Top Row: Avatar, Name, Color swatch, Stats */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Child Avatar Icon */}
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                            style={{
                              backgroundColor: `${child.color}20`,
                              borderColor: child.color,
                            }}
                          >
                            <span>{child.avatar}</span>
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {child.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${child.badgeClass}`}
                              >
                                <span
                                  className="w-2 h-2 rounded-full inline-block mr-1.5 align-middle shadow-xs"
                                  style={{ backgroundColor: child.color }}
                                />
                                {COLOR_PRESETS.find((p) => p.color === child.color)?.label || 'Signature Color'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {child.age && <span className="font-medium text-slate-700 dark:text-slate-300">{child.age}</span>}
                              {child.age && child.grade && <span>&bull;</span>}
                              {child.grade && <span className="font-medium text-slate-700 dark:text-slate-300">{child.grade}</span>}
                              {(child.age || child.grade) && <span>&bull;</span>}
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {actCount} {actCount === 1 ? 'activity' : 'activities'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Top Action Tools */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEdit(child)}
                            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title={`Edit ${child.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(child)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title={`Remove ${child.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Notes / Health / Allergies / Gear */}
                      {child.notes && (
                        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
                          <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{child.notes}</span>
                        </div>
                      )}

                      {/* Sample upcoming activities */}
                      {upcoming.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                            Recent Activities:
                          </span>
                          <div className="space-y-1">
                            {upcoming.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span
                                    className="w-2 h-2 rounded-full shrink-0 shadow-xs"
                                    style={{ backgroundColor: child.color }}
                                  />
                                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {act.title}
                                  </span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                                  {formatTimeDisplay(act.startTime)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bottom Quick Jump Action */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => handleFilterToChild(child.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer hover:underline"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>View {child.name}'s Calendar</span>
                        </button>

                        <button
                          onClick={() => handleStartEdit(child)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* VIEW: Add / Edit Child Form */}
          {(view === 'add' || view === 'edit') && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  {validationError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Child's Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo, Maya, Noah"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              {/* Avatar Icon Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choose Icon / Avatar
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`w-9 h-9 flex items-center justify-center text-lg rounded-lg transition-transform cursor-pointer ${
                        avatar === emoji
                          ? 'bg-amber-500 text-white scale-110 shadow-xs ring-2 ring-amber-400/50'
                          : 'hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:scale-105 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Calendar Color Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Signature Calendar Color
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Selected: {selectedPreset.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = selectedPreset.id === preset.id;
                    return (
                      <button
                        type="button"
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? `${preset.badgeClass} ring-2 ring-offset-1 ring-slate-400/40 dark:ring-offset-slate-900 shadow-xs font-bold`
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="truncate">{preset.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Card Preview */}
                <div className="mt-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Live Calendar Event Preview:
                  </span>
                  <div
                    className={`p-2.5 rounded-lg border flex items-center justify-between shadow-2xs ${selectedPreset.badgeClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{avatar}</span>
                      <span className="font-bold text-xs">
                        {name.trim() || 'Child'}'s Practice Session
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold opacity-90">
                      4:00 PM – 5:15 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Age & Grade */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8 yrs"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade / Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Notes / Health / Allergies */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Important Notes / Allergies / Gear Needs
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Needs inhaler before soccer, peanut allergy, swimming goggles in backpack..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                {view === 'edit' && currentEditingChild ? (
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(currentEditingChild)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Profile</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView('list')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    {view === 'edit' ? 'Save Changes' : 'Add Child'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer in List View */}
        {view === 'list' && (
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Total {children.length} {children.length === 1 ? 'child' : 'children'} &bull; {activities.length} activities
            </span>

            <button
              onClick={handleStartAdd}
              className="font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Another Kid</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
