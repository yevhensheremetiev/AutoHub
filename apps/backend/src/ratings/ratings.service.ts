import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Recompute cached ratings for the offering and service tied to a booking. */
  async refreshForBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      select: { offeringId: true, serviceId: true },
    });
    if (!booking) return;

    await Promise.all([
      this.refreshOffering(booking.offeringId),
      this.refreshService(booking.serviceId),
    ]);
  }

  async refreshOffering(offeringId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { booking: { offeringId } },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.offering.update({
      where: { id: offeringId },
      data: this.toRatingFields(stats._count.id, stats._avg.rating),
    });
  }

  async refreshService(serviceId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { booking: { serviceId } },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.service.update({
      where: { id: serviceId },
      data: this.toRatingFields(stats._count.id, stats._avg.rating),
    });
  }

  private toRatingFields(count: number, avg: number | null) {
    return {
      ratingCount: count,
      ratingAvg: count > 0 && avg != null ? avg : null,
    };
  }
}
