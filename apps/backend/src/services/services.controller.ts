import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  bookingTimeSlotsQuerySchema,
  listServicesQuerySchema,
  type BookingTimeSlotsQuery,
  type ListServicesQuery,
} from '@autohub/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ServicesService } from './services.service';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(listServicesQuerySchema))
    query: ListServicesQuery,
  ) {
    return this.services.list(query);
  }

  @Get('time-slots')
  getTimeSlots(
    @Query(new ZodValidationPipe(bookingTimeSlotsQuerySchema))
    _query: BookingTimeSlotsQuery,
  ) {
    return { slots: [...this.services.getTimeSlots()] };
  }

  @Get(':serviceId')
  getById(@Param('serviceId') serviceId: string) {
    return this.services.getById(serviceId);
  }

  @Get(':serviceId/reviews')
  listReviews(@Param('serviceId') serviceId: string) {
    return this.services.listReviews(serviceId);
  }
}
