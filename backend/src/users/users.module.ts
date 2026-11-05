import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { RolesGuard } from '../common/guards/roles.guard.js'; 

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], 
  providers: [UsersService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}