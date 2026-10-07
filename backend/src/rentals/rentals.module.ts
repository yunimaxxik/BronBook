import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRental } from './entities/rental.entity.js';
import { Book } from '../libraries/entities/book.entity.js';
import { RentalsService } from './rentals.service.js';
import { RentalsController } from './rentals.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([BookRental, Book])],
  providers: [RentalsService],
  controllers: [RentalsController],
})
export class RentalsModule {}
