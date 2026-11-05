import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@Injectable()
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<number, Socket>();

  constructor(private eventEmitter: EventEmitter2) {}

  handleConnection(client: Socket) {
    const session = (client.request as any).session;
    
    const userId = session?.passport?.user;

    if (!userId) {
      console.log(`Подключение отклонено: нет валидной сессии`);
      client.disconnect(); 
      return;
    }

    this.connectedClients.set(Number(userId), client);
    console.log(`WebSocket подключен: пользователь ${userId}`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.connectedClients.entries()) {
      if (socket.id === client.id) {
        this.connectedClients.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('subscribeToChat')
  handleSubscribe(client: Socket, chatId: number) {
    const session = (client.request as any).session;
    const userId = session?.passport?.user;

    client.join(`chat_${chatId}`);
    return { event: 'subscribed', data: chatId };
  }

  @OnEvent('support.message.sent')
  handleMessageSent(payload: any) {
    this.server
      .to(`chat_${payload.requestId}`)
      .emit('newMessage', payload.message);
  }
}