import {
  BadRequestException,
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
  UpdateProfileRequestBody,
} from '@autohub/shared';
import { MeResponseDto } from './auth.dto';
import { MailService } from './mail.service';
import jwt from 'jsonwebtoken';
import type { Prisma, User as PrismaUser } from '../../prisma/client';
import {
  createHash,
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

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    @Inject(FIREBASE_ADMIN) private readonly firebaseApp: App,
  ) {}

  async signUpWithEmail(dto: SignUpRequestBody) {
    const email = dto.email.trim().toLowerCase();
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();
    const accountType = dto.accountType;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use');
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const serviceId =
          accountType === 'SERVICE'
            ? (
                await (tx as any).service.create({
                  data: {
                    name: (dto.serviceName ?? '').trim(),
                    address: (dto.serviceAddress ?? '').trim(),
                  },
                })
              ).id
            : null;

        return tx.user.create({
          data: {
            id: randomUUID(),
            email,
            name: `${firstName} ${lastName}`.trim(),
            passwordHash,
            accountType,
            serviceId,
          } as any,
        });
      },
    );

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

  toMeResponse(user: PrismaUser): MeResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordSignInEnabled: Boolean(user.passwordHash),
      accountType: (user as any).accountType,
      serviceId: ((user as any).serviceId ?? null) as string | null,
    };
  }

  async getMe(userId: string): Promise<MeResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.toMeResponse(user);
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileRequestBody,
  ): Promise<MeResponseDto> {
    const name = dto.name.trim();
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return this.toMeResponse(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.passwordHash) {
      throw new BadRequestException('PASSWORD_SIGN_IN_NOT_SET');
    }

    const isCurrentValid = await this.verifyPassword(
      currentPassword,
      user.passwordHash,
    );
    if (!isCurrentValid) {
      throw new BadRequestException('INVALID_CURRENT_PASSWORD');
    }

    const passwordHash = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /** Always completes without revealing whether the email exists (email/password accounts only). */
  async requestPasswordReset(rawEmail: string): Promise<void> {
    const email = rawEmail.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.email) {
      return;
    }

    if (!user.passwordHash) {
      await this.mail.sendGoogleOnlyResetNotice(user.email);
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({
        where: { userId: user.id },
      }),
      this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const origin = this.config.get<string>('CLIENT_ORIGIN')?.replace(/\/$/, '');
    if (!origin) {
      throw new Error('CLIENT_ORIGIN is not configured');
    }

    const resetLink = `${origin}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await this.mail.sendPasswordResetEmail(user.email, resetLink);
  }

  async resetPasswordWithToken(
    rawToken: string,
    newPassword: string,
  ): Promise<void> {
    const trimmed = rawToken.trim();
    if (!trimmed.length) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const tokenHash = createHash('sha256').update(trimmed).digest('hex');

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const passwordHash = await this.hashPassword(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.delete({
        where: { id: record.id },
      }),
    ]);
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
