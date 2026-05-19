import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  createReviewBodySchema,
  updateReviewBodySchema,
  type CreateReviewBody,
  type UpdateReviewBody,
} from '@autohub/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createReviewBodySchema)) body: CreateReviewBody,
  ) {
    const userId = (req as any).userId as string;
    return this.reviewsService.createForUser(userId, body);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') reviewId: string,
    @Body(new ZodValidationPipe(updateReviewBodySchema)) body: UpdateReviewBody,
  ) {
    const userId = (req as any).userId as string;
    return this.reviewsService.updateForUser(userId, reviewId, body);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') reviewId: string) {
    const userId = (req as any).userId as string;
    await this.reviewsService.deleteForUser(userId, reviewId);
  }
}
