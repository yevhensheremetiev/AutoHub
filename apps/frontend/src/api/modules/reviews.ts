import type { CreateReviewBody } from '@autohub/shared';

import { api } from '@/api/client';

export type ReviewDto = {
  id: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function createReview(body: CreateReviewBody): Promise<ReviewDto> {
  const res = await api.post<ReviewDto>('/reviews', body);
  return res.data;
}
