import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void) {
    done(null, user.id);
  }

  async deserializeUser(
    userId: number,
    done: (err: Error | null, user: User | null) => void,
  ) {
    try {
      const user = await this.usersService.findById(userId);
      const { passwordHash, ...result } = user;
      done(null, result as User);
    } catch (err: any) {
      done(err, null);
    }
  }
}