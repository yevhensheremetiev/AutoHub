import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ListServicesQuery,
  PublicServiceDetailDto,
  PublicServiceListItemDto,
  ReviewListItemDto,
} from '@autohub/shared';
import { BOOKING_TIME_SLOTS } from '@autohub/shared';
import type { Prisma } from '@prisma/client';
import {
  toApiLocationArea,
  toApiServiceType,
  toPrismaLocationArea,
  toPrismaServiceType,
} from '../common/service-enums';
import { PrismaService } from '../prisma/prisma.service';

const listableServiceWhere = {
  lat: { not: null },
  lng: { not: null },
  serviceType: { not: null },
  locationArea: { not: null },
  offerings: { some: { active: true } },
} satisfies Prisma.ServiceWhereInput;

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  list(query: ListServicesQuery): Promise<PublicServiceListItemDto[]> {
    const where: Prisma.ServiceWhereInput = { ...listableServiceWhere };

    if (query.type) {
      where.serviceType = toPrismaServiceType(query.type);
    }
    if (query.locationArea) {
      where.locationArea = toPrismaLocationArea(query.locationArea);
    }

    return this.prisma.service
      .findMany({
        where,
        orderBy: { name: 'asc' },
      })
      .then((rows) =>
        rows.map((s) =>
          this.toListItem({
            ...s,
            serviceType: s.serviceType!,
            locationArea: s.locationArea!,
          }),
        ),
      );
  }

  async getById(serviceId: string): Promise<PublicServiceDetailDto> {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        ...listableServiceWhere,
      },
      include: {
        offerings: {
          where: { active: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.toDetail({
      ...service,
      serviceType: service.serviceType!,
      locationArea: service.locationArea!,
    });
  }

  getTimeSlots(): readonly string[] {
    return BOOKING_TIME_SLOTS;
  }

  async listReviews(serviceId: string): Promise<ReviewListItemDto[]> {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const reviews = await this.prisma.review.findMany({
      where: {
        booking: { serviceId },
      },
      include: {
        user: { select: { name: true, email: true } },
        booking: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => ({
      id: r.id,
      bookingId: r.bookingId,
      rating: r.rating,
      comment: r.comment,
      authorName:
        r.user.name?.trim() ||
        r.user.email?.split('@')[0] ||
        'Driver',
      createdAt: r.createdAt.toISOString(),
    }));
  }

  private toListItem(service: {
    id: string;
    name: string;
    address: string;
    serviceType: import('@prisma/client').ServiceType;
    locationArea: import('@prisma/client').ServiceLocationArea;
    lat: number | null;
    lng: number | null;
    ratingAvg: number | null;
    ratingCount: number;
  }): PublicServiceListItemDto {
    return {
      id: service.id,
      name: service.name,
      address: service.address,
      serviceType: toApiServiceType(service.serviceType)!,
      locationArea: toApiLocationArea(service.locationArea)!,
      lat: service.lat!,
      lng: service.lng!,
      ratingAvg: service.ratingAvg,
      ratingCount: service.ratingCount,
    };
  }

  private toDetail(service: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    hours: string | null;
    serviceType: import('@prisma/client').ServiceType;
    locationArea: import('@prisma/client').ServiceLocationArea;
    lat: number | null;
    lng: number | null;
    ratingAvg: number | null;
    ratingCount: number;
    offerings: {
      id: string;
      name: string;
      description: string | null;
      durationMinutes: number;
      priceUah: number;
    }[];
  }): PublicServiceDetailDto {
    const base = this.toListItem(service);
    return {
      ...base,
      phone: service.phone,
      hours: service.hours,
      offerings: service.offerings.map((o) => ({
        id: o.id,
        name: o.name,
        description: o.description,
        durationMinutes: o.durationMinutes,
        priceUah: o.priceUah,
      })),
    };
  }
}
