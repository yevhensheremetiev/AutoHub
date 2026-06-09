import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import {
  createBookingBodySchema,
  type CreateBookingBody,
} from '@autohub/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DriverAccountGuard } from '../common/driver-account.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BookingsService } from './bookings.service';

@Controller('bookings')
@UseGuards(JwtAuthGuard, DriverAccountGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createBookingBodySchema)) body: CreateBookingBody,
  ) {
    const userId = (req as any).userId as string;
    return this.bookings.createForDriver(userId, body);
  }
}
