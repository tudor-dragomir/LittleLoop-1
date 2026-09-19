import { ActivityCategory } from '../types';
import {
  Trophy,
  Palette,
  GraduationCap,
  Sparkles,
  HeartPulse,
  Tag,
  LucideIcon
} from 'lucide-react';

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
  bgLight: string;
  textClass: string;
  borderClass: string;
}

export const CATEGORY_CONFIG: Record<ActivityCategory, CategoryMeta> = {
  sports: {
    label: 'Sports & Fitness',
    icon: Trophy,
    badgeClass: 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    textClass: 'text-orange-700 dark:text-orange-300',
    borderClass: 'border-orange-300 dark:border-orange-700',
  },
  arts: {
    label: 'Arts & Music',
    icon: Palette,
    badgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    textClass: 'text-purple-700 dark:text-purple-300',
    borderClass: 'border-purple-300 dark:border-purple-700',
  },
  academics: {
    label: 'Academics & STEM',
    icon: GraduationCap,
    badgeClass: 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800',
    bgLight: 'bg-sky-50 dark:bg-sky-950/40',
    textClass: 'text-sky-700 dark:text-sky-300',
    borderClass: 'border-sky-300 dark:border-sky-700',
  },
  social: {
    label: 'Social & Parties',
    icon: Sparkles,
    badgeClass: 'bg-pink-100 dark:bg-pink-950/80 text-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-800',
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    textClass: 'text-pink-700 dark:text-pink-300',
    borderClass: 'border-pink-300 dark:border-pink-700',
  },
  health: {
    label: 'Health & Care',
    icon: HeartPulse,
    badgeClass: 'bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-300 dark:border-teal-800',
    bgLight: 'bg-teal-50 dark:bg-teal-950/40',
    textClass: 'text-teal-700 dark:text-teal-300',
    borderClass: 'border-teal-300 dark:border-teal-700',
  },
  other: {
    label: 'General & Family',
    icon: Tag,
    badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    bgLight: 'bg-slate-50 dark:bg-slate-800/60',
    textClass: 'text-slate-700 dark:text-slate-300',
    borderClass: 'border-slate-300 dark:border-slate-700',
  },
};
