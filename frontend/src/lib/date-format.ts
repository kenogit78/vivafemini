
export function formatMonthLabel(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const date = new Date(Number(yearStr), Number(monthStr) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatOrdinalDate(dateInput: string | Date): string {
  const date =
    typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${month} ${day}${suffix}`;
}

export function formatTime(dateInput: string | Date): string {
  const date =
    typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date
    .toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
    .toLowerCase();
}

export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export interface MonthOption {
  value: string;
  label: string;
}

export function getCurrentMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthOptions(): MonthOption[] {
  const now = new Date();
  const options: MonthOption[] = [];

  for (let i = 0; i < 12; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = getCurrentMonthKey(d);
    options.push({ value, label: formatMonthLabel(value) });
  }

  return options;
}
