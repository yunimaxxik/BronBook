import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext } from '@nestjs/common';

export class SessionIoAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const server = super.createIOServer(port, options);
    
    const sessionMiddleware = (this.app as any)
      .getHttpAdapter()
      .getInstance()
      .get('SESSION_MIDDLEWARE');

    if (sessionMiddleware) {
      server.engine.use(sessionMiddleware);
    }
    return server;
  }
}