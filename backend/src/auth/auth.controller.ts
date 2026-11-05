import { Controller, Post, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('api/client/register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('api/auth/login')
  async login(@Req() req: Request, @Body() loginDto: LoginDto) {
    if (!req.user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return new Promise((resolve, reject) => {
      req.logIn(req.user!, (err: any) => {
        if (err) {
          return reject(new UnauthorizedException('Ошибка входа'));
        }
        resolve(this.authService.login(req.user));
      });
    });
  }

  @Post('api/auth/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout(() => {
      req.session.destroy((err: any) => { 
        if (err) {
          console.error('Сессия была уничтожена с ошибкой:', err);
          res.status(500).json({ error: 'Ошибка выхода' });
          return;
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Выход выполнен успешно' });
      });
    });
  }
}