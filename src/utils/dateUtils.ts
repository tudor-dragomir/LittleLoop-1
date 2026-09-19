import { Activity, Child, ScheduleConflict } from '../types';

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toTimeString(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Get the Monday-Sunday or Sunday-Saturday week array for a target date
export function getWeekDates(targetDateStr: string, weekStartsOnSunday = false): string[] {
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const currentDay = date.getDay(); // 0 is Sunday, 1 is Monday...
  let diff = 0;
  if (weekStartsOnSunday) {
    diff = date.getDate() - currentDay;
  } else {
    // Week starts on Monday
    diff = date.getDate() - (currentDay === 0 ? 6 : currentDay - 1);
  }
  
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(year, month - 1, diff + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    weekDates.push(`${y}-${m}-${dayNum}`);
  }
  return weekDates;
}

// Get calendar matrix for month view (includes padding days from previous/next month)
export interface MonthCalendarDay {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getMonthMatrix(year: number, monthZeroIndexed: number): MonthCalendarDay[] {
  const firstDayOfMonth = new Date(year, monthZeroIndexed, 1);
  const lastDayOfMonth = new Date(year, monthZeroIndexed + 1, 0);
  const todayStr = getTodayString();

  const days: MonthCalendarDay[] = [];
  
  // Starting day of the week (0 = Sunday, 1 = Monday)
  // Let's use Monday as start of week for parents (or Sunday) - standard 0=Sunday
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  
  // Previous month padding
  const prevMonthLastDate = new Date(year, monthZeroIndexed, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDate - i;
    const prevDate = new Date(year, monthZeroIndexed - 1, day);
    const y = prevDate.getFullYear();
    const m = String(prevDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    days.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const m = String(monthZeroIndexed + 1).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    days.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month padding to fill complete weeks (up to 35 or 42 cells)
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, monthZeroIndexed + 1, i);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    days.push({
      dateStr,
      dayNumber: i,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

// Conflict detection logic
export function detectConflicts(activities: Activity[], children: Child[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const childMap = new Map(children.map((c) => [c.id, c]));

  // Group activities by date
  const byDate = new Map<string, Activity[]>();
  for (const act of activities) {
    if (!byDate.has(act.date)) {
      byDate.set(act.date, []);
    }
    byDate.get(act.date)!.push(act);
  }

  for (const [date, dayActs] of byDate.entries()) {
    if (dayActs.length < 2) continue;

    for (let i = 0; i < dayActs.length; i++) {
      for (let j = i + 1; j < dayActs.length; j++) {
        const a = dayActs[i];
        const b = dayActs[j];

        const aStart = timeToMinutes(a.startTime);
        const aEnd = timeToMinutes(a.endTime);
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);

        const isTimeOverlapping = aStart < bEnd && bStart < aEnd;

        if (isTimeOverlapping) {
          // Check 1: Same child overlap
          const commonKids = a.childIds.filter((id) => b.childIds.includes(id));
          if (commonKids.length > 0) {
            const kidNames = commonKids.map((id) => childMap.get(id)?.name || 'Child').join(', ');
            conflicts.push({
              id: `conflict-kid-${a.id}-${b.id}`,
              type: 'same_child_overlap',
              activityA: a,
              activityB: b,
              date,
              description: `Double-booked: ${kidNames} is scheduled for both "${a.title}" (${formatTimeDisplay(a.startTime)}) and "${b.title}" (${formatTimeDisplay(b.startTime)}) simultaneously!`,
            });
          }

          // Check 2: Same driver scheduled in two different locations at the same time
          if (
            a.assignedDriver &&
            b.assignedDriver &&
            a.assignedDriver.toLowerCase() === b.assignedDriver.toLowerCase() &&
            a.location !== b.location &&
            commonKids.length === 0
          ) {
            conflicts.push({
              id: `conflict-driver-${a.id}-${b.id}`,
              type: 'driver_split',
              activityA: a,
              activityB: b,
              date,
              description: `Driver split: ${a.assignedDriver} is assigned to drive to "${a.title}" (${a.location}) and "${b.title}" (${b.location}) at overlapping times.`,
            });
          }
        } else {
          // Check 3: Tight travel window (less than 15 mins between different locations for same driver or child)
          const gap = Math.min(Math.abs(bStart - aEnd), Math.abs(aStart - bEnd));
          const sequential = (aEnd <= bStart && bStart - aEnd < 15) || (bEnd <= aStart && aStart - bEnd < 15);
          if (sequential && a.location !== b.location) {
            const commonKids = a.childIds.filter((id) => b.childIds.includes(id));
            const sameDriver = a.assignedDriver && b.assignedDriver && a.assignedDriver === b.assignedDriver;
            if (commonKids.length > 0 || sameDriver) {
              conflicts.push({
                id: `conflict-tight-${a.id}-${b.id}`,
                type: 'tight_window',
                activityA: a,
                activityB: b,
                date,
                description: `Tight transfer (${gap} min gap): only a few minutes between "${a.title}" and "${b.title}" at different locations.`,
              });
            }
          }
        }
      }
    }
  }

  return conflicts;
}

// Generate an RFC 5545 iCalendar (.ics) string
export function exportToICalendar(activities: Activity[], children: Child[]): string {
  const childMap = new Map(children.map((c) => [c.id, c]));
  
  const cleanStr = (s: string) => s.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Childrens Activity Calendar//AI Studio//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kids Activities',
  ];

  for (const act of activities) {
    const [y, m, d] = act.date.split('-');
    const [sh, sm] = act.startTime.split(':');
    const [eh, em] = act.endTime.split(':');

    const dtStart = `${y}${m}${d}T${sh}${sm}00`;
    const dtEnd = `${y}${m}${d}${eh}${em}00`;
    const kidNames = act.childIds.map((id) => childMap.get(id)?.name).filter(Boolean).join(', ');

    let description = `Children: ${kidNames}\\nCategory: ${act.category}\\nDriver: ${act.assignedDriver || 'None'}`;
    if (act.checklist && act.checklist.length > 0) {
      description += `\\n\\nPacking Checklist:\\n` + act.checklist.map((c) => `[${c.checked ? 'X' : ' '}] ${c.text}`).join('\\n');
    }
    if (act.notes) {
      description += `\\n\\nNotes: ${act.notes}`;
    }

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${act.id}@kidsactivitycalendar`);
    lines.push(`DTSTAMP:${y}${m}${d}T000000Z`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${cleanStr(`${act.title} (${kidNames})`)}`);
    lines.push(`LOCATION:${cleanStr(act.location + (act.address ? `, ${act.address}` : ''))}`);
    lines.push(`DESCRIPTION:${cleanStr(description)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// Calculate minutes until activity starts or ends
export function getActivityTimeDiffMinutes(dateStr: string, timeStr: string, referenceDate: Date = new Date()): number {
  if (!dateStr || !timeStr) return 999999;
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const targetDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const diffMs = targetDate.getTime() - referenceDate.getTime();
  return Math.round(diffMs / (60 * 1000));
}

// Request permission for Web Notifications
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    return await Notification.requestPermission();
  } catch (e) {
    return 'denied';
  }
}

// Send browser notification if supported and permitted
export function sendBrowserNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      console.warn('Browser notification failed (e.g. iframe policy)', e);
    }
  }
  return false;
}

