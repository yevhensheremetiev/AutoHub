import { ConflictException, Injectable } from '@nestjs/common';
import type { CreateCarBody } from '@autohub/shared';
import { Prisma } from '@prisma/client';
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
        throw new ConflictException(
          'A car with this license plate already exists in your garage',
        );
      }
      throw e;
    }
  }
}
