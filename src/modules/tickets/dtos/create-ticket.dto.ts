import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTicketDto {
  _id?: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  desc: string;

  @IsString()
  ImageURL: string;

  @IsNumber()
  @Min(5)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsDateString()
  expiry: Date;
}
