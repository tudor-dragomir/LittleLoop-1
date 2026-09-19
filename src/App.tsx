import React from 'react';
import { CalendarProvider, useCalendar } from './context/CalendarContext';
import { Header } from './components/Header';
import { ChildFilterBar } from './components/ChildFilterBar';
import { ConflictBanner } from './components/ConflictBanner';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { DayView } from './components/DayView';
import { AgendaView } from './components/AgendaView';
import { ActivityModal } from './components/ActivityModal';
import { ChildModal } from './components/ChildModal';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { ExportModal } from './components/ExportModal';
import { UpcomingAlertBanner } from './components/UpcomingAlertBanner';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { NotificationDrawerModal } from './components/NotificationDrawerModal';
import { KidsManagerModal } from './components/KidsManagerModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { formatFullDate, formatTimeDisplay } from './utils/dateUtils';

const MainCalendarContent: React.FC = () => {
  const { viewMode, filteredActivities, children } = useCalendar();
  const childMap = new Map(children.map((c) => [c.id, c]));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-20 md:pb-0 transition-colors duration-200">
      <Header />
      <UpcomingAlertBanner />
      <ChildFilterBar />
      <ConflictBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-2">
        {viewMode === 'week' && <WeekView />}
        {viewMode === 'month' && <MonthView />}
        {viewMode === 'day' && <DayView />}
        {viewMode === 'agenda' && <AgendaView />}
      </main>

      {/* Modals & Mobile Drawer */}
      <ActivityModal />
      <ChildModal />
      <KidsManagerModal />
      <ActivityDetailModal />
      <ExportModal />
      <NotificationSettingsModal />
      <NotificationDrawerModal />

      {/* Mobile-first Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Special Print-Only View */}
      <div className="hidden print-only p-8 text-black bg-white">
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Family Activity Schedule</h1>
            <p className="text-sm text-slate-600">Generated for Refrigerator / Family Bulletin Board</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Printed on {new Date().toLocaleDateString()}</span>
            <span className="text-xs font-bold text-slate-800">
              Kids: {children.map((c) => `${c.avatar} ${c.name}`).join(' | ')}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((act) => {
            const kids = children.filter((c) => act.childIds.includes(c.id));
            return (
              <div key={act.id} className="border border-slate-300 rounded-lg p-3 page-break-inside-avoid">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {formatFullDate(act.date)} &bull; {formatTimeDisplay(act.startTime)} – {formatTimeDisplay(act.endTime)}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-600">
                      <strong>Kids:</strong> {kids.map((k) => k.name).join(', ')} | <strong>Location:</strong> {act.location} {act.address ? `(${act.address})` : ''} | <strong>Driver:</strong> {act.assignedDriver || 'None'}
                    </p>
                  </div>
                </div>
                {act.checklist.length > 0 && (
                  <div className="mt-2 text-xs border-t border-slate-200 pt-1.5">
                    <span className="font-semibold text-slate-700">Packing List:</span>{' '}
                    {act.checklist.map((c) => `[ ] ${c.text}`).join('   ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CalendarProvider>
      <MainCalendarContent />
    </CalendarProvider>
  );
}
