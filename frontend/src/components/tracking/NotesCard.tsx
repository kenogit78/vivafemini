'use client';

import { MoreHorizontal } from 'lucide-react';

export interface NotesCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesCard({ value, onChange }: NotesCardProps) {
  return (
    <div className="rounded-card bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary">
          <span aria-hidden>📋</span>
          Notes
        </h3>
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary"
          aria-label="Notes menu"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Leave A Note"
        rows={4}
        className="min-h-[80px] w-full resize-none border-0 bg-transparent text-sm text-text-primary placeholder:text-gray-300 focus:outline-none focus:ring-0"
      />
    </div>
  );
}
