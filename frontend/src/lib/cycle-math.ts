

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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

export interface MonthCycleMarkers {
  periodDays: number[];
  ovulationDays: number[];
}

export function getMonthCycleMarkers(
  lastPeriodStartIso: string,
  cycleLength: number,
  periodDuration: number,
  year: number,
  monthIndex: number,
): MonthCycleMarkers {
  const lastPeriodStart = new Date(lastPeriodStartIso);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const ovulationDay = Math.round(cycleLength / 2);
  const periodDays: number[] = [];
  const ovulationDays: number[] = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, monthIndex, day);
    const cycleDay = getCurrentCycleDay(lastPeriodStart, cycleLength, date);

    if (cycleDay <= periodDuration) {
      periodDays.push(day);
    }

    const ovStart = ovulationDay - 2;
    const ovEnd = ovulationDay + 2;
    if (cycleDay >= ovStart && cycleDay <= ovEnd) {
      ovulationDays.push(day);
    }
  }

  return { periodDays, ovulationDays };
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
