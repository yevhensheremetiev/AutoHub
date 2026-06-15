import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DriverAccountGuard } from '../common/driver-account.guard';
import { DriverService } from './driver.service';

@Controller('driver')
@UseGuards(JwtAuthGuard, DriverAccountGuard)
export class DriverController {
  constructor(private readonly driver: DriverService) {}

  @Get('dashboard')
  getDashboard(@Req() req: Request) {
    const userId = (req as any).userId as string;
    return this.driver.getDashboard(userId);
  }

  @Get('history')
  getHistory(@Req() req: Request) {
    const userId = (req as any).userId as string;
    return this.driver.getHistory(userId);
  }
}
