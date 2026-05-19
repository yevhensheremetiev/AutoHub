import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  createCarBodySchema,
  updateCarBodySchema,
  type CreateCarBody,
  type UpdateCarBody,
} from '@autohub/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { CarsService } from './cars.service';

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
  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createCarBodySchema)) body: CreateCarBody,
  ) {
    const userId = (req as any).userId as string;
    return this.carsService.createForUser(userId, body);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') carId: string,
    @Body(new ZodValidationPipe(updateCarBodySchema)) body: UpdateCarBody,
  ) {
    const userId = (req as any).userId as string;
    return this.carsService.updateForUser(userId, carId, body);
  }
}
