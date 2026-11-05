import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Library } from './entities/library.entity.js';
import { Book } from './entities/book.entity.js';

export interface SearchBookParams {
  library?: number;
  author?: string;
  title?: string;
  availableOnly?: boolean;
}

@Injectable()
export class LibrariesService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // === Libraries ===

  async createLibrary(data: Partial<Library>): Promise<Library> {
    const library = this.libraryRepository.create(data);
    return this.libraryRepository.save(library);
  }

  async findAllLibraries(): Promise<Library[]> {
    return this.libraryRepository.find();
  }

  async findLibraryById(id: number): Promise<Library> {
    const library = await this.libraryRepository.findOne({
      where: { id },
    });
    if (!library) throw new NotFoundException('Library not found');
    return library;
  }

  // === Books ===

  async createBook(data: Partial<Book>): Promise<Book> {
    const book = this.bookRepository.create(data);
    return this.bookRepository.save(book);
  }

  async findBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: { library: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async searchBooks(params: SearchBookParams): Promise<Book[]> {
    const where: any = {};

    if (params.library) where.libraryId = params.library;
    if (params.author) where.author = Like(`%${params.author}%`);
    if (params.title) where.title = Like(`%${params.title}%`);
    
    if (params.availableOnly) where.availableCopies = MoreThan(0); 

    return this.bookRepository.find({
      where,
      relations: { library: true },
    });
  }
}