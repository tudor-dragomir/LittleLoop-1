export type ActivityCategory = 
  | 'sports' 
  | 'arts' 
  | 'academics' 
  | 'social' 
  | 'health' 
  | 'other';

export type RecurrenceRule = 'none' | 'weekly' | 'biweekly';

export type TransportType = 
  | 'both' // Drop-off & Pick-up
  | 'dropoff_only' 
  | 'pickup_only' 
  | 'carpool' 
  | 'bus_walk';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Child {
  id: string;
  name: string;
  color: string; // Tailwind color key or hex
  bgLight: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  avatar: string; // Emoji or character
  age?: string;
  grade?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  title: string;
  childIds: string[]; // Supports multiple children (e.g., family swim)
  category: ActivityCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  address?: string;
  assignedDriver?: string; // e.g., 'Mom', 'Dad', 'Carpool (Sarah)'
  transportType?: TransportType;
  checklist: ChecklistItem[];
  recurrence?: RecurrenceRule;
  repeatDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  notes?: string;
  contactName?: string;
  contactPhone?: string;
  completed?: boolean;
}

export interface ScheduleConflict {
  id: string;
  type: 'same_child_overlap' | 'driver_split' | 'tight_window';
  activityA: Activity;
  activityB: Activity;
  date: string;
  description: string;
}

export type ViewMode = 'week' | 'month' | 'day' | 'agenda';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NotificationSettings {
  enabled: boolean;
  leadTimeMinutes: number; // e.g. 15, 30, 45, 60, 120 (user-defined timeframe)
  soundEnabled: boolean;
  browserAlertEnabled: boolean;
  highlightInUI: boolean;
}

export interface UpcomingAlert {
  activity: Activity;
  startsInMinutes: number;
  isStartingSoon: boolean;
  isOngoing: boolean;
}
