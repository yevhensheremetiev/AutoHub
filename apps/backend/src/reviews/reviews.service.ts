import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateReviewBody, UpdateReviewBody } from '@autohub/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RatingsService } from '../ratings/ratings.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ratings: RatingsService,
  ) {}

  async createForUser(userId: string, dto: CreateReviewBody) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      select: { id: true, userId: true, status: true, review: { select: { id: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (booking.userId !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }
    if (booking.status !== 'COMPLETED') {
      throw new BadRequestException('Only completed bookings can be reviewed');
    }
    if (booking.review) {
      throw new BadRequestException('This booking already has a review');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        bookingId: dto.bookingId,
        rating: dto.rating,
        comment: dto.comment?.trim() || null,
      },
    });

    await this.ratings.refreshForBooking(dto.bookingId);
    return review;
  }

  async updateForUser(userId: string, reviewId: string, dto: UpdateReviewBody) {
    const existing = await this.getOwnedReview(userId, reviewId);

    const review = await this.prisma.review.update({
      where: { id: existing.id },
      data: {
        rating: dto.rating,
        comment:
          dto.comment === undefined
            ? undefined
            : dto.comment === null
              ? null
              : dto.comment.trim() || null,
      },
    });

    await this.ratings.refreshForBooking(existing.bookingId);
    return review;
  }

  async deleteForUser(userId: string, reviewId: string) {
    const existing = await this.getOwnedReview(userId, reviewId);

    await this.prisma.review.delete({ where: { id: existing.id } });
    await this.ratings.refreshForBooking(existing.bookingId);
  }

  private async getOwnedReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true, bookingId: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    return review;
  }
}
