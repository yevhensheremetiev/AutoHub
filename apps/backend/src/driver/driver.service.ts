import { Injectable } from '@nestjs/common';
import type {
  DriverBookingSummaryDto,
  DriverDashboardDto,
  DriverHistoryItemDto,
  ReviewListItemDto,
} from '@autohub/shared';
import type { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const upcomingStatuses: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
];

const bookingInclude = {
  service: { select: { id: true, name: true } },
  offering: { select: { name: true, priceUah: true } },
  car: { select: { make: true, model: true, licensePlate: true } },
  review: {
    select: {
      id: true,
      bookingId: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  },
} satisfies Prisma.BookingInclude;

type BookingRow = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string): Promise<DriverDashboardDto> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const now = new Date();

    const [completedThisYear, carsCount, upcoming] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          userId,
          status: 'COMPLETED',
          scheduledAt: { gte: yearStart },
        },
        include: { offering: { select: { priceUah: true } } },
      }),
      this.prisma.car.count({ where: { userId } }),
      this.prisma.booking.findMany({
        where: {
          userId,
          status: { in: upcomingStatuses },
          scheduledAt: { gte: now },
        },
        include: bookingInclude,
        orderBy: { scheduledAt: 'asc' },
        take: 10,
      }),
    ]);

    const spentThisYearUah = completedThisYear.reduce(
      (sum, b) => sum + b.offering.priceUah,
      0,
    );

    return {
      metrics: {
        visitsThisYear: completedThisYear.length,
        spentThisYearUah,
        carsCount,
      },
      upcomingBookings: upcoming.map((b) => this.toSummary(b)),
    };
  }

  async getHistory(userId: string): Promise<DriverHistoryItemDto[]> {
    const rows = await this.prisma.booking.findMany({
      where: {
        userId,
        status: 'COMPLETED',
      },
      include: bookingInclude,
      orderBy: { scheduledAt: 'desc' },
    });

    return rows.map((b) => {
      const summary = this.toSummary(b);
      const review = b.review ? this.toReviewDto(b.review) : null;
      return {
        ...summary,
        hasReview: Boolean(review),
        review,
      };
    });
  }

  private toSummary(booking: BookingRow): DriverBookingSummaryDto {
    const plate = booking.car.licensePlate?.trim();
    const carLabel = plate
      ? `${booking.car.make} ${booking.car.model} · ${plate}`
      : `${booking.car.make} ${booking.car.model}`;

    return {
      id: booking.id,
      scheduledAt: booking.scheduledAt.toISOString(),
      status: booking.status,
      serviceId: booking.service.id,
      serviceName: booking.service.name,
      offeringName: booking.offering.name,
      carLabel,
      priceUah: booking.offering.priceUah,
    };
  }

  private toReviewDto(review: NonNullable<BookingRow['review']>): ReviewListItemDto {
    return {
      id: review.id,
      bookingId: review.bookingId,
      rating: review.rating,
      comment: review.comment,
      authorName:
        review.user.name?.trim() ||
        review.user.email?.split('@')[0] ||
        'Driver',
      createdAt: review.createdAt.toISOString(),
    };
  }
}
