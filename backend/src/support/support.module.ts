import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SupportRequest } from './entities/support-request.entity.js';
import { Message } from './entities/message.entity.js';
import { User } from '../users/entities/user.entity.js';
import { SupportService } from './support.service.js';
import { SupportController } from './support.controller.js';
import { SupportGateway } from './support.gateway.js';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([SupportRequest, Message, User]),
  ],
  providers: [SupportService, SupportGateway],
  controllers: [SupportController],
  exports: [SupportService],
})
export class SupportModule {}
