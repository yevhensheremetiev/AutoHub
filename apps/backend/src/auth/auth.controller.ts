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
import type { Request, Response } from 'express';
import { googleAuthSchema, type GoogleAuthBody } from '@autohub/shared';
import { AuthService } from './auth.service';
import { MeResponseDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';

const SESSION_COOKIE_NAME = 'autohub_session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request): Promise<MeResponseDto> {
    const userId = (req as any).userId as string;
    return this.authService.getMe(userId);
  }
}
