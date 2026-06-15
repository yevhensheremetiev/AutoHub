import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  createOfferingBodySchema,
  listBookingsQuerySchema,
  updateBookingStatusBodySchema,
  updateOfferingBodySchema,
  updateServiceProfileBodySchema,
  type CreateOfferingBody,
  type ListBookingsQuery,
  type UpdateBookingStatusBody,
  type UpdateOfferingBody,
  type UpdateServiceProfileBody,
} from '@autohub/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ServiceAccountGuard } from './service-account.guard';
import { ServiceCenterService } from './service-center.service';

@Controller('service-center')
@UseGuards(JwtAuthGuard, ServiceAccountGuard)
export class ServiceCenterController {
  constructor(private readonly serviceCenter: ServiceCenterService) {}

  private serviceId(req: Request): string {
    return (req as any).serviceId as string;
  }

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    return this.serviceCenter.getDashboard(this.serviceId(req));
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return this.serviceCenter.getProfile(this.serviceId(req));
  }

  @Patch('profile')
  updateProfile(
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateServiceProfileBodySchema))
    body: UpdateServiceProfileBody,
  ) {
    return this.serviceCenter.updateProfile(this.serviceId(req), body);
  }

  @Get('offerings')
  listOfferings(@Req() req: Request) {
    return this.serviceCenter.listOfferings(this.serviceId(req));
  }

  @Post('offerings')
  createOffering(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createOfferingBodySchema))
    body: CreateOfferingBody,
  ) {
    return this.serviceCenter.createOffering(this.serviceId(req), body);
  }

  @Patch('offerings/:offeringId')
  updateOffering(
    @Req() req: Request,
    @Param('offeringId') offeringId: string,
    @Body(new ZodValidationPipe(updateOfferingBodySchema))
    body: UpdateOfferingBody,
  ) {
    return this.serviceCenter.updateOffering(
      this.serviceId(req),
      offeringId,
      body,
    );
  }

  @Get('bookings')
  listBookings(
    @Req() req: Request,
    @Query(new ZodValidationPipe(listBookingsQuerySchema))
    query: ListBookingsQuery,
  ) {
    return this.serviceCenter.listBookings(
      this.serviceId(req),
      query.status,
    );
  }

  @Get('bookings/:bookingId')
  getBooking(@Req() req: Request, @Param('bookingId') bookingId: string) {
    return this.serviceCenter.getBooking(this.serviceId(req), bookingId);
  }

  @Patch('bookings/:bookingId/status')
  updateBookingStatus(
    @Req() req: Request,
    @Param('bookingId') bookingId: string,
    @Body(new ZodValidationPipe(updateBookingStatusBodySchema))
    body: UpdateBookingStatusBody,
  ) {
    return this.serviceCenter.updateBookingStatus(
      this.serviceId(req),
      bookingId,
      body,
    );
  }
}
