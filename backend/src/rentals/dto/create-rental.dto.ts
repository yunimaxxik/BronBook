import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsInt()
  @IsNotEmpty()
  libraryId: number;

  @IsDateString()
  @IsNotEmpty()
  dateStart: string;

  @IsDateString()
  @IsNotEmpty()
  dateEnd: string;
}
