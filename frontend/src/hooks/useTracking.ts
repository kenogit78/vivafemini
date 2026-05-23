'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { emitDataChanged } from '@/lib/app-events';
import type { SymptomLog } from '@/types';

export type SymptomCategory =
  | 'physicalPain'
  | 'moodAndMental'
  | 'digestion'
  | 'periodIndicators'
  | 'sexualHealth';

export interface TrackingSelection {
  physicalPain: string[];
  moodAndMental: string[];
  digestion: string[];
  periodIndicators: string[];
  sexualHealth: string[];
  flowIntensity: number;
  notes: string;
}

const INITIAL_SELECTION: TrackingSelection = {
  physicalPain: [],
  moodAndMental: [],
  digestion: [],
  periodIndicators: [],
  sexualHealth: [],
  flowIntensity: 3,
  notes: '',
};

function logToSelection(log: SymptomLog): TrackingSelection {
  return {
    physicalPain: log.physicalPain ?? [],
    moodAndMental: log.moodAndMental ?? [],
    digestion: log.digestion ?? [],
    periodIndicators: log.periodIndicators ?? [],
    sexualHealth: log.sexualHealth ?? [],
    flowIntensity: log.flowIntensity ?? 3,
    notes: log.notes ?? '',
  };
}

function monthFromDate(date: string): string {
  return date.slice(0, 7);
}

export interface UseTrackingOptions {
  logDate?: string;
}

export interface UseTrackingResult {
  logDate: string;
  existingLogId: string | null;
  loadingLog: boolean;
  selected: TrackingSelection;
  saving: boolean;
  error: string | null;
  saveSuccess: boolean;
  toggleSymptom: (category: SymptomCategory, symptom: string) => void;
  setFlowIntensity: (value: number) => void;
  setNotes: (value: string) => void;
  clearMessages: () => void;
  saveLog: () => Promise<void>;
}

export function useTracking(options: UseTrackingOptions = {}): UseTrackingResult {
  const logDate =
    options.logDate ?? new Date().toISOString().split('T')[0];

  const [selected, setSelected] =
    useState<TrackingSelection>(INITIAL_SELECTION);
  const [existingLogId, setExistingLogId] = useState<string | null>(null);
  const [loadingLog, setLoadingLog] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const loadLogForDate = async (): Promise<void> => {
      setLoadingLog(true);
      setError(null);
      try {
        const logs = await api.getSymptomLogs(monthFromDate(logDate));
        const match = logs.find((log) => log.date.startsWith(logDate));
        if (cancelled) {
          return;
        }
        if (match) {
          setExistingLogId(match.id);
          setSelected(logToSelection(match));
        } else {
          setExistingLogId(null);
          setSelected(INITIAL_SELECTION);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load symptoms',
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingLog(false);
        }
      }
    };

    void loadLogForDate();

    return () => {
      cancelled = true;
    };
  }, [logDate]);

  const toggleSymptom = useCallback(
    (category: SymptomCategory, symptom: string): void => {
      setSelected((prev) => {
        const current = prev[category];
        const exists = current.includes(symptom);
        return {
          ...prev,
          [category]: exists
            ? current.filter((s) => s !== symptom)
            : [...current, symptom],
        };
      });
    },
    [],
  );

  const setFlowIntensity = useCallback((value: number): void => {
    setSelected((prev) => ({ ...prev, flowIntensity: value }));
  }, []);

  const setNotes = useCallback((value: string): void => {
    setSelected((prev) => ({ ...prev, notes: value }));
  }, []);

  const clearMessages = useCallback((): void => {
    setError(null);
    setSaveSuccess(false);
  }, []);

  const saveLog = useCallback(async (): Promise<void> => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const { flowIntensity, notes, ...symptoms } = selected;
      const payload = {
        date: logDate,
        ...symptoms,
        flowIntensity: flowIntensity || 1,
        notes,
      };

      if (existingLogId) {
        await api.updateSymptomLog(existingLogId, payload);
      } else {
        const created = await api.saveSymptomLog(payload);
        setExistingLogId(created.id);
      }

      setSaveSuccess(true);
      emitDataChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save symptoms');
    } finally {
      setSaving(false);
    }
  }, [selected, logDate, existingLogId]);

  return {
    logDate,
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
  };
}
