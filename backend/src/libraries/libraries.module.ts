import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from './entities/library.entity.js';
import { Book } from './entities/book.entity.js';
import { LibrariesService } from './libraries.service.js';
import { LibrariesController } from './libraries.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Book])],
  providers: [LibrariesService],
  controllers: [LibrariesController],
  exports: [LibrariesService],
})
export class LibrariesModule {}
