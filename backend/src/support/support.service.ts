import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, IsNull } from 'typeorm';
import { SupportRequest } from './entities/support-request.entity.js';
import { Message } from './entities/message.entity.js';
import { CreateSupportRequestDto } from './dto/create-support-request.dto.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { MarkMessagesAsReadDto } from './dto/mark-read.dto.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportRequest)
    private requestRepo: Repository<SupportRequest>,
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private eventEmitter: EventEmitter2,
  ) {}

  // === CLIENT METHODS ===

  async createSupportRequest(
    userId: number,
    dto: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const request = this.requestRepo.create({ userId, isActive: true });
    const savedRequest = await this.requestRepo.save(request);

    const message = this.messageRepo.create({
      supportRequestId: savedRequest.id,
      authorId: userId,
      text: dto.text,
    });
    await this.messageRepo.save(message);

    this.eventEmitter.emit('support.request.created', {
      requestId: savedRequest.id,
      userId,
    });

    return savedRequest;
  }

  async getClientRequests(
    userId: number,
    isActive?: boolean,
  ): Promise<SupportRequest[]> {
    const where: any = { userId };
    if (isActive !== undefined) where.isActive = isActive;

    return this.requestRepo.find({
      where,
      relations: { messages: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getManagerRequests(isActive?: boolean): Promise<SupportRequest[]> {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;

    return this.requestRepo.find({
      where,
      relations: { user: true, messages: true },
      order: { createdAt: 'DESC' },
    });
  }

  async closeRequest(requestId: number): Promise<void> {
    await this.requestRepo.update(requestId, { isActive: false });
    this.eventEmitter.emit('support.request.closed', { requestId });
  }

  async getMessages(
    requestId: number,
    userId: number,
    userRole: string,
  ): Promise<Message[]> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Обращение не найдено');

    if (userRole === 'client' && request.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому чату');
    }

    return this.messageRepo.find({
      where: { supportRequestId: requestId },
      relations: { author: true },
      order: { sentAt: 'ASC' },
    });
  }

  async sendMessage(
    requestId: number,
    authorId: number,
    dto: SendMessageDto,
  ): Promise<Message> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });
    if (!request || !request.isActive) {
      throw new NotFoundException('Обращение не найдено или закрыто');
    }

    const message = this.messageRepo.create({
      supportRequestId: requestId,
      authorId,
      text: dto.text,
    });

    const savedMessage = await this.messageRepo.save(message);

    this.eventEmitter.emit('support.message.sent', {
      requestId,
      message: savedMessage,
      isFromClient: request.userId === authorId,
    });

    return savedMessage;
  }

  async markMessagesAsRead(
    requestId: number,
    currentUserId: number,
    userRole: string,
    dto: MarkMessagesAsReadDto,
  ): Promise<void> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });
    if (!request) throw new NotFoundException('Обращение не найдено');

    const isClient = userRole === 'client';
    const authorCondition = isClient
      ? { authorId: currentUserId }
      : { authorId: request.userId };

    await this.messageRepo.update(
      {
        supportRequestId: requestId,
        ...authorCondition, // Читаем только чужие сообщения
        readAt: IsNull(),
        sentAt: LessThanOrEqual(new Date(dto.createdBefore)),
      },
      { readAt: new Date() },
    );
  }

  async getUnreadCount(
    requestId: number,
    currentUserId: number,
    userRole: string,
  ): Promise<number> {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
    });
    if (!request) return 0;

    const isClient = userRole === 'client';
    const authorCondition = isClient
      ? { authorId: currentUserId }
      : { authorId: request.userId };

    return this.messageRepo.count({
      where: {
        supportRequestId: requestId,
        ...authorCondition,
        readAt: IsNull(),
      },
    });
  }
}
