import React from 'react';
import { Plus, Users, Edit2, UserCog } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { ActivityCategory } from '../types';
import { CATEGORY_CONFIG } from '../utils/categoryTheme';

export const ChildFilterBar: React.FC = () => {
  const {
    children,
    selectedChildId,
    setSelectedChildId,
    selectedCategory,
    setSelectedCategory,
    openAddChildModal,
    openEditChildModal,
    openKidsManager,
    activities,
  } = useCalendar();

  // Count activities per child
  const getChildCount = (childId: string) => {
    return activities.filter((a) => a.childIds.includes(childId)).length;
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
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8 no-print transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        
        {/* Child Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Kids:
          </span>

          {/* All Children Button */}
          <button
            id="filter-child-all"
            onClick={() => setSelectedChildId('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedChildId === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Kids</span>
            <span
              className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedChildId === 'all'
                  ? 'bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {activities.length}
            </span>
          </button>

          {/* Individual Child Buttons */}
          {children.map((child) => {
            const isSelected = selectedChildId === child.id;
            const count = getChildCount(child.id);

            return (
              <div key={child.id} className="relative group shrink-0">
                <button
                  id={`filter-child-${child.id}`}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? `${child.badgeClass} ring-2 ring-offset-1 ring-slate-400/30 dark:ring-offset-slate-900 shadow-xs`
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-sm leading-none">{child.avatar}</span>
                  <span>{child.name}</span>
                  {child.age && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                      ({child.age})
                    </span>
                  )}
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-white/80 dark:bg-black/30 text-slate-800 dark:text-slate-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>

                {/* Edit Child Mini Button on hover */}
                <button
                  id={`edit-child-btn-${child.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openKidsManager('edit', child);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1.5 -right-1.5 p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs cursor-pointer"
                  title={`Edit ${child.name}'s profile`}
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>
              </div>
            );
          })}

          {/* Add Child Button */}
          <button
            id="add-child-btn"
            onClick={() => openKidsManager('add')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-dashed border-slate-300 dark:border-slate-600 shrink-0 cursor-pointer"
            title="Add another child"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>Add Kid</span>
          </button>

          {/* Manage Kids Button */}
          <button
            id="manage-kids-header-btn"
            onClick={() => openKidsManager('list')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
            title="Manage kid profiles, signature colors, and notes"
          >
            <UserCog className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Manage</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-1 md:pt-0">
          <button
            id="filter-category-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            All Types
          </button>
          {categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isCatActive = selectedCategory === cat;
            const Icon = config.icon;
            return (
              <button
                key={cat}
                id={`filter-category-${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  isCatActive
                    ? `${config.badgeClass} font-semibold`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{config.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
