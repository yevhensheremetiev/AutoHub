import { Module } from '@nestjs/common';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailService } from './mail.service';

@Module({
  imports: [GeocodingModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, MailService],
})
export class AuthModule {}
