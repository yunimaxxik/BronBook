import { Book } from './Book';
export type RentalStatus = 'reserved' | 'active' | 'completed' | 'cancelled';

export interface Rental {
  id: number;
  userId: number;
  libraryId: number;
  bookId: number;
  dateStart: string;
  dateEnd: string;
  status: RentalStatus;
  createdAt: string;
  book?: Book;
}
