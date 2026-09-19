import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Calendar as CalendarIcon,
  RotateCcw,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { exportToICalendar } from '../utils/dateUtils';

export const ExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    activities,
    children,
    resetToDefaults,
  } = useCalendar();

  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const handleDownloadICS = () => {
    const icsContent = exportToICalendar(activities, children);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kids-activities-calendar.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setIsExportModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleCopyICS = () => {
    const icsContent = exportToICalendar(activities, children);
    navigator.clipboard.writeText(icsContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 no-print">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-150 transition-colors">
        
        {/* Mobile Drag Indicator */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Print & Calendar Sync
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sync with phone calendar or print for the fridge
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-600 dark:text-slate-300 overflow-y-auto flex-1">
          
          {/* Card 1: Apple / Google Calendar (.ics) */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  iCalendar (.ics) Export
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                  Universal format compatible with Apple Calendar, Google Calendar, and Outlook.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadICS}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold shadow-xs transition-colors cursor-pointer dark:border dark:border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ics file</span>
              </button>

              <button
                onClick={handleCopyICS}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
                title="Copy raw calendar data"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : 'Copy text'}
              </button>
            </div>
          </div>

          {/* Card 2: Print Schedule */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Print Family Schedule
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Clean printer-friendly layout for the refrigerator or kitchen pinboard.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Open Print View</span>
            </button>
          </div>

          {/* Card 3: Reset Data */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Want to reset sample events?</span>
            <button
              onClick={() => {
                if (confirm('Reset schedule to original sample activities and kids?')) {
                  resetToDefaults();
                  setIsExportModalOpen(false);
                }
              }}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-semibold hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
