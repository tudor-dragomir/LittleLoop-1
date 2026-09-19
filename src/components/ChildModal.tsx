import React, { useState, useEffect } from 'react';
import { X, Trash2, User } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { COLOR_PRESETS } from '../data/sampleData';

const EMOJI_OPTIONS = [
  '⚽', '🎨', '🦖', '🩰', '🏊', '🎹', '🥋', '🚀', 
  '🦄', '🌟', '🏀', '🛹', '🎸', '📚', '🐶', '🏎️'
];

export const ChildModal: React.FC = () => {
  const {
    isChildModalOpen,
    closeChildModal,
    editingChild,
    addChild,
    updateChild,
    deleteChild,
  } = useCalendar();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('⚽');
  const [selectedColorPreset, setSelectedColorPreset] = useState(COLOR_PRESETS[0]);
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingChild) {
      setName(editingChild.name);
      setAvatar(editingChild.avatar);
      const preset = COLOR_PRESETS.find((p) => p.color === editingChild.color) || COLOR_PRESETS[0];
      setSelectedColorPreset(preset);
      setAge(editingChild.age || '');
      setGrade(editingChild.grade || '');
      setNotes(editingChild.notes || '');
    } else if (isChildModalOpen) {
      setName('');
      setAvatar('🌟');
      setSelectedColorPreset(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
      setAge('');
      setGrade('');
      setNotes('');
    }
  }, [editingChild, isChildModalOpen]);

  if (!isChildModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const childPayload = {
      name: name.trim(),
      avatar,
      color: selectedColorPreset.color,
      bgLight: selectedColorPreset.bgLight,
      borderClass: selectedColorPreset.borderClass,
      textClass: selectedColorPreset.textClass,
      badgeClass: selectedColorPreset.badgeClass,
      age: age.trim() || undefined,
      grade: grade.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (editingChild) {
      updateChild({ ...childPayload, id: editingChild.id });
    } else {
      addChild(childPayload);
    }
    closeChildModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-150 transition-colors">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {editingChild ? `Edit ${editingChild.name}'s Profile` : 'Add Child Profile'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign a signature color and icon for calendar identification
            </p>
          </div>
          <button
            onClick={closeChildModal}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Child's Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Emma, Leo, Lucas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Avatar / Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Choose an Icon / Emoji
            </label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
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

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Signature Calendar Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = selectedColorPreset.id === preset.id;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setSelectedColorPreset(preset)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? `${preset.badgeClass} ring-2 ring-offset-1 ring-slate-400/40 dark:ring-offset-slate-900 shadow-xs font-bold`
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="truncate">{preset.label}</span>
                  </button>
                );
              })}
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
              Important Notes / Allergies / Gear Info
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Asthma inhaler in bag, allergic to peanuts, wear glasses for reading..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            {editingChild ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove ${editingChild.name} and unassign them from their activities?`)) {
                    deleteChild(editingChild.id);
                    closeChildModal();
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
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
                onClick={closeChildModal}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
              >
                {editingChild ? 'Update Kid' : 'Add Kid'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
