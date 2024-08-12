import { IsString, IsNumber, Min, IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class CreateDiscountTicketDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit: number; 

  @IsDateString()
  expiry: string;

  @IsMongoId()
  ticket: string; 
}
