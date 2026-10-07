import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSupportRequestDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}
