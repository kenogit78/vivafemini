'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Flame, Leaf } from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  buildCalendarGrid,
  buildWeekStrip,
  formatCalendarTodayLabel,
  formatTodayLabel,
  parseCalendarMonth,
  resolveDisplayToday,
} from '@/lib/calendar';
import {
  getCurrentCycleDay,
  getMonthCycleMarkers,
  toDateKey,
} from '@/lib/cycle-math';
import type { CycleSummary } from '@/types';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface CalendarCardProps {
  cycleSummary: CycleSummary;
}

interface DayCell {
  date: number;
  month: 'current' | 'prev' | 'next';
  fullDate: Date;
}

function DayButton({
  day,
  periodDays,
  ovulationDays,
  displayToday,
  selectedKey,
  onSelect,
}: {
  day: DayCell;
  periodDays: number[];
  ovulationDays: number[];
  displayToday: number;
  selectedKey: string | null;
  onSelect: (date: Date) => void;
}) {
  const isCurrentMonth = day.month === 'current';
  const isToday = isCurrentMonth && day.date === displayToday;
  const isPeriod = isCurrentMonth && periodDays.includes(day.date);
  const isOvulation = isCurrentMonth && ovulationDays.includes(day.date);
  const isFaded = !isCurrentMonth;
  const dateKey = toDateKey(day.fullDate);
  const isSelected = selectedKey === dateKey;

  return (
    <button
      type="button"
      onClick={() => onSelect(day.fullDate)}
      className={cn(
        'mx-auto flex h-9 w-9 max-w-full items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 sm:h-11 sm:w-11 sm:text-sm',
        isFaded && 'opacity-40',
        isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-primary-light',
        isPeriod && 'bg-white font-bold text-primary shadow-sm',
        isOvulation && !isPeriod && 'bg-indigo-400 text-white',
        !isPeriod &&
          !isOvulation &&
          isToday &&
          !isSelected &&
          'border-2 border-white bg-transparent text-white',
        !isPeriod &&
          !isOvulation &&
          !isToday &&
          !isSelected &&
          'border border-white/60 bg-transparent text-white',
      )}
      aria-label={`${day.date}${isToday ? ', today' : ''}${isSelected ? ', selected' : ''}`}
      aria-pressed={isSelected}
    >
      {day.date}
    </button>
  );
}

export function CalendarCard({ cycleSummary }: CalendarCardProps) {
  const initial = parseCalendarMonth(cycleSummary.calendarMonth);
  const [viewYear, setViewYear] = useState<number>(initial.year);
  const [viewMonthIndex, setViewMonthIndex] = useState<number>(initial.monthIndex);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const markers = useMemo(
    () =>
      getMonthCycleMarkers(
        cycleSummary.lastPeriodStart,
        cycleSummary.cycleLength,
        cycleSummary.periodDuration,
        viewYear,
        viewMonthIndex,
      ),
    [
      cycleSummary.lastPeriodStart,
      cycleSummary.cycleLength,
      cycleSummary.periodDuration,
      viewYear,
      viewMonthIndex,
    ],
  );

  const displayToday = resolveDisplayToday(
    viewYear,
    viewMonthIndex,
    markers.periodDays,
    cycleSummary.currentCycleDay,
  );

  const now = new Date();
  const isRealToday =
    now.getFullYear() === viewYear &&
    now.getMonth() === viewMonthIndex &&
    now.getDate() === displayToday;

  const monthGrid = buildCalendarGrid(viewYear, viewMonthIndex);
  const weekStrip = buildWeekStrip(viewYear, viewMonthIndex, displayToday);
  const monthLabel = `${MONTH_NAMES[viewMonthIndex]} ${viewYear}`;

  const todayLabel = isRealToday
    ? formatTodayLabel(now)
    : formatCalendarTodayLabel(viewYear, viewMonthIndex, displayToday);

  const focusDate =
    selectedDate ??
    new Date(viewYear, viewMonthIndex, displayToday);
  const focusCycleDay = getCurrentCycleDay(
    new Date(cycleSummary.lastPeriodStart),
    cycleSummary.cycleLength,
    focusDate,
  );
  const selectedKey = selectedDate ? toDateKey(selectedDate) : null;

  const shiftMonth = (delta: number): void => {
    const next = new Date(viewYear, viewMonthIndex + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonthIndex(next.getMonth());
    setSelectedDate(null);
  };

  return (
    <div className="w-full overflow-hidden rounded-card bg-gradient-to-b from-primary to-primary-light p-4 text-white shadow-lg transition-shadow duration-200 hover:shadow-md lg:max-w-[420px]">
      <p className="text-center text-xs font-medium text-white/90">{todayLabel}</p>

      <div className="mt-2 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="rounded-full p-1 hover:bg-white/20"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <Calendar className="h-5 w-5 shrink-0" aria-hidden />
        <h2 className="min-w-0 truncate text-xl font-bold">{monthLabel}</h2>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="rounded-full p-1 hover:bg-white/20"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 md:hidden">
        <div className="grid grid-cols-7 gap-0.5 text-center text-[9px] font-semibold tracking-wide text-white/80 sm:gap-1 sm:text-[10px]">
          {DAY_LABELS.map((label) => (
            <span key={`m-${label}`} className="truncate">
              {label.slice(0, 3)}
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-0.5 sm:gap-1">
          {weekStrip.map((day) => (
            <DayButton
              key={`m-${toDateKey(day.fullDate)}`}
              day={day}
              periodDays={markers.periodDays}
              ovulationDays={markers.ovulationDays}
              displayToday={displayToday}
              selectedKey={selectedKey}
              onSelect={setSelectedDate}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 hidden md:block">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold tracking-wide text-white/80">
          {DAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {monthGrid.map((day) => (
            <DayButton
              key={toDateKey(day.fullDate)}
              day={day}
              periodDays={markers.periodDays}
              ovulationDays={markers.ovulationDays}
              displayToday={displayToday}
              selectedKey={selectedKey}
              onSelect={setSelectedDate}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-card bg-white p-5 text-text-primary">
        <Flame
          className="absolute left-3 top-6 h-10 w-10 text-primary/10"
          aria-hidden
        />
        <Leaf
          className="absolute right-3 top-6 h-10 w-10 text-primary/10"
          aria-hidden
        />

        <p className="text-center text-xs text-text-secondary">
          {selectedDate ? 'Selected day — Cycle Day' : 'Today is Cycle Day'}
        </p>

        <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary-light text-3xl font-bold text-white shadow-md">
          {focusCycleDay}
        </div>

        <p className="mt-3 text-center text-xs text-text-secondary">
          Avg. Cycle: {cycleSummary.avgCycleLength} Days &nbsp; Currently:{' '}
          {cycleSummary.cycleProgress}% of 100
        </p>

        <div className="mt-3 flex justify-center px-1">
          <span className="rounded-pill border-2 border-primary px-3 py-1.5 text-center text-[10px] font-semibold leading-snug text-primary sm:text-xs">
            Next Period: {cycleSummary.nextPeriodDate} (
            {cycleSummary.nextPeriodDaysAway} Days)
          </span>
        </div>

        <p className="mt-2 text-center text-xs text-text-secondary">
          Fertile window starts {cycleSummary.fertileWindowStart}
        </p>

        <Link
          href={`/tracking?date=${toDateKey(focusDate)}`}
          className="mt-4 block w-full rounded-pill bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
        >
          Log symptoms for this day
        </Link>
      </div>
    </div>
  );
}
