import {
  IsDateString,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  desc: string;

  @IsNumber()
  @Min(5)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDateString()
  expiry: Date;
}
