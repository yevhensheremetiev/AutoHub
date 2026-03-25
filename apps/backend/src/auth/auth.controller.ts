import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  forgotPasswordRequestSchema,
  googleAuthSchema,
  loginRequestSchema,
  resetPasswordRequestSchema,
  signUpRequestSchema,
  type ForgotPasswordRequestBody,
  type GoogleAuthBody,
  type LoginRequestBody,
  type ResetPasswordRequestBody,
  type SignUpRequestBody,
} from '@autohub/shared';
import { AuthService } from './auth.service';
import { MeResponseDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

const SESSION_COOKIE_NAME = 'autohub_session';
const AUTH_THROTTLE_TTL_MS = 60_000;
const AUTH_CREDENTIAL_LIMIT = 60;
const AUTH_FORGOT_PASSWORD_LIMIT = 20;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: AUTH_CREDENTIAL_LIMIT, ttl: AUTH_THROTTLE_TTL_MS } })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body(new ZodValidationPipe(signUpRequestSchema)) body: SignUpRequestBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MeResponseDto> {
    const { user, token } = await this.authService.signUpWithEmail(body);

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Throttle({ default: { limit: AUTH_CREDENTIAL_LIMIT, ttl: AUTH_THROTTLE_TTL_MS } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(loginRequestSchema)) body: LoginRequestBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MeResponseDto> {
    const { user, token } = await this.authService.loginWithEmail(body);

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @Throttle({ default: { limit: AUTH_CREDENTIAL_LIMIT, ttl: AUTH_THROTTLE_TTL_MS } })
  @Post('google')
  @HttpCode(HttpStatus.OK)
  async authenticateWithGoogle(
    @Body(new ZodValidationPipe(googleAuthSchema)) body: GoogleAuthBody,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MeResponseDto> {
    const { user, token } = await this.authService.authenticateWithGoogle(body);

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  @SkipThrottle()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  @Throttle({ default: { limit: AUTH_FORGOT_PASSWORD_LIMIT, ttl: AUTH_THROTTLE_TTL_MS } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body(new ZodValidationPipe(forgotPasswordRequestSchema))
    body: ForgotPasswordRequestBody,
  ): Promise<void> {
    await this.authService.requestPasswordReset(body.email);
  }

  @Throttle({ default: { limit: AUTH_CREDENTIAL_LIMIT, ttl: AUTH_THROTTLE_TTL_MS } })
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordRequestSchema))
    body: ResetPasswordRequestBody,
  ): Promise<void> {
    await this.authService.resetPasswordWithToken(body.token, body.password);
  }

  @SkipThrottle()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<MeResponseDto> {
    const userId = (req as any).userId as string;
    return this.authService.getMe(userId);
  }
}
