import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { LibrariesService, SearchBookParams } from './libraries.service.js';
import { CreateLibraryDto } from './dto/create-library.dto.js';
import { Roles, RolesGuard } from '../common/guards/roles.guard.js';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SessionAuthGuard } from '../common/guards/session-auth.guard.js';

@Controller()
export class LibrariesController {
  constructor(private librariesService: LibrariesService) {}

  // === Публичные эндпоинты ===

  @Get('api/common/books')
  async searchBooks(
    @Query('library') library?: string,
    @Query('author') author?: string,
    @Query('title') title?: string,
    @Query('availableOnly') availableOnly?: string,
  ) {
    const params: SearchBookParams = {
      library: library ? parseInt(library, 10) : undefined,
      author,
      title,
      availableOnly: availableOnly === 'true',
    };
    return this.librariesService.searchBooks(params);
  }

  @Get('api/common/books/:id')
  async getBook(@Param('id', ParseIntPipe) id: number) {
    return this.librariesService.findBookById(id);
  }

  @Get('api/common/libraries')
  async getLibraries() {
    return this.librariesService.findAllLibraries();
  }

  // === Админские эндпоинты ===

  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('api/admin/libraries')
  async createLibrary(@Body() dto: CreateLibraryDto) {
    return this.librariesService.createLibrary(dto);
  }

  @UseGuards(AuthGuard('local'), RolesGuard)
  @Roles('admin')
  @Post('api/admin/books')
  @UseInterceptors(
    FileInterceptor('coverImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async createBook(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const bookData = {
      title: body.title,
      author: body.author,
      year: body.year ? parseInt(body.year, 10) : undefined,
      description: body.description,
      libraryId: parseInt(body.libraryId, 10),
      totalCopies: body.totalCopies ? parseInt(body.totalCopies, 10) : 1,
      availableCopies: body.totalCopies ? parseInt(body.totalCopies, 10) : 1,
      coverImage: file ? `/uploads/${file.filename}` : undefined,
    };
    return this.librariesService.createBook(bookData);
  }
}
