import { Module } from '@nestjs/common';
import { DriverAccountGuard } from '../common/driver-account.guard';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  controllers: [DriverController],
  providers: [DriverService, DriverAccountGuard],
})
export class DriverModule {}
