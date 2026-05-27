export type MockReview = {
  id: string;
  /** One review per completed visit; null for seed reviews from other customers */
  historyItemId: string | null;
  stationId: string;
  rating: number;
  /** Plain text for user-submitted reviews */
  comment?: string;
  /** i18n key for seed reviews */
  commentKey?: string;
  authorName: string;
  createdAt: string;
};

export type AddMockReviewInput = {
  historyItemId: string;
  stationId: string;
  rating: number;
  comment: string;
  authorName: string;
};

const INITIAL_MOCK_REVIEWS: MockReview[] = [
  {
    id: 'rev-seed-1',
    historyItemId: 'h1',
    stationId: 'station-2',
    rating: 5,
    commentKey: 'driver.reviews.seed.h1',
    authorName: 'Yevhen S.',
    createdAt: '2026-04-03',
  },
  {
    id: 'rev-seed-2',
    historyItemId: 'h3',
    stationId: 'station-3',
    rating: 4,
    commentKey: 'driver.reviews.seed.h3',
    authorName: 'Yevhen S.',
    createdAt: '2025-11-09',
  },
  {
    id: 'rev-seed-3',
    historyItemId: null,
    stationId: 'station-1',
    rating: 5,
    commentKey: 'driver.reviews.seed.sparkWash1',
    authorName: 'Maria P.',
    createdAt: '2026-03-12',
  },
  {
    id: 'rev-seed-4',
    historyItemId: null,
    stationId: 'station-1',
    rating: 4,
    commentKey: 'driver.reviews.seed.sparkWash2',
    authorName: 'Andrii L.',
    createdAt: '2026-01-20',
  },
  {
    id: 'rev-seed-5',
    historyItemId: null,
    stationId: 'station-2',
    rating: 4,
    commentKey: 'driver.reviews.seed.autoDoc1',
    authorName: 'Iryna V.',
    createdAt: '2026-02-28',
  },
];

let reviews: MockReview[] = [...INITIAL_MOCK_REVIEWS];
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeMockReviews(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMockReviewsSnapshot(): MockReview[] {
  return reviews;
}

export function getReviewsForStation(stationId: string): MockReview[] {
  return reviews
    .filter((r) => r.stationId === stationId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getReviewForHistoryItem(
  historyItemId: string,
): MockReview | undefined {
  return reviews.find((r) => r.historyItemId === historyItemId);
}

export function getStationRatingAverage(stationId: string): number | null {
  const stationReviews = getReviewsForStation(stationId);
  if (stationReviews.length === 0) return null;
  const sum = stationReviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / stationReviews.length;
}

export function addMockReview(input: AddMockReviewInput): MockReview | null {
  if (reviews.some((r) => r.historyItemId === input.historyItemId)) {
    return null;
  }
  const review: MockReview = {
    id: `rev-${Date.now()}`,
    historyItemId: input.historyItemId,
    stationId: input.stationId,
    rating: input.rating,
    comment: input.comment,
    authorName: input.authorName,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  reviews = [...reviews, review];
  notify();
  return review;
}

/** Reset store (useful for dev); not exported to UI */
export function resetMockReviews() {
  reviews = [...INITIAL_MOCK_REVIEWS];
  notify();
}
