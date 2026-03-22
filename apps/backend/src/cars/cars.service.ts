import { Injectable } from '@nestjs/common';
import type { CreateCarBody } from '@autohub/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return (this.prisma as any).car.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  createForUser(userId: string, dto: CreateCarBody) {
    return (this.prisma as any).car.create({
      data: {
        userId,
        make: dto.make,
        model: dto.model,
        year: dto.year ?? null,
        vin: dto.vin ?? null,
      },
    });
  }
}
