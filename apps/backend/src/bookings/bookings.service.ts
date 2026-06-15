import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateBookingBody } from '@autohub/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createForDriver(userId: string, dto: CreateBookingBody) {
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
      select: { id: true, userId: true },
    });
    if (!car || car.userId !== userId) {
      throw new NotFoundException('Vehicle not found');
    }

    const offering = await this.prisma.offering.findFirst({
      where: {
        id: dto.offeringId,
        serviceId: dto.serviceId,
        active: true,
      },
      include: {
        service: {
          select: {
            id: true,
            lat: true,
            lng: true,
            serviceType: true,
            locationArea: true,
          },
        },
      },
    });

    if (!offering?.service.lat || !offering.service.lng) {
      throw new NotFoundException('Service not found');
    }

    const scheduledAt = parseScheduledAt(dto.date, dto.time);
    if (scheduledAt.getTime() <= Date.now()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    return this.prisma.booking.create({
      data: {
        userId,
        carId: dto.carId,
        serviceId: dto.serviceId,
        offeringId: dto.offeringId,
        scheduledAt,
        notes: dto.notes?.trim() || null,
      },
    });
  }
}

function parseScheduledAt(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}
