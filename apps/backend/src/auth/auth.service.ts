import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FIREBASE_ADMIN } from '../firebase/firebase.module';
import type { App } from 'firebase-admin/app';
import { GoogleAuthDto, MeResponseDto } from './auth.dto';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    @Inject(FIREBASE_ADMIN) private readonly firebaseApp: App,
  ) {}

  async authenticateWithGoogle(dto: GoogleAuthDto) {
    const auth = (await import('firebase-admin/auth')).getAuth(this.firebaseApp);

    let token;
    try {
      token = await auth.verifyIdToken(dto.idToken);
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const { uid, email, name } = token;

    const user = await this.prisma.user.upsert({
      where: { id: uid },
      create: {
        id: uid,
        email: email ?? null,
        name: name ?? null,
      },
      update: {
        email: email ?? null,
        name: name ?? null,
      },
    });

    const payload: AuthPayload = { sub: user.id };
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const tokenString = jwt.sign(payload, secret, {
      expiresIn: '7d',
    });

    return { user, token: tokenString };
  }

  async getMe(userId: string): Promise<MeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

