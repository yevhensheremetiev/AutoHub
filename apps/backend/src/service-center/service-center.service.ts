import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateOfferingBody,
  ServiceCenterBookingDto,
  ServiceCenterDashboardDto,
  ServiceCenterOfferingDto,
  ServiceCenterProfileDto,
  UpdateBookingStatusBody,
  UpdateOfferingBody,
  UpdateServiceProfileBody,
} from '@autohub/shared';
import type { BookingStatus, Prisma } from '@prisma/client';
import {
  toApiLocationArea,
  toApiServiceType,
  toPrismaLocationArea,
  toPrismaServiceType,
} from '../common/service-enums';
import { GeocodingService } from '../geocoding/geocoding.service';
import { PrismaService } from '../prisma/prisma.service';

const bookingInclude = {
  user: { select: { name: true, email: true } },
  car: { select: { make: true, model: true, licensePlate: true } },
  offering: { select: { id: true, name: true } },
} satisfies Prisma.BookingInclude;

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

@Injectable()
export class ServiceCenterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geocoding: GeocodingService,
  ) {}

  async getDashboard(serviceId: string): Promise<ServiceCenterDashboardDto> {
    const { startOfToday, startOfTomorrow, startOfWeek } =
      this.getDateBoundaries();

    const [service, todayCount, weekCount, todayBookings] = await Promise.all([
      this.prisma.service.findUnique({
        where: { id: serviceId },
        select: { ratingAvg: true },
      }),
      this.prisma.booking.count({
        where: {
          serviceId,
          status: { not: 'CANCELLED' },
          scheduledAt: { gte: startOfToday, lt: startOfTomorrow },
        },
      }),
      this.prisma.booking.count({
        where: {
          serviceId,
          status: { not: 'CANCELLED' },
          scheduledAt: { gte: startOfWeek, lt: startOfTomorrow },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          serviceId,
          status: { not: 'CANCELLED' },
          scheduledAt: { gte: startOfToday, lt: startOfTomorrow },
        },
        include: bookingInclude,
        orderBy: { scheduledAt: 'asc' },
      }),
    ]);

    return {
      metrics: {
        todayCount,
        weekCount,
        ratingAvg: service?.ratingAvg ?? null,
      },
      todayBookings: todayBookings.map((b) => this.toBookingDto(b)),
    };
  }

  async getProfile(serviceId: string): Promise<ServiceCenterProfileDto> {
    const service = await this.requireService(serviceId);
    return this.toProfileDto(service);
  }

  async updateProfile(
    serviceId: string,
    dto: UpdateServiceProfileBody,
  ): Promise<ServiceCenterProfileDto> {
    const current = await this.requireService(serviceId);

    let resolvedLat = dto.lat;
    let resolvedLng = dto.lng;

    const addressChanged = dto.address !== current.address;
    const coordsExplicitlyProvided =
      dto.lat !== undefined && dto.lng !== undefined;

    if (addressChanged && !coordsExplicitlyProvided) {
      const geo = await this.geocoding.geocode(dto.address);
      if (geo) {
        resolvedLat = geo.lat;
        resolvedLng = geo.lng;
      }
    }

    const service = await this.prisma.service.update({
      where: { id: serviceId },
      data: {
        name: dto.name,
        address: dto.address,
        phone: dto.phone ?? null,
        hours: dto.hours ?? null,
        ...(dto.serviceType !== undefined
          ? { serviceType: toPrismaServiceType(dto.serviceType) }
          : {}),
        ...(dto.locationArea !== undefined
          ? { locationArea: toPrismaLocationArea(dto.locationArea) }
          : {}),
        ...(resolvedLat !== undefined ? { lat: resolvedLat } : {}),
        ...(resolvedLng !== undefined ? { lng: resolvedLng } : {}),
      },
    });
    return this.toProfileDto(service);
  }

  async listOfferings(serviceId: string): Promise<ServiceCenterOfferingDto[]> {
    const offerings = await this.prisma.offering.findMany({
      where: { serviceId },
      orderBy: { createdAt: 'asc' },
    });
    return offerings.map((o) => this.toOfferingDto(o));
  }

  async createOffering(
    serviceId: string,
    dto: CreateOfferingBody,
  ): Promise<ServiceCenterOfferingDto> {
    const offering = await this.prisma.offering.create({
      data: {
        serviceId,
        name: dto.name,
        description: dto.description ?? null,
        durationMinutes: dto.durationMinutes,
        priceUah: dto.priceUah,
        active: dto.active ?? true,
      },
    });
    return this.toOfferingDto(offering);
  }

  async updateOffering(
    serviceId: string,
    offeringId: string,
    dto: UpdateOfferingBody,
  ): Promise<ServiceCenterOfferingDto> {
    await this.requireOffering(serviceId, offeringId);

    const offering = await this.prisma.offering.update({
      where: { id: offeringId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.durationMinutes !== undefined
          ? { durationMinutes: dto.durationMinutes }
          : {}),
        ...(dto.priceUah !== undefined ? { priceUah: dto.priceUah } : {}),
        ...(dto.active !== undefined ? { active: dto.active } : {}),
      },
    });
    return this.toOfferingDto(offering);
  }

  async listBookings(
    serviceId: string,
    status?: BookingStatus,
  ): Promise<ServiceCenterBookingDto[]> {
    const bookings = await this.prisma.booking.findMany({
      where: {
        serviceId,
        ...(status ? { status } : {}),
      },
      include: bookingInclude,
      orderBy: { scheduledAt: 'desc' },
    });
    return bookings.map((b) => this.toBookingDto(b));
  }

  async getBooking(
    serviceId: string,
    bookingId: string,
  ): Promise<ServiceCenterBookingDto> {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, serviceId },
      include: bookingInclude,
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return this.toBookingDto(booking);
  }

  async updateBookingStatus(
    serviceId: string,
    bookingId: string,
    dto: UpdateBookingStatusBody,
  ): Promise<ServiceCenterBookingDto> {
    await this.requireBooking(serviceId, bookingId);

    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
      include: bookingInclude,
    });
    return this.toBookingDto(booking);
  }

  private async requireService(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  private async requireOffering(serviceId: string, offeringId: string) {
    const offering = await this.prisma.offering.findFirst({
      where: { id: offeringId, serviceId },
    });
    if (!offering) {
      throw new NotFoundException('Offering not found');
    }
    return offering;
  }

  private async requireBooking(serviceId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, serviceId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  private toProfileDto(service: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    hours: string | null;
    serviceType: Parameters<typeof toApiServiceType>[0];
    locationArea: Parameters<typeof toApiLocationArea>[0];
    lat: number | null;
    lng: number | null;
    ratingAvg: number | null;
    ratingCount: number;
  }): ServiceCenterProfileDto {
    return {
      id: service.id,
      name: service.name,
      address: service.address,
      phone: service.phone,
      hours: service.hours,
      serviceType: toApiServiceType(service.serviceType),
      locationArea: toApiLocationArea(service.locationArea),
      lat: service.lat,
      lng: service.lng,
      ratingAvg: service.ratingAvg,
      ratingCount: service.ratingCount,
    };
  }

  private toOfferingDto(offering: {
    id: string;
    serviceId: string;
    name: string;
    description: string | null;
    durationMinutes: number;
    priceUah: number;
    active: boolean;
    ratingAvg: number | null;
    ratingCount: number;
  }): ServiceCenterOfferingDto {
    return {
      id: offering.id,
      serviceId: offering.serviceId,
      name: offering.name,
      description: offering.description,
      durationMinutes: offering.durationMinutes,
      priceUah: offering.priceUah,
      active: offering.active,
      ratingAvg: offering.ratingAvg,
      ratingCount: offering.ratingCount,
    };
  }

  private toBookingDto(booking: BookingWithRelations): ServiceCenterBookingDto {
    const clientName =
      booking.user.name?.trim() ||
      booking.user.email?.split('@')[0] ||
      'Client';

    const plate = booking.car.licensePlate?.trim();
    const carLabel = plate
      ? `${booking.car.make} ${booking.car.model} · ${plate}`
      : `${booking.car.make} ${booking.car.model}`;

    return {
      id: booking.id,
      status: booking.status,
      scheduledAt: booking.scheduledAt.toISOString(),
      notes: booking.notes,
      clientName,
      clientEmail: booking.user.email,
      carLabel,
      offeringId: booking.offering.id,
      offeringName: booking.offering.name,
    };
  }

  private getDateBoundaries() {
    const now = new Date();
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - 6);

    return { startOfToday, startOfTomorrow, startOfWeek };
  }
}
