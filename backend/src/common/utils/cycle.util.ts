

export interface CycleCalendarInput {
  lastPeriodStart: Date;
  cycleLength: number;
  periodDuration: number;
  referenceDate?: Date;
}

export interface CycleCalendarResult {
  currentCycleDay: number;
  cycleProgress: number;
  estimatedNextPeriod: Date;
  nextPeriodDate: Date;
  nextPeriodDaysAway: number;
  ovulationWindowStart: Date;
  ovulationWindowEnd: Date;
  fertileWindowStart: Date;
  periodDays: number[];
  ovulationDays: number[];
  calendarMonth: string;
}

export function getCurrentCycleDay(
  lastPeriodStart: Date,
  cycleLength: number,
  referenceDate: Date = new Date(),
): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor(
    (referenceDate.getTime() - lastPeriodStart.getTime()) / msPerDay,
  );
  const dayInCycle = (daysSinceStart % cycleLength) + 1;
  return dayInCycle > 0 ? dayInCycle : cycleLength;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateRange(start: Date, end: Date): string {
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}–${end.getDate()}`;
  }
  return `${formatShortDate(start)}–${formatShortDate(end)}`;
}

export function getCalendarMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function buildCycleCalendar(
  input: CycleCalendarInput,
): CycleCalendarResult {
  const referenceDate = input.referenceDate ?? new Date();
  const { lastPeriodStart, cycleLength, periodDuration } = input;

  const currentCycleDay = getCurrentCycleDay(
    lastPeriodStart,
    cycleLength,
    referenceDate,
  );
  const cycleProgress = Math.min(
    100,
    Math.round((currentCycleDay / cycleLength) * 100),
  );

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceStart = Math.floor(
    (referenceDate.getTime() - lastPeriodStart.getTime()) / msPerDay,
  );
  const cyclesCompleted = Math.floor(daysSinceStart / cycleLength);

  const currentCyclePeriodStart = addDays(
    lastPeriodStart,
    cyclesCompleted * cycleLength,
  );
  const nextPeriodDate = addDays(currentCyclePeriodStart, cycleLength);
  const estimatedNextPeriod = nextPeriodDate;

  const nextPeriodDaysAway = Math.max(
    0,
    Math.ceil(
      (nextPeriodDate.getTime() - referenceDate.getTime()) / msPerDay,
    ),
  );

  const ovulationDay = Math.round(cycleLength / 2);
  const ovulationDate = addDays(currentCyclePeriodStart, ovulationDay - 1);
  const ovulationWindowStart = addDays(ovulationDate, -2);
  const ovulationWindowEnd = addDays(ovulationDate, 2);
  const fertileWindowStart = addDays(ovulationDate, -5);

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const periodDays: number[] = [];
  const ovulationDays: number[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const cycleDay = getCurrentCycleDay(
      lastPeriodStart,
      cycleLength,
      date,
    );

    if (cycleDay <= periodDuration) {
      periodDays.push(day);
    }

    const ovStart = ovulationDay - 2;
    const ovEnd = ovulationDay + 2;
    if (cycleDay >= ovStart && cycleDay <= ovEnd) {
      ovulationDays.push(day);
    }
  }

  return {
    currentCycleDay,
    cycleProgress,
    estimatedNextPeriod,
    nextPeriodDate,
    nextPeriodDaysAway,
    ovulationWindowStart,
    ovulationWindowEnd,
    fertileWindowStart,
    periodDays,
    ovulationDays,
    calendarMonth: getCalendarMonthLabel(referenceDate),
  };
}

export function averageCycleLength(
  lengths: number[],
  fallback: number,
): number {
  if (lengths.length === 0) {
    return fallback;
  }
  const sum = lengths.reduce((acc, len) => acc + len, 0);
  return Math.round(sum / lengths.length);
}
