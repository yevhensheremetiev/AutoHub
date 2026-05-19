import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CreateCarBody, UpdateCarBody } from '@autohub/shared';
import { Prisma } from '../../prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.car.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForUser(userId: string, dto: CreateCarBody) {
    const licensePlate = dto.licensePlate.trim();
    try {
      return await this.prisma.car.create({
        data: {
          userId,
          make: dto.make.trim(),
          model: dto.model.trim(),
          year: dto.year ?? null,
          licensePlate,
          vin: dto.vin?.trim() || null,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = e.meta?.target;
        if (Array.isArray(target) && target.includes('vin')) {
          throw new ConflictException(
            'A vehicle with this VIN is already registered',
          );
        }
        throw new ConflictException(
          'A car with this license plate already exists in your garage',
        );
      }
      throw e;
    }
  }

  async updateForUser(userId: string, carId: string, dto: UpdateCarBody) {
    const existing = await this.prisma.car.findUnique({
      where: { id: carId },
      select: { id: true, userId: true },
    });

    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Vehicle not found');
    }

    const licensePlate = dto.licensePlate.trim();
    const vin = dto.vin?.trim() || null;

    try {
      return await this.prisma.car.update({
        where: { id: carId },
        data: {
          make: dto.make.trim(),
          model: dto.model.trim(),
          year: dto.year ?? null,
          licensePlate,
          vin,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const target = e.meta?.target;
        if (Array.isArray(target) && target.includes('vin')) {
          throw new ConflictException(
            'A vehicle with this VIN is already registered',
          );
        }
        throw new ConflictException(
          'A car with this license plate already exists in your garage',
        );
      }
      throw e;
    }
  }
}
