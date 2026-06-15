import { Module } from '@nestjs/common';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { ServiceAccountGuard } from './service-account.guard';
import { ServiceCenterController } from './service-center.controller';
import { ServiceCenterService } from './service-center.service';

@Module({
  imports: [GeocodingModule],
  controllers: [ServiceCenterController],
  providers: [ServiceCenterService, ServiceAccountGuard],
})
export class ServiceCenterModule {}
