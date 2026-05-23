'use client';

import Image from 'next/image';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { ArticleModal } from '@/components/ui/ArticleModal';
import { cn } from '@/lib/cn';
import type { Article } from '@/types';

export interface RecommendedArticlesProps {
  articles: Article[];
  className?: string;
}

interface ArticleCardProps {
  article: Article;
  className?: string;
  onRead: (article: Article) => void;
}

function ArticleCard({ article, className, onRead }: ArticleCardProps) {
  return (
    <article
      className={cn(
        'w-[200px] shrink-0 overflow-hidden rounded-card bg-white shadow-sm transition-shadow duration-200 hover:shadow-md sm:w-[220px] lg:w-auto',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onRead(article)}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] w-full bg-primary-bg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 200px, 33vw"
          />
        </div>
        <div className="p-3">
          <h4 className="line-clamp-2 text-sm font-bold text-text-primary">
            {article.title}
          </h4>
          <span className="mt-2 inline-block text-xs font-semibold text-primary">
            Read more →
          </span>
        </div>
      </button>
    </article>
  );
}

export function RecommendedArticles({
  articles,
  className,
}: RecommendedArticlesProps) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  return (
    <section className={cn('min-w-0 overflow-hidden', className)}>
      <h3 className="mb-3 text-sm font-bold text-primary">
        Recommended for You
      </h3>

      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      {articles.length === 0 ? (
        <EmptyState
          emoji="📚"
          message="Check back soon for recommendations"
        />
      ) : (
        <>
          <div className="scrollbar-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 lg:hidden">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onRead={setActiveArticle}
              />
            ))}
          </div>

          <div className="hidden gap-3 lg:grid lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                className="w-full shrink"
                onRead={setActiveArticle}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
