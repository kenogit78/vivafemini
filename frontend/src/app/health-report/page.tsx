'use client';

import { useCallback, useState } from 'react';
import { CycleSummaryCard } from '@/components/health-report/CycleSummaryCard';
import { FlowSummaryCard } from '@/components/health-report/FlowSummaryCard';
import { HistoricalDataTable } from '@/components/health-report/HistoricalDataTable';
import { PeriodLengthChart } from '@/components/health-report/PeriodLengthChart';
import { SymptomFrequencyCard } from '@/components/health-report/SymptomFrequencyCard';
import { PageShell } from '@/components/ui/PageShell';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { Toast } from '@/components/ui/Toast';
import { useHealthReport } from '@/hooks/useHealthReport';
import { getCurrentMonthKey } from '@/lib/date-format';

export default function HealthReportPage() {
  const [month, setMonth] = useState<string>(() => getCurrentMonthKey());
  const [pdfToast, setPdfToast] = useState<boolean>(false);
  const { data, loading, error, refetch } = useHealthReport(month);

  const handleDownloadPdf = useCallback((): void => {
    setPdfToast(true);
    window.print();
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return <PageError onRetry={() => void refetch()} />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {pdfToast && (
        <Toast
          message="Preparing PDF…"
          variant="success"
          onDismiss={() => setPdfToast(false)}
        />
      )}

      <PageShell className="min-w-0 space-y-4 px-4 py-4 pb-8 sm:px-5 lg:py-6 print:px-0">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <CycleSummaryCard cycleSummary={data.cycleSummary} month={month} />
          <FlowSummaryCard flowSummary={data.flowSummary} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <PeriodLengthChart data={data.periodLengthChart} />
          <SymptomFrequencyCard items={data.symptomFrequency} />
        </div>

        <HistoricalDataTable
          logs={data.historicalLogs}
          month={month}
          onMonthChange={setMonth}
          onDownloadPdf={handleDownloadPdf}
        />
      </PageShell>

      <footer className="mt-6 px-4 pb-2 text-center lg:mt-4 lg:pb-4 print:hidden">
        <p className="text-[10px] text-text-secondary">
          VivaFemini Menstrual health report • Generated from your tracked data
        </p>
      </footer>
    </>
  );
}
