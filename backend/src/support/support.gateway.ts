import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class SupportGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<number, Socket>();

  constructor(private eventEmitter: EventEmitter2) {}

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.connectedClients.set(userId, client);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    if (userId) {
      this.connectedClients.delete(userId);
    }
  }

  @SubscribeMessage('subscribeToChat')
  handleSubscribe(client: Socket, chatId: number) {
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
