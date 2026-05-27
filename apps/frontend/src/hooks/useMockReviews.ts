import { useCallback, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

import {
  addMockReview,
  subscribeMockReviews,
  getMockReviewsSnapshot,
  type AddMockReviewInput,
} from '@/mocks/reviews';

export function useMockReviews() {
  const reviews = useSyncExternalStore(
    subscribeMockReviews,
    getMockReviewsSnapshot,
    getMockReviewsSnapshot,
  );

  return { reviews };
}

export function useStationReviews(stationId: string | undefined) {
  const { reviews } = useMockReviews();

  const stationReviews = stationId
    ? reviews
        .filter((r) => r.stationId === stationId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  const ratingAverage =
    stationReviews.length > 0
      ? stationReviews.reduce((acc, r) => acc + r.rating, 0) /
        stationReviews.length
      : null;

  return { stationReviews, ratingAverage, reviewCount: stationReviews.length };
}

export function useHistoryReview(historyItemId: string) {
  const { reviews } = useMockReviews();
  const review = reviews.find((r) => r.historyItemId === historyItemId);
  const hasReview = Boolean(review);

  const { t } = useTranslation();

  const submitReview = useCallback(
    (input: Omit<AddMockReviewInput, 'authorName'>) => {
      return addMockReview({
        ...input,
        authorName: t('driver.reviews.you'),
      });
    },
    [t],
  );

  return { review, hasReview, submitReview };
}

export function getReviewComment(
  review: { comment?: string; commentKey?: string },
  t: (key: string) => string,
): string {
  if (review.comment) return review.comment;
  if (review.commentKey) return t(review.commentKey);
  return '';
}
