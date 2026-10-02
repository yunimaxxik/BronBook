import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // Проверка пользователя для Passport
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        const { passwordHash, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Регистрация нового клиента
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService
      .findByEmail(registerDto.email)
      .catch(() => null);

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.usersService.create({
      ...registerDto,
      passwordHash,
      role: 'client',
    });

    const { passwordHash: _, ...result } = newUser;
    return result;
  }

  async login(user: any) {
    const { passwordHash, ...result } = user;
    return result;
  }
}
