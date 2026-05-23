'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { CycleTip } from '@/types';

const FALLBACK_COLORS = ['#E8F4FD', '#FFF0F5', '#FFFBF0'];
const LOOP_COPIES = 3;

export interface CycleHighlightProps {
  tips: CycleTip[];
  currentCycleDay: number;
  className?: string;
}

interface LoopedTip extends CycleTip {
  loopKey: string;
  sourceIndex: number;
}

export function CycleHighlight({
  tips,
  currentCycleDay,
  className,
}: CycleHighlightProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAdjustingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const baseTips = useMemo(() => tips.slice(0, 6), [tips]);

  const loopedTips = useMemo<LoopedTip[]>(() => {
    if (baseTips.length === 0) {
      return [];
    }
    return Array.from({ length: LOOP_COPIES }, (_, copy) =>
      baseTips.map((tip, index) => ({
        ...tip,
        sourceIndex: index,
        loopKey: `${copy}-${tip.day}-${tip.title}`,
      })),
    ).flat();
  }, [baseTips]);

  const enableLoop = baseTips.length > 1;

  const updateActiveFromScroll = useCallback((): void => {
    const root = scrollRef.current;
    if (!root || baseTips.length === 0) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const centerX = rootRect.left + rootRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    const children = Array.from(root.children) as HTMLElement[];
    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - childCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(loopedTips[closestIndex]?.sourceIndex ?? 0);
  }, [baseTips.length, loopedTips]);

  const adjustInfiniteScroll = useCallback((): void => {
    const root = scrollRef.current;
    if (!root || !enableLoop || isAdjustingRef.current) {
      return;
    }

    const segmentWidth = root.scrollWidth / LOOP_COPIES;
    const { scrollLeft } = root;

    if (scrollLeft < segmentWidth * 0.5) {
      isAdjustingRef.current = true;
      root.scrollLeft += segmentWidth;
      isAdjustingRef.current = false;
    } else if (scrollLeft > segmentWidth * 2.5) {
      isAdjustingRef.current = true;
      root.scrollLeft -= segmentWidth;
      isAdjustingRef.current = false;
    }

    updateActiveFromScroll();
  }, [enableLoop, updateActiveFromScroll]);

  const scrollToSourceIndex = useCallback(
    (sourceIndex: number): void => {
      const root = scrollRef.current;
      if (!root || baseTips.length === 0) {
        return;
      }

      const targetIndex = enableLoop
        ? baseTips.length + sourceIndex
        : sourceIndex;
      const target = root.children[targetIndex] as HTMLElement | undefined;

      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setActiveIndex(sourceIndex);
    },
    [baseTips.length, enableLoop],
  );

  
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || !enableLoop) {
      return;
    }

    const jumpToMiddle = (): void => {
      const middleCard = root.children[baseTips.length] as HTMLElement | undefined;
      if (!middleCard) {
        return;
      }
      isAdjustingRef.current = true;
      const offset =
        middleCard.offsetLeft -
        (root.clientWidth - middleCard.offsetWidth) / 2;
      root.scrollLeft = offset;
      isAdjustingRef.current = false;
      setActiveIndex(0);
    };

    jumpToMiddle();
    requestAnimationFrame(jumpToMiddle);
  }, [baseTips, enableLoop]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) {
      return;
    }

    const onScroll = (): void => {
      if (enableLoop) {
        adjustInfiniteScroll();
      } else {
        updateActiveFromScroll();
      }
    };

    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [adjustInfiniteScroll, enableLoop, updateActiveFromScroll]);

  if (baseTips.length === 0) {
    return null;
  }

  const tipDay =
    baseTips[activeIndex]?.day ?? baseTips[0]?.day ?? currentCycleDay;

  return (
    <div
      className={cn(
        'min-w-0 rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md',
        className,
      )}
    >
      <h3 className="text-center text-sm font-bold text-primary">
        Cycle Highlight
      </h3>
      <p className="mt-1 text-center text-xs text-text-secondary">
        Understand your cycle and take care during peak days
      </p>

      <div className="mt-3 flex justify-center">
        <span className="rounded-pill bg-primary-bg px-3 py-1 text-xs font-semibold text-primary">
          📅 Day {tipDay} Tip
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{
            scrollbarWidth: 'none',
            paddingInline: 'max(0px, calc(50% - 150px))',
          }}
        >
          {(enableLoop ? loopedTips : baseTips).map((tip, index) => {
            const sourceIndex = enableLoop
              ? (tip as LoopedTip).sourceIndex
              : index;
            const key = enableLoop
              ? (tip as LoopedTip).loopKey
              : `${tip.day}-${tip.title}`;

            return (
              <article
                key={key}
                className={cn(
                  'flex w-[min(260px,calc(100vw-3rem))] flex-shrink-0 flex-col rounded-2xl p-4 transition-shadow duration-200 sm:w-[280px] lg:w-[300px]',
                  'min-h-[168px]',
                  sourceIndex === activeIndex &&
                    'shadow-md ring-1 ring-primary/10',
                )}
                style={{
                  backgroundColor:
                    tip.bgColor ||
                    FALLBACK_COLORS[sourceIndex % FALLBACK_COLORS.length],
                }}
              >
                <span className="text-2xl" aria-hidden>
                  {tip.emoji}
                </span>
                <h4 className="mt-2 font-bold leading-tight text-text-primary">
                  {tip.title}
                </h4>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-text-secondary line-clamp-3">
                  {tip.body}
                </p>
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-pill bg-white/90 px-3 py-1 text-[11px] font-medium text-primary">
                  💜 {tip.tagline}
                </span>
              </article>
            );
          })}
        </div>
      </div>

      {baseTips.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {baseTips.map((tip, index) => (
            <button
              key={`dot-${tip.day}`}
              type="button"
              onClick={() => scrollToSourceIndex(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                index === activeIndex
                  ? 'w-5 bg-primary'
                  : 'w-2 bg-gray-300 hover:bg-gray-400',
              )}
              aria-label={`Go to tip ${index + 1}: ${tip.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
