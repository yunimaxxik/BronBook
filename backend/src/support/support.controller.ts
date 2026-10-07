import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { SupportService } from './support.service.js';
import { CreateSupportRequestDto } from './dto/create-support-request.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { MarkMessagesAsReadDto } from './dto/mark-read.dto.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import { RolesGuard, Roles } from '../common/guards/roles.guard.js';

@Controller('api')
@UseGuards(SessionAuthGuard)
export class SupportController {
  constructor(private supportService: SupportService) {}

  @Post('client/support-requests')
  async createRequest(
    @Req() req: Request,
    @Body() dto: CreateSupportRequestDto,
  ) {
    return this.supportService.createSupportRequest((req as any).user.id, dto);
  }

  @Get('client/support-requests')
  async getClientRequests(
    @Req() req: Request,
    @Query('isActive') isActive?: string,
  ) {
    const active =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.supportService.getClientRequests((req as any).user.id, active);
  }

  @Get('manager/support-requests')
  @Roles('manager', 'admin')
  @UseGuards(RolesGuard)
  async getManagerRequests(@Query('isActive') isActive?: string) {
    const active =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.supportService.getManagerRequests(active);
  }

  @Post('manager/support-requests/:id/close')
  @Roles('manager', 'admin')
  @UseGuards(RolesGuard)
  async closeRequest(@Param('id', ParseIntPipe) id: number) {
    await this.supportService.closeRequest(id);
    return { success: true };
  }

  @Get('common/support-requests/:id/messages')
  async getMessages(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = (req as any).user;
    return this.supportService.getMessages(id, user.id, user.role);
  }

  @Post('common/support-requests/:id/messages')
  async sendMessage(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    const user = (req as any).user;
    return this.supportService.sendMessage(id, user.id, dto);
  }

  @Post('common/support-requests/:id/messages/read')
  async markAsRead(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MarkMessagesAsReadDto,
  ) {
    const user = (req as any).user;
    await this.supportService.markMessagesAsRead(id, user.id, user.role, dto);
    return { success: true };
  }

  @Get('common/support-requests/:id/unread-count')
  async getUnreadCount(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = (req as any).user;
    const count = await this.supportService.getUnreadCount(
      id,
      user.id,
      user.role,
    );
    return { count };
  }
}
