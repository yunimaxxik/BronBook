import { Library } from './Library';

export interface Book {
  id: number;
  libraryId: number;
  title: string;
  author: string;
  year?: number;
  description?: string;
  coverImage?: string;
  isAvailable: boolean;
  totalCopies: number;
  availableCopies: number;
  library?: Library;
}
