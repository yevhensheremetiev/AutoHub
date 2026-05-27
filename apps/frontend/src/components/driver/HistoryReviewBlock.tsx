import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import type { TFunction } from 'i18next';
import { Star } from 'lucide-react';

import { StarRating } from '@/components/driver/StarRating';
import { StarRatingInput } from '@/components/driver/StarRatingInput';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { getReviewComment, useHistoryReview } from '@/hooks/useMockReviews';
import { cn } from '@/lib/utils';

function createLeaveReviewSchema(t: TFunction) {
  return z.object({
    rating: z
      .number({ message: t('driver.reviews.validation.ratingRequired') })
      .int()
      .min(1, { message: t('driver.reviews.validation.ratingRequired') })
      .max(5),
    comment: z
      .string()
      .trim()
      .min(10, { message: t('driver.reviews.validation.commentMin') })
      .max(2000, { message: t('driver.reviews.validation.commentMax') }),
  });
}

type LeaveReviewFormValues = z.infer<ReturnType<typeof createLeaveReviewSchema>>;

type HistoryReviewBlockProps = {
  historyItemId: string;
  stationId: string;
};

export function HistoryReviewBlock({
  historyItemId,
  stationId,
}: HistoryReviewBlockProps) {
  const { t } = useTranslation();
  const { review, hasReview, submitReview } = useHistoryReview(historyItemId);
  const [expanded, setExpanded] = useState(false);

  const schema = useMemo(() => createLeaveReviewSchema(t), [t]);

  const form = useForm<LeaveReviewFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = form.watch('rating');

  if (hasReview && review) {
    return (
      <div className="mt-3 rounded-xl border border-slate-800/60 bg-slate-950/30 p-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden />
          <span>{t('driver.reviews.yourReview')}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <StarRating value={review.rating} />
          <Text className="text-xs text-slate-500">{review.createdAt}</Text>
        </div>
        <Text className="mt-2 text-sm text-slate-300">
          {getReviewComment(review, t)}
        </Text>
      </div>
    );
  }

  if (!expanded) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 h-8 rounded-lg border-slate-700 bg-slate-900/60 text-xs text-slate-200 hover:bg-slate-800"
        onClick={() => setExpanded(true)}
      >
        {t('driver.reviews.leaveReview')}
      </Button>
    );
  }

  const onSubmit = form.handleSubmit((values) => {
    const result = submitReview({
      historyItemId,
      stationId,
      rating: values.rating,
      comment: values.comment,
    });
    if (result) {
      setExpanded(false);
      form.reset();
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="mt-3 space-y-3 rounded-xl border border-slate-800/60 bg-slate-950/30 p-3"
    >
      <Text className="text-xs font-medium text-slate-400">
        {t('driver.reviews.formTitle')}
      </Text>

      <div>
        <StarRatingInput
          value={rating}
          onChange={(v) =>
            form.setValue('rating', v, { shouldValidate: true })
          }
        />
        {form.formState.errors.rating && (
          <Text className="mt-1 text-xs text-red-400">
            {form.formState.errors.rating.message}
          </Text>
        )}
      </div>

      <div>
        <label htmlFor={`review-comment-${historyItemId}`} className="sr-only">
          {t('driver.reviews.commentLabel')}
        </label>
        <textarea
          id={`review-comment-${historyItemId}`}
          rows={3}
          placeholder={t('driver.reviews.commentPlaceholder')}
          className={cn(
            'w-full resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary',
          )}
          {...form.register('comment')}
        />
        {form.formState.errors.comment && (
          <Text className="mt-1 text-xs text-red-400">
            {form.formState.errors.comment.message}
          </Text>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="h-8 rounded-lg text-xs">
          {t('driver.reviews.submit')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-slate-700 text-xs"
          onClick={() => {
            setExpanded(false);
            form.reset();
          }}
        >
          {t('driver.reviews.cancel')}
        </Button>
      </div>
    </form>
  );
}
