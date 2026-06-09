import { Module } from '@nestjs/common';
import { DriverAccountGuard } from '../common/driver-account.guard';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService, DriverAccountGuard],
})
export class BookingsModule {}
