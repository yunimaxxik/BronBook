// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
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
    return this.authService.login(req.user);
  }

  @Post('api/auth/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err: Error | null) => {
      if (err) {
        console.error('Сессия была уничтожена с ошибкой:', err);
        res.status(500).json({ error: 'Ошибка выхода' });
        return;
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Выход выполнен успешно' });
    });
  }
}
