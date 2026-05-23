'use client';

import { CalendarCard } from '@/components/home/CalendarCard';
import { CycleHighlight } from '@/components/home/CycleHighlight';
import { DailyWidgets } from '@/components/home/DailyWidgets';
import { PregnancyTestWidget } from '@/components/home/PregnancyTestWidget';
import { QuickAction } from '@/components/home/QuickAction';
import { RecommendedArticles } from '@/components/home/RecommendedArticles';
import { ReferralBanner } from '@/components/home/ReferralBanner';
import { PageShell } from '@/components/ui/PageShell';
import { PageError, PageLoading } from '@/components/ui/PageStates';
import { useDashboard } from '@/hooks/useDashboard';

export default function HomePage() {
  const { data, loading, error, refetch } = useDashboard();

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
    <PageShell className="flex min-w-0 flex-col gap-4 px-4 py-4 sm:px-5 lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-6 lg:py-6">
      <div className="min-w-0 space-y-4 lg:max-w-[420px]">
        <CalendarCard cycleSummary={data.cycleSummary} />
        <ReferralBanner
          initialDismissed={data.user.referralBannerDismissed}
        />
        <PregnancyTestWidget
          initialDismissed={data.user.pregnancyWidgetDismissed}
          initialSelection={data.user.pregnancyTestSelection}
        />
        <QuickAction />
      </div>

      <div className="min-w-0 space-y-4">
        <CycleHighlight
          tips={data.cycleHighlights}
          currentCycleDay={data.cycleSummary.currentCycleDay}
        />
        <DailyWidgets
          dailyCheckOffs={data.dailyCheckOffs}
          trendWatch={data.trendWatch}
        />
        <RecommendedArticles articles={data.recommendedArticles} />
      </div>
    </PageShell>
  );
}
