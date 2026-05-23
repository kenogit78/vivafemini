'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import type { Article } from '@/types';

export interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  if (!article) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-card bg-white shadow-xl">
        <div className="relative aspect-[16/10] w-full bg-primary-bg">
          <Image
            src={article.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="512px"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {article.category}
          </p>
          <h2
            id="article-modal-title"
            className="mt-1 text-xl font-bold text-text-primary"
          >
            {article.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            {article.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}
