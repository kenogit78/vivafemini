export interface CalendarDay {
  date: number;
  month: 'current' | 'prev' | 'next';
  fullDate: Date;
}

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

export function parseCalendarMonth(calendarMonth: string): {
  year: number;
  monthIndex: number;
} {
  const [monthName, yearStr] = calendarMonth.split(' ');
  const monthIndex = MONTH_NAMES.indexOf(monthName);
  const year = Number(yearStr);
  return { year, monthIndex: monthIndex >= 0 ? monthIndex : 0 };
}

export function buildCalendarGrid(
  year: number,
  monthIndex: number,
): CalendarDay[] {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = startOffset - 1; i >= 0; i -= 1) {
    const date = daysInPrevMonth - i;
    days.push({
      date,
      month: 'prev',
      fullDate: new Date(year, monthIndex - 1, date),
    });
  }

  for (let date = 1; date <= daysInMonth; date += 1) {
    days.push({
      date,
      month: 'current',
      fullDate: new Date(year, monthIndex, date),
    });
  }

  const remaining = 42 - days.length;
  for (let date = 1; date <= remaining; date += 1) {
    days.push({
      date,
      month: 'next',
      fullDate: new Date(year, monthIndex + 1, date),
    });
  }

  return days;
}

export function buildWeekStrip(
  year: number,
  monthIndex: number,
  centerDay: number,
): CalendarDay[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const strip: CalendarDay[] = [];

  for (let offset = -3; offset <= 3; offset += 1) {
    const date = centerDay + offset;
    if (date >= 1 && date <= daysInMonth) {
      strip.push({
        date,
        month: 'current',
        fullDate: new Date(year, monthIndex, date),
      });
    }
  }

  return strip;
}

export function resolveDisplayToday(
  year: number,
  monthIndex: number,
  periodDays: number[],
  currentCycleDay: number,
): number {
  const now = new Date();
  if (now.getFullYear() === year && now.getMonth() === monthIndex) {
    return now.getDate();
  }

  if (periodDays.length > 0) {
    return Math.min(
      periodDays[0] + Math.max(0, currentCycleDay - 1),
      new Date(year, monthIndex + 1, 0).getDate(),
    );
  }

  return 14;
}

export function formatTodayLabel(date: Date): string {
  const month = MONTH_NAMES[date.getMonth()];
  return `Today, ${month} ${date.getDate()}`;
}

export function formatCalendarTodayLabel(
  year: number,
  monthIndex: number,
  day: number,
): string {
  const month = MONTH_NAMES[monthIndex];
  return `Today, ${month} ${day}`;
}
