import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Book } from '../../libraries/entities/book.entity.js';
import type { Library } from '../../libraries/entities/library.entity.js';
import type { User } from '../../users/entities/user.entity.js';

export type RentalStatus = 'reserved' | 'active' | 'completed' | 'cancelled';

@Entity('rentals')
export class BookRental {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  libraryId: number;

  @Column()
  bookId: number;

  @Column({ type: 'date' })
  dateStart: Date;

  @Column({ type: 'date' })
  dateEnd: Date;

  @Column({ type: 'varchar', default: 'reserved' })
  status: RentalStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('Book', { eager: false })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne('Library', { eager: false })
  @JoinColumn({ name: 'libraryId' })
  library: Library;

  @ManyToOne('User', { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
