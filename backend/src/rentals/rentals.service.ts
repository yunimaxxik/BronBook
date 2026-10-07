import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BookRental } from './entities/rental.entity.js';
import { Book } from '../libraries/entities/book.entity.js';
import { CreateRentalDto } from './dto/create-rental.dto.js';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(BookRental)
    private rentalRepository: Repository<BookRental>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private dataSource: DataSource, // Для транзакций
  ) {}

  async createRental(
    userId: number,
    dto: CreateRentalDto,
  ): Promise<BookRental> {
    // Используем транзакцию, чтобы гарантировать целостность данных
    return this.dataSource.transaction(async (manager) => {
      // 1. Находим книгу с блокировкой (FOR UPDATE), чтобы никто другой не забрал её одновременно
      const book = await manager.findOne(Book, {
        where: { id: dto.bookId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book) {
        throw new NotFoundException('Книга не найдена');
      }

      if (book.libraryId !== dto.libraryId) {
        throw new BadRequestException(
          'Книга не принадлежит выбранной библиотеке',
        );
      }

      if (book.availableCopies <= 0) {
        throw new ConflictException(
          'К сожалению, все экземпляры этой книги уже забронированы',
        );
      }

      // Проверка дат (дата конца должна быть позже даты начала)
      const startDate = new Date(dto.dateStart);
      const endDate = new Date(dto.dateEnd);
      if (endDate <= startDate) {
        throw new BadRequestException(
          'Дата возврата должна быть позже даты получения',
        );
      }

      // 2. Уменьшаем количество доступных копий
      book.availableCopies -= 1;
      await manager.save(Book, book);

      // 3. Создаём запись об аренде
      const rental = manager.create(BookRental, {
        userId,
        libraryId: dto.libraryId,
        bookId: dto.bookId,
        dateStart: startDate,
        dateEnd: endDate,
        status: 'reserved',
      });

      return manager.save(BookRental, rental);
    });
  }

  async getUserRentals(userId: number): Promise<BookRental[]> {
    return this.rentalRepository.find({
      where: { userId },
      relations: {
        book: {
          library: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }
}
