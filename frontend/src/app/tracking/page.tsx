'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DIGESTION, MOOD_AND_MENTAL, PHYSICAL_PAIN } from '@/constants/symptoms';
import { FlowIntensity } from '@/components/tracking/FlowIntensity';
import { LogPeriodModal } from '@/components/tracking/LogPeriodModal';
import { NotesCard } from '@/components/tracking/NotesCard';
import { PeriodIndicatorsCard } from '@/components/tracking/PeriodIndicatorsCard';
import { SexualHealthCard } from '@/components/tracking/SexualHealthCard';
import { SymptomSection } from '@/components/tracking/SymptomSection';
import { TrackingPageHeader } from '@/components/tracking/TrackingPageHeader';
import { WelcomeCard } from '@/components/tracking/WelcomeCard';
import { PageShell } from '@/components/ui/PageShell';
import { PageLoading } from '@/components/ui/PageStates';
import { Spinner } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';
import { useTracking } from '@/hooks/useTracking';

function TrackingPageContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const logDate =
    dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
      ? dateParam
      : undefined;
  const openPeriodModal = searchParams.get('log') === 'period';

  const [periodModalOpen, setPeriodModalOpen] = useState<boolean>(openPeriodModal);

  useEffect(() => {
    if (openPeriodModal) {
      setPeriodModalOpen(true);
    }
  }, [openPeriodModal]);

  const {
    logDate: activeDate,
    existingLogId,
    loadingLog,
    selected,
    saving,
    error,
    saveSuccess,
    toggleSymptom,
    setFlowIntensity,
    setNotes,
    clearMessages,
    saveLog,
  } = useTracking({ logDate });

  useEffect(() => {
    if (!saveSuccess && !error) {
      return;
    }
    const timer = setTimeout(clearMessages, 3000);
    return () => clearTimeout(timer);
  }, [saveSuccess, error, clearMessages]);

  return (
    <>
      {saveSuccess && (
        <Toast
          message={
            existingLogId
              ? 'Symptoms updated successfully!'
              : 'Symptoms saved successfully!'
          }
          variant="success"
          onDismiss={clearMessages}
        />
      )}
      {error && (
        <Toast message={error} variant="error" onDismiss={clearMessages} />
      )}

      <LogPeriodModal
        open={periodModalOpen}
        defaultDate={activeDate}
        onClose={() => setPeriodModalOpen(false)}
      />

      <PageShell className="min-w-0 space-y-4 px-4 py-4 pb-32 sm:px-5 lg:pb-8 lg:pt-6">
        <TrackingPageHeader date={activeDate} />
        {loadingLog ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 lg:items-start lg:gap-8">
            <div className="min-w-0 space-y-4">
              <WelcomeCard />
              <PeriodIndicatorsCard
                selected={selected.periodIndicators}
                onToggle={(s) => toggleSymptom('periodIndicators', s)}
              />
              <SexualHealthCard
                selected={selected.sexualHealth}
                onToggle={(s) => toggleSymptom('sexualHealth', s)}
              />
            </div>

            <div className="min-w-0 space-y-4">
              <SymptomSection
                title="Physical Pain"
                symptoms={PHYSICAL_PAIN}
                selectedSymptoms={selected.physicalPain}
                onToggle={(s) => toggleSymptom('physicalPain', s)}
              />
              <SymptomSection
                title="Mood & Mental"
                symptoms={MOOD_AND_MENTAL}
                selectedSymptoms={selected.moodAndMental}
                onToggle={(s) => toggleSymptom('moodAndMental', s)}
              />
              <SymptomSection
                title="Digestion & Appetite"
                symptoms={DIGESTION}
                selectedSymptoms={selected.digestion}
                onToggle={(s) => toggleSymptom('digestion', s)}
              />
              <FlowIntensity
                value={selected.flowIntensity}
                onChange={setFlowIntensity}
              />
              <NotesCard value={selected.notes} onChange={setNotes} />
            </div>
          </div>
        )}
      </PageShell>

      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] left-0 right-0 z-40 flex flex-col gap-2 px-4 lg:static lg:mt-4 lg:px-4 lg:pb-6">
        <button
          type="button"
          disabled={saving || loadingLog}
          onClick={() => void saveLog()}
          className="mx-auto flex w-full max-w-lg items-center justify-center gap-2 rounded-pill bg-primary py-4 text-base font-semibold text-white shadow-lg transition-all duration-150 hover:bg-primary-light active:scale-95 disabled:opacity-60"
        >
          {saving ? (
            <>
              <Spinner size="sm" />
              Saving…
            </>
          ) : (
            <>{existingLogId ? 'Update ✓' : 'Save ✓'}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => setPeriodModalOpen(true)}
          className="mx-auto w-full max-w-lg rounded-pill border-2 border-primary py-2.5 text-sm font-semibold text-primary lg:hidden"
        >
          Log period start
        </button>
      </div>
    </>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <TrackingPageContent />
    </Suspense>
  );
}
