import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';

@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  async list(@Req() req: Request) {
    const userId = (req as any).userId as string;
    return this.carsService.listForUser(userId);
  }

  @Post()
  async create(@Req() req: Request, @Body() body: CreateCarDto) {
    const userId = (req as any).userId as string;
    return this.carsService.createForUser(userId, body);
  }
}
