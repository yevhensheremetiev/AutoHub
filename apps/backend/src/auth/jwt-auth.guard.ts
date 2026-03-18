import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import jwt from 'jsonwebtoken';

const SESSION_COOKIE_NAME = 'autohub_session';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cookieHeader = request.cookies?.[SESSION_COOKIE_NAME];

    if (!cookieHeader) {
      throw new UnauthorizedException();
    }

    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    try {
      const decoded = jwt.verify(cookieHeader, secret) as { sub?: string };
      if (!decoded.sub) {
        throw new UnauthorizedException();
      }
      (request as any).userId = decoded.sub;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

