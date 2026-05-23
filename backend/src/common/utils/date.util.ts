import { BadRequestException } from '@nestjs/common';

export interface MonthRange {
  start: Date;
  end: Date;
  label: string;
}

export function parseMonthParam(month?: string): MonthRange | null {
  if (!month) {
    return null;
  }

  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) {
    throw new BadRequestException(
      'Invalid month format. Use YYYY-MM (e.g. 2025-10)',
    );
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    throw new BadRequestException('Invalid month value');
  }

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

  return {
    start,
    end,
    label: month,
  };
}

export function getDatesInMonth(year: number, monthIndex: number): string[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const dates: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, monthIndex, day);
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}
