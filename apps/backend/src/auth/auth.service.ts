import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { FIREBASE_ADMIN } from '../firebase/firebase.module';
import type { App } from 'firebase-admin/app';
import type {
  GoogleAuthBody,
  LoginRequestBody,
  SignUpRequestBody,
} from '@autohub/shared';
import { MeResponseDto } from './auth.dto';
import jwt from 'jsonwebtoken';
import {
  randomBytes,
  randomUUID,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

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

  async signUpWithEmail(dto: SignUpRequestBody) {
    const email = dto.email.trim().toLowerCase();
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        name: `${firstName} ${lastName}`.trim(),
        passwordHash,
      },
    });

    const token = this.createSessionToken(user.id);

    return { user, token };
  }

  async loginWithEmail(dto: LoginRequestBody) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.createSessionToken(user.id);
    return { user, token };
  }

  async authenticateWithGoogle(dto: GoogleAuthBody) {
    const auth = (await import('firebase-admin/auth')).getAuth(
      this.firebaseApp,
    );

    let token;
    try {
      token = await auth.verifyIdToken(dto.idToken);
    } catch {
      throw new UnauthorizedException('Invalid Google ID token');
    }

    const { uid, email, name } = token;

    let user;
    const existingByUid = await this.prisma.user.findUnique({
      where: { id: uid },
    });

    if (existingByUid) {
      user = await this.prisma.user.update({
        where: { id: uid },
        data: {
          email: email ?? null,
          name: name ?? null,
        },
      });
    } else if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingByEmail = await this.prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingByEmail) {
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            name: name ?? existingByEmail.name,
          },
        });
      } else {
        user = await this.prisma.user.create({
          data: {
            id: uid,
            email: normalizedEmail,
            name: name ?? null,
          },
        });
      }
    } else {
      user = await this.prisma.user.create({
        data: {
          id: uid,
          email: null,
          name: name ?? null,
        },
      });
    }

    return { user, token: this.createSessionToken(user.id) };
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

  private createSessionToken(userId: string): string {
    const payload: AuthPayload = { sub: userId };
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyPassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    const [salt, storedDerivedKey] = storedPasswordHash.split(':');
    if (!salt || !storedDerivedKey) {
      return false;
    }

    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    const storedBuffer = Buffer.from(storedDerivedKey, 'hex');

    if (storedBuffer.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, derivedKey);
  }
}
