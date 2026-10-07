import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { RentalsService } from './rentals.service.js';
import { CreateRentalDto } from './dto/create-rental.dto.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';

@Controller('api/client')
@UseGuards(SessionAuthGuard)
export class RentalsController {
  constructor(private rentalsService: RentalsService) {}

  @Post('rentals')
  async createRental(@Req() req: Request, @Body() dto: CreateRentalDto) {
    return this.rentalsService.createRental((req as any).user.id, dto);
  }

  @Get('rentals')
  async getUserRentals(@Req() req: Request) {
    return this.rentalsService.getUserRentals((req as any).user.id);
  }
}
