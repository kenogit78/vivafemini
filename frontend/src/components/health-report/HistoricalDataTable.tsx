'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Copy, Download, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { emitDataChanged } from '@/lib/app-events';
import { cn } from '@/lib/cn';
import {
  formatMonthLabel,
  formatOrdinalDate,
  formatTime,
  getMonthOptions,
  type MonthOption,
} from '@/lib/date-format';
import type { SymptomLog } from '@/types';

export interface HistoricalDataTableProps {
  logs: SymptomLog[];
  month: string;
  onMonthChange: (month: string) => void;
  onDownloadPdf: () => void;
}

export function HistoricalDataTable({
  logs,
  month,
  onMonthChange,
  onDownloadPdf,
}: HistoricalDataTableProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const monthOptions = getMonthOptions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMonth = (option: MonthOption): void => {
    onMonthChange(option.value);
    setDropdownOpen(false);
  };

  const handleCopyRow = async (log: SymptomLog): Promise<void> => {
    const text = `${formatOrdinalDate(log.date)} | ${log.topSymptom} | ${log.totalSymptoms} symptoms | ${log.notes}`;
    await navigator.clipboard.writeText(text);
  };

  const logDateParam = (date: string): string =>
    date.includes('T') ? date.split('T')[0] : date.slice(0, 10);

  const handleDelete = async (logId: string): Promise<void> => {
    if (!window.confirm('Delete this symptom log?')) {
      return;
    }
    await api.deleteSymptomLog(logId);
    emitDataChanged();
  };

  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-text-primary">
            Historical Cycle Data
          </h3>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((open) => !open)}
              className="rounded-pill border border-gray-200 px-3 py-1 text-xs font-medium text-text-primary hover:border-primary/40"
            >
              {formatMonthLabel(month)} ▼
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-card border border-gray-100 bg-white py-1 shadow-lg">
                {monthOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => handleSelectMonth(option)}
                      className={cn(
                        'w-full px-4 py-2 text-left text-sm hover:bg-primary-bg',
                        option.value === month &&
                          'bg-primary-bg font-semibold text-primary',
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-primary-light active:scale-95"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download PDF
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-text-secondary">
              <th className="pb-3 pr-4 font-medium">Date</th>
              <th className="pb-3 pr-4 font-medium">Top Symptom</th>
              <th className="pb-3 pr-4 font-medium">Total Symptoms</th>
              <th className="hidden pb-3 pr-4 font-medium md:table-cell">Note</th>
              <th className="pb-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-2xl" aria-hidden>
                      📅
                    </span>
                    <p className="mt-2 text-sm text-text-secondary">
                      No logs found for this month
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={cn(
                    'border-b border-gray-50',
                    index % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white',
                  )}
                >
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-text-primary">
                      {formatOrdinalDate(log.date)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatTime(log.createdAt)}
                    </p>
                  </td>
                  <td className="py-3 pr-4 text-text-primary">
                    {log.topSymptom}
                  </td>
                  <td className="py-3 pr-4 text-text-primary">
                    {log.totalSymptoms}/10
                  </td>
                  <td className="hidden max-w-[180px] truncate py-3 pr-4 text-text-secondary md:table-cell">
                    {log.notes || '—'}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={`/tracking?date=${logDateParam(log.date)}`}
                        className="rounded-full p-2 text-text-secondary hover:bg-primary-bg hover:text-primary"
                        aria-label="Edit log"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(log.id)}
                        className="rounded-full p-2 text-text-secondary hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete log"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleCopyRow(log)}
                        className="rounded-full p-2 text-text-secondary hover:bg-primary-bg hover:text-primary"
                        aria-label="Copy row"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
