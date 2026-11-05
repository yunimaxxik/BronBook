import { Controller, Get, Param, Delete, Patch, Body, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';
import { RolesGuard, Roles } from '../common/guards/roles.guard.js';

@Controller('users')
@UseGuards(SessionAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Получить список пользователей (доступно всем авторизованным)
  @Get()
  async findAll(@Query() query: any) {
    return this.usersService.findAll({
      limit: Number(query.limit) || 10,
      offset: Number(query.offset) || 0,
      email: query.email || '',
      name: query.name || '',
      contactPhone: query.contactPhone || '',
    });
  }

  // Получить одного пользователя
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  // Обновить данные (Только Админ)
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ) {
    return this.usersService.update(id, updateData);
  }

  // Удалить пользователя (Только Админ)
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return { success: true };
  }
}