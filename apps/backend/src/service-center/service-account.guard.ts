import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceAccountGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userId = (request as any).userId as string | undefined;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { accountType: true, serviceId: true },
    });

    if (!user || user.accountType !== 'SERVICE' || !user.serviceId) {
      throw new ForbiddenException('Service account required');
    }

    (request as any).serviceId = user.serviceId;
    return true;
  }
}
