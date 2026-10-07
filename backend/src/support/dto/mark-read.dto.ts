import { IsDateString } from 'class-validator';

export class MarkMessagesAsReadDto {
  @IsDateString()
  createdBefore: string;
}
