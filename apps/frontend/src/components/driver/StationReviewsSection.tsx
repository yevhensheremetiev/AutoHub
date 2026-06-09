import { useTranslation } from 'react-i18next';
import type { ReviewListItemDto } from '@autohub/shared';
import { MessageSquare } from 'lucide-react';

import { StarRating } from '@/components/driver/StarRating';
import { Text } from '@/components/ui/text';

type StationReviewsSectionProps = {
  reviews: ReviewListItemDto[];
  reviewCount: number;
};

function formatReviewDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function StationReviewsSection({
  reviews,
  reviewCount,
}: StationReviewsSectionProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB';

  return (
    <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-lg shadow-black/15">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-slate-400" aria-hidden />
        <Text as="h2" className="text-base font-semibold text-slate-100">
          {t('driver.reviews.sectionTitle')}
        </Text>
        <Text
          as="span"
          className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
        >
          {reviewCount}
        </Text>
      </div>
      <Text className="mt-1 text-sm text-slate-500" variant="muted">
        {t('driver.reviews.sectionHint')}
      </Text>

      {reviews.length === 0 ? (
        <Text className="mt-5 text-sm text-slate-500" variant="muted">
          {t('driver.reviews.empty')}
        </Text>
      ) : (
        <ul className="mt-5 space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="md" />
                  <Text className="text-sm font-medium text-slate-200">
                    {review.authorName}
                  </Text>
                </div>
                <Text className="text-xs text-slate-500">
                  {formatReviewDate(review.createdAt, locale)}
                </Text>
              </div>
              {review.comment ? (
                <Text className="mt-2 text-sm leading-relaxed text-slate-300">
                  {review.comment}
                </Text>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
